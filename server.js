import 'dotenv/config';
import express from 'express';
import path from 'path';
import crypto from 'crypto';
import mysql from 'mysql2/promise';
import fs from 'fs';
import { fileURLToPath } from 'url';

/* -------------------------------------------------------------------------- */
/*                               PATHS / APP INIT                             */
/* -------------------------------------------------------------------------- */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, 'public');

const app = express();
const port = Number(process.env.PORT || 3000);

/**
 * Trust proxy:
 * - Using "loopback" prevents arbitrary client spoofing of X-Forwarded-For.
 * - If you deploy behind a non-loopback reverse proxy, adjust this to the LB IP/CIDR.
 */
app.set('trust proxy', 'loopback');

/* -------------------------------------------------------------------------- */
/*                             SECURITY HEADERS (CSP)                         */
/* -------------------------------------------------------------------------- */

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // Simple CSP suitable for this app (static HTML + local JS/CSS)
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "connect-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  );

  // HSTS (only enable if you're serving strictly over HTTPS in production)
  if (req.secure || process.env.FORCE_HTTPS === 'true') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  next();
});

/* -------------------------------------------------------------------------- */
/*                       CACHING + STATIC + BODY PARSING                      */
/* -------------------------------------------------------------------------- */

// Never cache HTML or main JS app modules
app.use((req, res, next) => {
  if (req.path.endsWith('.html') || req.path === '/' || req.path === '/index') {
    res.set('Cache-Control', 'no-store');
  }
  if (req.path.endsWith('/app.js') || req.path === '/app.js') {
    res.set('Cache-Control', 'no-store');
  }
  next();
});

app.use(express.static(publicDir));

app.use(
  express.json({
    limit: '1mb',
  })
);

app.use(express.urlencoded({ extended: true }));

// JSON parse error guard
app.use((err, _req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('[json] parse error:', err.message);
    return res.status(400).json({ error: 'invalid_json' });
  }
  return next(err);
});

/* -------------------------------------------------------------------------- */
/*                              PRETTY HTML ROUTES                            */
/* -------------------------------------------------------------------------- */

app.get(['/', '/index', '/index.html'], (_req, res) =>
  res.sendFile(path.join(publicDir, 'index.html'))
);
app.get(['/presidents', '/presidents.html'], (_req, res) =>
  res.sendFile(path.join(publicDir, 'presidents.html'))
);
app.get(['/admin', '/admin.html'], (_req, res) =>
  res.sendFile(path.join(publicDir, 'admin.html'))
);

/* -------------------------------------------------------------------------- */
/*                                DB CONNECTION                               */
/* -------------------------------------------------------------------------- */

function poolFromUrl(url) {
  const u = new URL(url);
  return mysql.createPool({
    host: u.hostname,
    port: Number(u.port || 3306),
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.slice(1),
    waitForConnections: true,
    connectionLimit: 10,
    ssl:
      process.env.MYSQL_SSL === 'true'
        ? {
            rejectUnauthorized: true,
            // If your provider needs a custom CA, you can set MYSQL_CA_PATH:
            // ca: process.env.MYSQL_CA_PATH
            //   ? fs.readFileSync(process.env.MYSQL_CA_PATH, 'utf8')
            //   : undefined,
          }
        : undefined,
  });
}

const pool =
  process.env.MYSQL_URL && process.env.MYSQL_URL.trim()
    ? poolFromUrl(process.env.MYSQL_URL)
    : mysql.createPool({
        host: process.env.MYSQL_HOST || '127.0.0.1',
        port: Number(process.env.MYSQL_PORT || 3306),
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'clubs_db',
        waitForConnections: true,
        connectionLimit: 10,
        ssl:
          process.env.MYSQL_SSL === 'true'
            ? {
                rejectUnauthorized: true,
                // ca: process.env.MYSQL_CA_PATH
                //   ? fs.readFileSync(process.env.MYSQL_CA_PATH, 'utf8')
                //   : undefined,
              }
            : undefined,
      });

try {
  const conn = await pool.getConnection();
  conn.release();
  console.log('[db] OK connected');
} catch (e) {
  console.error('[db] connection failed:', e.code || e.message);
}

/* -------------------------------------------------------------------------- */
/*                           RATE LIMITING HELPERS                            */
/* -------------------------------------------------------------------------- */

const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000);
const RATE_LIMIT_MAX_ATTEMPTS = Number(process.env.RATE_LIMIT_MAX_ATTEMPTS || 5);
const __attempts = new Map();

const sha256Hex = (s) => crypto.createHash('sha256').update(String(s)).digest('hex');

function rlKey(req, bucket) {
  const ip = req.ip || (req.connection && req.connection.remoteAddress) || 'unknown';
  return `${bucket}:${ip}`;
}

function rlPurge(arr) {
  const now = Date.now();
  return arr.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
}

function rlIsLimited(req, bucket) {
  const k = rlKey(req, bucket);
  const arr = rlPurge(__attempts.get(k) || []);
  __attempts.set(k, arr);
  return arr.length >= RATE_LIMIT_MAX_ATTEMPTS;
}

function rlRecordFailure(req, bucket) {
  const k = rlKey(req, bucket);
  const arr = rlPurge(__attempts.get(k) || []);
  arr.push(Date.now());
  __attempts.set(k, arr);
}

function rlClear(req, bucket) {
  __attempts.delete(rlKey(req, bucket));
}

/* -------------------------------------------------------------------------- */
/*                          ADMIN AUTH / SESSION MODEL                        */
/* -------------------------------------------------------------------------- */

function getAdminCode() {
  return (process.env.ADMIN_CODE ?? '').toString().trim();
}
function hasAdminConfigured() {
  return getAdminCode().length > 0;
}

/**
 * Server-side admin sessions (short-lived)
 */
const ADMIN_SESSIONS = new Map(); // sessionId -> { createdAt, ip }

function createAdminSession(ip) {
  const sessionId = crypto.randomBytes(32).toString('hex');
  ADMIN_SESSIONS.set(sessionId, { createdAt: Date.now(), ip });
  return sessionId;
}

function isAdminSessionValid(req) {
  const sid = req.get('x-admin-session') || '';
  if (!sid) return false;

  const sess = ADMIN_SESSIONS.get(sid);
  if (!sess) return false;

  const MAX_AGE = 2 * 60 * 60 * 1000; // 2h
  if (Date.now() - sess.createdAt > MAX_AGE) {
    ADMIN_SESSIONS.delete(sid);
    return false;
  }

  // Optional IP binding for extra safety:
  if (sess.ip && sess.ip !== req.ip) {
    return false;
  }

  return true;
}

/* -------------------------------------------------------------------------- */
/*                    NORMALIZATION / SANITIZATION HELPERS                    */
/* -------------------------------------------------------------------------- */

/**
 * Strictly safe website URL normalization.
 * - Allows only http(s) URLs.
 * - Bare domains are prefixed with https://
 * - Anything else -> empty string.
 */
function normalizeWebsiteUrl(url) {
  if (!url) return null;
  let u = String(url).trim();
  if (!u) return null;

  // Add protocol if it "looks" like a domain
  if (!/^https?:\/\//i.test(u) && (u.includes('.') || u.startsWith('www.'))) {
    u = 'https://' + u.replace(/^\/+/, '');
  }

  // Final safety: only http(s) allowed
  if (!/^https?:\/\//i.test(u)) return null;

  return u;
}

function stripTags(str) {
  if (!str) return '';
  return String(str).replace(/<[^>]*>/g, '');
}

function clampLength(str, max) {
  if (!str) return '';
  const s = String(str);
  return s.length > max ? s.slice(0, max) : s;
}

const PROFANITY_PATTERNS = [
  /\bfuck\b/i,
  /\bshit\b/i,
  /\bbitch\b/i,
  /\basshole\b/i,
  /\bbastard\b/i,
  /\bdick\b/i,
  /\bslut\b/i,
  /\bwhore\b/i,
];

function hasProfanity(text) {
  if (!text) return false;
  const s = String(text).toLowerCase();
  return PROFANITY_PATTERNS.some((re) => re.test(s));
}

function profanityFields(map) {
  const bad = [];
  for (const [field, value] of Object.entries(map)) {
    if (hasProfanity(value)) bad.push(field);
  }
  return bad;
}

/* -------------------------------------------------------------------------- */
/*                             SCHEMA / MIGRATIONS                            */
/* -------------------------------------------------------------------------- */

async function ensureColumnIfMissing(table, column, ddl) {
  const [[row]] = await pool.query(
    `
    SELECT COUNT(*) AS n
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME=? AND COLUMN_NAME=?
  `,
    [table, column]
  );
  if (!row.n) {
    await pool.query(ddl);
    console.log(`[schema] Added ${table}.${column}`);
  }
}

async function dropIndexIfExists(table, indexName) {
  const [rows] = await pool.query(
    `
    SELECT INDEX_NAME
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME=? AND INDEX_NAME=?
  `,
    [table, indexName]
  );
  if (rows.length) {
    await pool.query(`ALTER TABLE \`${table}\` DROP INDEX \`${indexName}\``);
    console.log(`[schema] Dropped index ${table}.${indexName}`);
    return true;
  }
  return false;
}

async function ensureBaseTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS clubs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      subject VARCHAR(50) NOT NULL DEFAULT 'Other',
      meeting_frequency ENUM('weekly','biweekly','monthly','event') NOT NULL DEFAULT 'weekly',
      meeting_time_type ENUM('lunch','after_school') NOT NULL DEFAULT 'lunch',
      meeting_time_range VARCHAR(50) DEFAULT '',
      meeting_room VARCHAR(50) DEFAULT '',
      open_to_all TINYINT(1) NOT NULL DEFAULT 1,
      prereq_required TINYINT(1) NOT NULL DEFAULT 0,
      prerequisites VARCHAR(255) DEFAULT '',
      description TEXT,
      volunteer_hours TINYINT(1) NOT NULL DEFAULT 0,
      president_code VARCHAR(64) NOT NULL DEFAULT '',
      status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'approved',
      website_url VARCHAR(512) DEFAULT NULL,
      president_contact VARCHAR(255) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_name (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}

async function ensurePresidentContactColumn() {
  await ensureColumnIfMissing(
    'clubs',
    'president_contact',
    `ALTER TABLE clubs ADD COLUMN president_contact VARCHAR(255) DEFAULT NULL`
  );
}

async function ensureMeetingDays() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS meeting_days (
      id INT PRIMARY KEY,
      name VARCHAR(20) NOT NULL UNIQUE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  try {
    await pool.query(`
      INSERT INTO meeting_days (id,name) VALUES
        (1,'Monday'),(2,'Tuesday'),(3,'Wednesday'),(4,'Thursday'),(5,'Friday'),
        (6,'Saturday'),(7,'Sunday')
      AS new ON DUPLICATE KEY UPDATE name=new.name
    `);
  } catch {
    await pool.query(`
      INSERT INTO meeting_days (id,name) VALUES
        (1,'Monday'),(2,'Tuesday'),(3,'Wednesday'),(4,'Thursday'),(5,'Friday'),
        (6,'Saturday'),(7,'Sunday')
      ON DUPLICATE KEY UPDATE name=VALUES(name)
    `);
  }
}

async function ensureSubfieldsBase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS subfields (
      id INT AUTO_INCREMENT PRIMARY KEY,
      label VARCHAR(100) NOT NULL UNIQUE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}

async function ensureLinkTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS club_subfields (
      club_id INT NOT NULL,
      subfield_id INT NOT NULL,
      PRIMARY KEY (club_id, subfield_id),
      CONSTRAINT fk_cs_club FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
      CONSTRAINT fk_cs_sub FOREIGN KEY (subfield_id) REFERENCES subfields(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS club_meeting_days (
      club_id INT NOT NULL,
      day_id INT NOT NULL,
      PRIMARY KEY (club_id, day_id),
      CONSTRAINT fk_cmd_club FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
      CONSTRAINT fk_cmd_day FOREIGN KEY (day_id) REFERENCES meeting_days(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}

async function ensureClubCategories() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS club_categories (
      club_id INT NOT NULL,
      category VARCHAR(50) NOT NULL,
      PRIMARY KEY (club_id, category),
      CONSTRAINT fk_cc_club FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}

async function ensureClubFields() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS club_fields (
      club_id INT NOT NULL,
      field_label VARCHAR(100) NOT NULL,
      PRIMARY KEY (club_id, field_label),
      CONSTRAINT fk_cf_club FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}

async function ensureUniqueNameIndex() {
  await dropIndexIfExists('clubs', 'uq_name_code').catch(() => {});

  const [dups] = await pool.query(`
    SELECT name, COUNT(*) AS n
    FROM clubs
    GROUP BY name
    HAVING n > 1
  `);
  if (dups.length) {
    console.warn(
      `[schema] Found ${dups.length} duplicate club names; cannot enforce unique(name) yet.`
    );
    return;
  }

  try {
    await pool.query(`ALTER TABLE clubs ADD UNIQUE KEY uq_name (name)`);
    console.log('[schema] Ensured unique index clubs(name)');
  } catch (e) {
    if (e && String(e.code || '').includes('ER_DUP')) {
      console.warn('[schema] Could not add unique(name): duplicate data exists.');
    } else if (String(e.message || '').includes('Duplicate key name')) {
      // index already exists
    } else {
      console.warn('[schema] unique(name) check:', e.code || e.message);
    }
  }
}

async function ensureSchema() {
  await ensureBaseTables();
  await ensureMeetingDays();
  await ensureSubfieldsBase();
  await ensureLinkTables();
  await ensureClubCategories();
  await ensureClubFields();
  await ensurePresidentContactColumn();
  await ensureUniqueNameIndex();
}

(async () => {
  try {
    const [r] = await pool.query('SELECT 1');
    if (r) console.log('[db] ping ok');
    await ensureSchema();
  } catch (e) {
    console.error('[schema] failed:', e.code || e.message);
  }
})();

/* -------------------------------------------------------------------------- */
/*                                  CONSTANTS                                 */
/* -------------------------------------------------------------------------- */

const daysLookup = new Map([
  ['Monday', 1],
  ['Tuesday', 2],
  ['Wednesday', 3],
  ['Thursday', 4],
  ['Friday', 5],
  ['Saturday', 6],
  ['Sunday', 7],
]);

const ALLOWED_CATEGORIES = new Set([
  'competition',
  'activity',
  'community',
  'research',
  'advocacy',
  'outreach',
]);
const MEETING_FREQUENCIES = new Set(['weekly', 'biweekly', 'monthly', 'event']);
const TIME_TYPES = new Set(['lunch', 'after_school']);

/* -------------------------------------------------------------------------- */
/*                                   HEALTH                                   */
/* -------------------------------------------------------------------------- */

app.get('/healthz', (_req, res) => res.json({ ok: true }));

/* -------------------------------------------------------------------------- */
/*                             PUBLIC: LIST CLUBS                             */
/* -------------------------------------------------------------------------- */

app.get('/api/clubs', async (req, res) => {
  try {
    const includePending = req.query.includePending === '1' && isAdminSessionValid(req);

    const [rows] = await pool.query(
      `
      SELECT c.id,
             c.name,
             c.subject,
             c.meeting_time_type,
             c.meeting_time_range,
             c.meeting_frequency,
             c.prereq_required,
             c.prerequisites,
             c.description,
             c.open_to_all,
             c.volunteer_hours,
             c.status,
             c.website_url,
             c.meeting_room,
             c.president_contact
        FROM clubs c
       WHERE ? OR c.status = 'approved'
       ORDER BY c.name
    `,
      [includePending ? 1 : 0]
    );

    const ids = rows.map((r) => r.id);
    if (!ids.length) return res.json({ clubs: [] });

    const [sf] = await pool.query(
      `
      SELECT cs.club_id, s.label
      FROM club_subfields cs
      JOIN subfields s ON s.id = cs.subfield_id
      WHERE cs.club_id IN (?)
    `,
      [ids]
    );
    const [md] = await pool.query(
      `
      SELECT cmd.club_id, d.name
      FROM club_meeting_days cmd
      JOIN meeting_days d ON d.id = cmd.day_id
      WHERE cmd.club_id IN (?)
    `,
      [ids]
    );
    const [cats] = await pool.query(
      `SELECT club_id, category FROM club_categories WHERE club_id IN (?)`,
      [ids]
    );
    const [flds] = await pool.query(
      `SELECT club_id, field_label FROM club_fields WHERE club_id IN (?)`,
      [ids]
    );

    const mapById = new Map(
      rows.map((r) => [
        r.id,
        {
          id: r.id,
          name: r.name,
          subject: r.subject,
          meeting_time_type: r.meeting_time_type,
          meeting_time_range: r.meeting_time_range,
          meeting_frequency: r.meeting_frequency,
          prereq_required: !!r.prereq_required,
          prerequisites: r.prerequisites || '',
          description: r.description || '',
          open_to_all: !!r.open_to_all,
          volunteer_hours: !!r.volunteer_hours,
          status: r.status,
          website_url: r.website_url || null,
          meeting_room: r.meeting_room || '',
          president_contact: r.president_contact || null,
          subfield: [],
          meeting_days: [],
          categories: [],
          fields: [],
        },
      ])
    );

    sf.forEach((r) => {
      const v = mapById.get(r.club_id);
      if (v) v.subfield.push(r.label);
    });
    md.forEach((r) => {
      const v = mapById.get(r.club_id);
      if (v) v.meeting_days.push(r.name);
    });
    cats.forEach((r) => {
      const v = mapById.get(r.club_id);
      if (v) v.categories.push(r.category);
    });
    flds.forEach((r) => {
      const v = mapById.get(r.club_id);
      if (v) v.fields.push(r.field_label);
    });

    mapById.forEach((v) => {
      if (!v.fields.length && v.subject) v.fields = [v.subject];
    });

    res.json({ clubs: [...mapById.values()] });
  } catch (e) {
    console.error('/api/clubs error:', e.code || e.message);
    res.status(500).json({ error: 'db_error' });
  }
});

/* -------------------------------------------------------------------------- */
/*                     PUBLIC: SINGLE CLUB (APPROVED ONLY)                    */
/* -------------------------------------------------------------------------- */

app.get('/api/clubs/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'invalid_id' });

    const includePending = req.query.includePending === '1' && isAdminSessionValid(req);
    const sql = includePending
      ? `SELECT * FROM clubs WHERE id=?`
      : `SELECT * FROM clubs WHERE id=? AND status='approved'`;

    const [[club]] = await pool.query(sql, [id]);
    if (!club) return res.status(404).json({ error: 'not_found' });

    const [sf] = await pool.query(
      `
      SELECT s.label
      FROM club_subfields cs
      JOIN subfields s ON s.id = cs.subfield_id
      WHERE cs.club_id = ?
    `,
      [id]
    );
    const [md] = await pool.query(
      `
      SELECT d.name
      FROM club_meeting_days cmd
      JOIN meeting_days d ON d.id = cmd.day_id
      WHERE cmd.club_id = ?
    `,
      [id]
    );
    const [cats] = await pool.query(`SELECT category FROM club_categories WHERE club_id=?`, [id]);
    const [flds] = await pool.query(
      `SELECT field_label FROM club_fields WHERE club_id=?`,
      [id]
    );

    club.subfield = sf.map((r) => r.label);
    club.meeting_days = md.map((r) => r.name);
    club.categories = cats.map((r) => r.category);
    club.fields = flds.length ? flds.map((r) => r.field_label) : club.subject ? [club.subject] : [];

    res.json({ club });
  } catch (e) {
    console.error('/api/clubs/:id error:', e.code || e.message);
    res.status(500).json({ error: 'db_error' });
  }
});

/* -------------------------------------------------------------------------- */
/*                              ADMIN: LOGIN                                  */
/* -------------------------------------------------------------------------- */

app.post('/api/admin/login', (req, res) => {
  if (!hasAdminConfigured()) {
    return res.status(500).json({ error: 'admin_not_configured' });
  }
  if (rlIsLimited(req, 'admin_login')) {
    return res.status(429).json({ error: 'rate_limited' });
  }

  const { code = '', code_hash = '' } = req.body || {};
  const admin = getAdminCode();
  const ok = (code && code === admin) || (code_hash && code_hash === sha256Hex(admin));

  if (!ok) {
    rlRecordFailure(req, 'admin_login');
    return res.status(401).json({ error: 'invalid' });
  }

  rlClear(req, 'admin_login');
  const sessionId = createAdminSession(req.ip);
  res.json({ ok: true, session: sessionId });
});

/* -------------------------------------------------------------------------- */
/*                          ADMIN: LIST ALL CLUBS                             */
/* -------------------------------------------------------------------------- */

app.get('/api/admin/clubs', async (req, res) => {
  if (!isAdminSessionValid(req)) return res.status(401).json({ error: 'unauthorized' });

  try {
    const [rows] = await pool.query(
      `
      SELECT id,
             name,
             subject,
             meeting_time_type,
             meeting_time_range,
             meeting_frequency,
             prereq_required,
             prerequisites,
             description,
             open_to_all,
             volunteer_hours,
             status,
             website_url,
             meeting_room,
             president_contact
      FROM clubs
      ORDER BY name
    `
    );

    const ids = rows.map((r) => r.id);
    if (!ids.length) return res.json({ clubs: [] });

    const [sf] = await pool.query(
      `
      SELECT cs.club_id, s.label
      FROM club_subfields cs
      JOIN subfields s ON s.id = cs.subfield_id
      WHERE cs.club_id IN (?)
    `,
      [ids]
    );
    const [md] = await pool.query(
      `
      SELECT cmd.club_id, d.name
      FROM club_meeting_days cmd
      JOIN meeting_days d ON d.id = cmd.day_id
      WHERE cmd.club_id IN (?)
    `,
      [ids]
    );
    const [cats] = await pool.query(
      `SELECT club_id, category FROM club_categories WHERE club_id IN (?)`,
      [ids]
    );
    const [flds] = await pool.query(
      `SELECT club_id, field_label FROM club_fields WHERE club_id IN (?)`,
      [ids]
    );

    const mapById = new Map(
      rows.map((r) => [
        r.id,
        {
          id: r.id,
          name: r.name,
          subject: r.subject,
          meeting_time_type: r.meeting_time_type,
          meeting_time_range: r.meeting_time_range,
          meeting_frequency: r.meeting_frequency,
          prereq_required: !!r.prereq_required,
          prerequisites: r.prerequisites || '',
          description: r.description || '',
          open_to_all: !!r.open_to_all,
          volunteer_hours: !!r.volunteer_hours,
          status: r.status,
          website_url: r.website_url || null,
          meeting_room: r.meeting_room || '',
          president_contact: r.president_contact || null,
          subfield: [],
          meeting_days: [],
          categories: [],
          fields: [],
        },
      ])
    );

    sf.forEach((r) => {
      const v = mapById.get(r.club_id);
      if (v) v.subfield.push(r.label);
    });
    md.forEach((r) => {
      const v = mapById.get(r.club_id);
      if (v) v.meeting_days.push(r.name);
    });
    cats.forEach((r) => {
      const v = mapById.get(r.club_id);
      if (v) v.categories.push(r.category);
    });
    flds.forEach((r) => {
      const v = mapById.get(r.club_id);
      if (v) v.fields.push(r.field_label);
    });

    mapById.forEach((v) => {
      if (!v.fields.length && v.subject) v.fields = [v.subject];
    });

    res.json({ clubs: [...mapById.values()] });
  } catch (e) {
    console.error('/api/admin/clubs error:', e.code || e.message);
    res.status(500).json({ error: 'db_error' });
  }
});

/* -------------------------------------------------------------------------- */
/*                      ADMIN: APPROVE / PATCH / DELETE                       */
/* -------------------------------------------------------------------------- */

app.post('/api/clubs/:id/approve', async (req, res) => {
  if (!isAdminSessionValid(req)) return res.status(401).json({ error: 'unauthorized' });

  // Basic rate-limit for destructive admin actions (per IP)
  if (rlIsLimited(req, 'admin_write')) {
    return res.status(429).json({ error: 'rate_limited' });
  }

  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'invalid_id' });

    await pool.query(`UPDATE clubs SET status='approved' WHERE id=?`, [id]);
    res.json({ ok: true });
  } catch (e) {
    console.error('approve error:', e.code || e.message);
    rlRecordFailure(req, 'admin_write');
    res.status(500).json({ error: 'db_error' });
  }
});

// Admin PATCH for fully editing a club (used by presidents.js admin path)
app.patch('/api/clubs/:id', async (req, res) => {
  if (!isAdminSessionValid(req)) return res.status(401).json({ error: 'unauthorized' });

  if (rlIsLimited(req, 'admin_write')) {
    return res.status(429).json({ error: 'rate_limited' });
  }

  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'invalid_id' });

    const body = req && req.body && typeof req.body === 'object' ? req.body : {};

    let name = clampLength(stripTags(String(body.name || '').trim()), 120);
    let president_contact = clampLength(
      stripTags(String(body.president_contact || '').trim()),
      255
    );
    let website_url = normalizeWebsiteUrl(stripTags(body.website_url || ''));
    let meeting_room = clampLength(stripTags(String(body.meeting_room || '').trim()), 50);
    let meeting_time_type = String(body.meeting_time_type || '').trim();
    let meeting_time_range = clampLength(
      stripTags(String(body.meeting_time_range || '').trim()),
      50
    );
    let meeting_frequency = String(body.meeting_frequency || '').trim();
    let description = stripTags(String(body.description || '').trim());
    let prerequisites = clampLength(
      stripTags(String(body.prerequisites || '').trim()),
      255
    );

    const fields = Array.isArray(body.fields) ? body.fields : [];
    const categories = (Array.isArray(body.categories) ? body.categories : []).filter((c) =>
      ALLOWED_CATEGORIES.has(c)
    );
    const subfields = Array.isArray(body.subfields) ? body.subfields : [];
    const meeting_days = Array.isArray(body.meeting_days) ? body.meeting_days : [];

    const open_to_all = !!body.open_to_all;
    const prereq_required = !!body.prereq_required;
    const volunteer_hours = !!body.volunteer_hours;

    // Required checks (same as presidents.js flow)
    const missing = [];
    if (!name) missing.push('name');
    if (!meeting_frequency || !MEETING_FREQUENCIES.has(meeting_frequency)) {
      missing.push('meeting_frequency');
    }
    if (!meeting_time_type || !TIME_TYPES.has(meeting_time_type)) {
      missing.push('meeting_time_type');
    }
    if (!meeting_days.length) missing.push('meeting_days');
    if (meeting_time_type === 'after_school' && !meeting_time_range) {
      missing.push('meeting_time_range');
    }
    if (!meeting_room) missing.push('meeting_room');

    if (missing.length) {
      return res.status(400).json({ error: 'missing_required', fields: missing });
    }

    const words = (description.match(/\S+/g) || []).length;
    if (words > 200) {
      return res.status(400).json({ error: 'desc_too_long', words });
    }
    description = clampLength(description, 4000);

    const profFields = profanityFields({
      name,
      description,
      prerequisites,
      meeting_room,
      meeting_time_range,
    });
    if (profFields.length) {
      return res.status(400).json({ error: 'profanity', fields: profFields });
    }

    const subject = clampLength(
      (fields[0] || 'Other').trim() || 'Other',
      50
    );

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query(
        `
        UPDATE clubs SET
          name=?,
          subject=?,
          meeting_frequency=?,
          meeting_time_type=?,
          meeting_time_range=?,
          meeting_room=?,
          open_to_all=?,
          prereq_required=?,
          prerequisites=?,
          description=?,
          volunteer_hours=?,
          website_url=?,
          president_contact=?
        WHERE id=?
      `,
        [
          name,
          subject,
          meeting_frequency,
          meeting_time_type,
          meeting_time_range,
          meeting_room || '',
          open_to_all ? 1 : 0,
          prereq_required ? 1 : 0,
          prerequisites,
          description,
          volunteer_hours ? 1 : 0,
          website_url,
          president_contact || null,
          id,
        ]
      );

      // Meeting days
      await conn.query(`DELETE FROM club_meeting_days WHERE club_id=?`, [id]);
      if (meeting_days.length) {
        const rows = meeting_days
          .map((d) => daysLookup.get(d))
          .filter(Boolean)
          .map((dayId) => [id, dayId]);
        if (rows.length) {
          await conn.query(
            `INSERT INTO club_meeting_days (club_id, day_id) VALUES ?`,
            [rows]
          );
        }
      }

      // Subfields
      for (const label of subfields) {
        const trimmed = clampLength(stripTags(String(label || '').trim()), 100);
        if (!trimmed) continue;
        await conn.query(`INSERT IGNORE INTO subfields (label) VALUES (?)`, [trimmed]);
      }

      let sfRows = [];
      if (subfields.length) {
        const cleanLabels = subfields
          .map((s) => clampLength(stripTags(String(s || '').trim()), 100))
          .filter(Boolean);
        if (cleanLabels.length) {
          const [rowsSF] = await conn.query(
            `SELECT id, label FROM subfields WHERE label IN (?)`,
            [cleanLabels]
          );
          sfRows = rowsSF;
        }
      }

      await conn.query(`DELETE FROM club_subfields WHERE club_id=?`, [id]);
      if (sfRows.length) {
        const vals = sfRows.map((r) => [id, r.id]);
        await conn.query(
          `INSERT INTO club_subfields (club_id, subfield_id) VALUES ?`,
          [vals]
        );
      }

      // Categories
      await conn.query(`DELETE FROM club_categories WHERE club_id=?`, [id]);
      if (categories.length) {
        const vals = categories.map((c) => [id, c]);
        await conn.query(
          `INSERT INTO club_categories (club_id, category) VALUES ?`,
          [vals]
        );
      }

      // Fields
      await conn.query(`DELETE FROM club_fields WHERE club_id=?`, [id]);
      if (fields.length) {
        const vals = fields
          .map((f) => clampLength(stripTags(String(f || '').trim()), 100))
          .filter(Boolean)
          .map((f) => [id, f]);
        if (vals.length) {
          await conn.query(
            `INSERT INTO club_fields (club_id, field_label) VALUES ?`,
            [vals]
          );
        }
      }

      await conn.commit();
      res.json({ ok: true });
    } catch (e) {
      await conn.rollback();
      console.error('patch error:', e.code || e.message);
      rlRecordFailure(req, 'admin_write');

      if (e && (e.code === 'ER_DUP_ENTRY' || /Duplicate entry/.test(String(e.message || '')))) {
        return res.status(409).json({ error: 'duplicate_name' });
      }

      res.status(500).json({ error: 'db_error' });
    } finally {
      conn.release();
    }
  } catch (e) {
    console.error('patch error:', e.code || e.message);
    rlRecordFailure(req, 'admin_write');
    res.status(500).json({ error: 'db_error' });
  }
});

app.delete('/api/clubs/:id', async (req, res) => {
  if (!isAdminSessionValid(req)) return res.status(401).json({ error: 'unauthorized' });

  if (rlIsLimited(req, 'admin_write')) {
    return res.status(429).json({ error: 'rate_limited' });
  }

  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'invalid_id' });

    await pool.query(`DELETE FROM clubs WHERE id=?`, [id]);
    res.json({ ok: true });
  } catch (e) {
    console.error('delete error:', e.code || e.message);
    rlRecordFailure(req, 'admin_write');
    res.status(500).json({ error: 'db_error' });
  }
});

/* -------------------------------------------------------------------------- */
/*                     PRESIDENTS: SUBMIT / UPDATE CLUBS                      */
/* -------------------------------------------------------------------------- */

app.post('/api/presidents/submit', async (req, res) => {
  try {
    if (rlIsLimited(req, 'pres_submit')) {
      return res.status(429).json({ error: 'rate_limited' });
    }

    const body = req.body || {};
    const expected = process.env.PRESIDENT_PASSWORD || '';
    const submitPwd = body.president_submit_password || body.password || '';

    if (!submitPwd || submitPwd !== expected) {
      rlRecordFailure(req, 'pres_submit');
      return res.status(401).json({ error: 'unauthorized', reason: 'bad_president_password' });
    }
    rlClear(req, 'pres_submit');

    // Normalized & sanitized fields
    let club_name = String(body.club_name || body.name || '').trim();
    club_name = clampLength(stripTags(club_name), 120);

    let president_contact = String(body.president_contact || body.contact_email || '').trim();
    president_contact = clampLength(stripTags(president_contact), 255);

    const meeting_frequency = String(body.meeting_frequency || '').trim();
    const meeting_time_type = String(body.meeting_time_type || '').trim();
    let meeting_time_range = String(body.meeting_time_range || '').trim();
    meeting_time_range = clampLength(stripTags(meeting_time_range), 50);

    let meeting_room = String(body.meeting_room || '').trim();
    meeting_room = clampLength(stripTags(meeting_room), 50);

    const meeting_days = Array.isArray(body.meeting_days) ? body.meeting_days : [];
    const fields = Array.isArray(body.fields) ? body.fields : [];
    const categories = (Array.isArray(body.categories) ? body.categories : []).filter((c) =>
      ALLOWED_CATEGORIES.has(c)
    );
    const subfields = Array.isArray(body.subfields) ? body.subfields : [];

    let description = String(body.description || body.desc || '').trim();
    description = stripTags(description);
    description = clampLength(description, 4000);

    const open_to_all = !!body.open_to_all;
    const prereq_required = !!body.prereq_required;
    let prerequisites = prereq_required ? String(body.prerequisites || '').trim() : '';
    prerequisites = clampLength(stripTags(prerequisites), 255);

    const website_url = normalizeWebsiteUrl(stripTags(body.website_url || ''));

    const volunteer_hours =
      typeof body.volunteer_hours === 'boolean'
        ? body.volunteer_hours
          ? 1
          : 0
        : String(body.volunteer_hours || '').toLowerCase() === 'true'
        ? 1
        : 0;

    // Required checks
    const missing = [];
    if (!club_name) missing.push('club_name');
    if (!meeting_frequency || !MEETING_FREQUENCIES.has(meeting_frequency)) {
      missing.push('meeting_frequency');
    }
    if (!meeting_time_type || !TIME_TYPES.has(meeting_time_type)) {
      missing.push('meeting_time_type');
    }
    if (!meeting_days.length) missing.push('meeting_days');
    if (meeting_time_type === 'after_school' && !meeting_time_range) {
      missing.push('meeting_time_range');
    }
    if (!meeting_room) missing.push('meeting_room');

    if (missing.length) {
      return res.status(400).json({ error: 'missing_required', fields: missing });
    }

    const words = (description.match(/\S+/g) || []).length;
    if (words > 200) {
      return res.status(400).json({ error: 'desc_too_long', words });
    }

    const profFields = profanityFields({
      club_name,
      description,
      prerequisites,
      meeting_room,
      meeting_time_range,
    });
    if (profFields.length) {
      return res.status(400).json({ error: 'profanity', fields: profFields });
    }

    const subject = clampLength(
      (fields[0] || 'Other').trim() || 'Other',
      50
    );

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Idempotent by exact name
      const [[existing]] = await conn.query(`SELECT id FROM clubs WHERE name=?`, [club_name]);
      let clubId = existing && existing.id;

      if (!clubId) {
        const [ins] = await conn.query(
          `
          INSERT INTO clubs
            (name,
             subject,
             meeting_frequency,
             meeting_time_type,
             meeting_time_range,
             meeting_room,
             open_to_all,
             prereq_required,
             prerequisites,
             description,
             volunteer_hours,
             president_code,
             status,
             website_url,
             president_contact)
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `,
          [
            club_name,
            subject,
            meeting_frequency,
            meeting_time_type,
            meeting_time_range,
            meeting_room || '',
            open_to_all ? 1 : 0,
            prereq_required ? 1 : 0,
            prerequisites,
            description,
            volunteer_hours,
            '', // legacy president_code
            'pending',
            website_url,
            president_contact || null,
          ]
        );
        clubId = ins.insertId;
      } else {
        await conn.query(
          `
          UPDATE clubs SET
              subject=?,
              meeting_frequency=?,
              meeting_time_type=?,
              meeting_time_range=?,
              meeting_room=?,
              open_to_all=?,
              prereq_required=?,
              prerequisites=?,
              description=?,
              volunteer_hours=?,
              website_url=?,
              president_contact=?,
              status='pending'
          WHERE id=?
        `,
          [
            subject,
            meeting_frequency,
            meeting_time_type,
            meeting_time_range,
            meeting_room || '',
            open_to_all ? 1 : 0,
            prereq_required ? 1 : 0,
            prerequisites,
            description,
            volunteer_hours,
            website_url,
            president_contact || null,
            clubId,
          ]
        );
      }

      // Meeting days
      await conn.query(`DELETE FROM club_meeting_days WHERE club_id=?`, [clubId]);
      if (meeting_days.length) {
        const rows = meeting_days
          .map((d) => daysLookup.get(d))
          .filter(Boolean)
          .map((dayId) => [clubId, dayId]);
        if (rows.length) {
          await conn.query(
            `INSERT INTO club_meeting_days (club_id, day_id) VALUES ?`,
            [rows]
          );
        }
      }

      // Subfields
      for (const label of subfields) {
        const trimmed = clampLength(stripTags(String(label || '').trim()), 100);
        if (!trimmed) continue;
        await conn.query(`INSERT IGNORE INTO subfields (label) VALUES (?)`, [trimmed]);
      }

      let sfRows = [];
      if (subfields.length) {
        const cleanLabels = subfields
          .map((s) => clampLength(stripTags(String(s || '').trim()), 100))
          .filter(Boolean);
        if (cleanLabels.length) {
          const [rowsSF] = await conn.query(
            `SELECT id, label FROM subfields WHERE label IN (?)`,
            [cleanLabels]
          );
          sfRows = rowsSF;
        }
      }

      await conn.query(`DELETE FROM club_subfields WHERE club_id=?`, [clubId]);
      if (sfRows.length) {
        const vals = sfRows.map((r) => [clubId, r.id]);
        await conn.query(
          `INSERT INTO club_subfields (club_id, subfield_id) VALUES ?`,
          [vals]
        );
      }

      // Categories
      await conn.query(`DELETE FROM club_categories WHERE club_id=?`, [clubId]);
      if (categories.length) {
        const vals = categories.map((c) => [clubId, c]);
        await conn.query(
          `INSERT INTO club_categories (club_id, category) VALUES ?`,
          [vals]
        );
      }

      // Fields
      await conn.query(`DELETE FROM club_fields WHERE club_id=?`, [clubId]);
      if (fields.length) {
        const vals = fields
          .map((f) => clampLength(stripTags(String(f || '').trim()), 100))
          .filter(Boolean)
          .map((f) => [clubId, f]);
        if (vals.length) {
          await conn.query(
            `INSERT INTO club_fields (club_id, field_label) VALUES ?`,
            [vals]
          );
        }
      }

      await conn.commit();
      res.json({ ok: true, club_id: clubId, status: 'pending' });
    } catch (e) {
      await conn.rollback();
      console.error('/api/presidents/submit tx error:', e.code || e.message);

      if (e && (e.code === 'ER_DUP_ENTRY' || /Duplicate entry/.test(String(e.message || '')))) {
        return res.status(409).json({ error: 'duplicate_name' });
      }

      res.status(500).json({
        error: 'db_error',
      });
    } finally {
      conn.release();
    }
  } catch (e) {
    console.error('/api/presidents/submit error:', e.code || e.message);
    res.status(500).json({ error: 'db_error' });
  }
});

/* -------------------------------------------------------------------------- */
/*                                 START SERVER                               */
/* -------------------------------------------------------------------------- */

app.listen(port, () => {
  console.log(` Server listening at http://localhost:${port}`);
});
