// server.js
import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs'; // kept for parity; safe to remove if unused
import crypto from 'crypto';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';

/* ---------------- Paths ---------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, 'public');

/* ---------------- App ---------------- */
const app = express();
const port = Number(process.env.PORT || 3000);
app.set('trust proxy', true);

/* ---------------- Parsers + static ---------------- */
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
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use((err, _req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('[json] parse error:', err.message);
    return res.status(400).json({ error: 'invalid_json' });
  }
  return next(err);
});

/* ---------------- Pretty routes -> HTML ---------------- */
app.get(['/', '/index', '/index.html'], (_req, res) =>
  res.sendFile(path.join(publicDir, 'index.html'))
);
app.get(['/presidents', '/presidents.html'], (_req, res) =>
  res.sendFile(path.join(publicDir, 'presidents.html'))
);
app.get(['/admin', '/admin.html'], (_req, res) =>
  res.sendFile(path.join(publicDir, 'admin.html'))
);

/* ---------------- MySQL pool ---------------- */
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
    ssl: u.searchParams.get('ssl') === 'true' ? { rejectUnauthorized: false } : undefined,
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
        ssl: process.env.MYSQL_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
      });

try {
  const c = await pool.getConnection(); c.release();
  console.log('[db] OK connected');
} catch (e) {
  console.error('[db] connection failed:', e.code || e.message);
}

/* ---------------- Helpers ---------------- */
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000);
const RATE_LIMIT_MAX_ATTEMPTS = Number(process.env.RATE_LIMIT_MAX_ATTEMPTS || 5);
const __attempts = new Map();
const sha256Hex = (s) => crypto.createHash('sha256').update(String(s)).digest('hex');

function rlKey(req, bucket) {
  const ip = req.ip || (req.connection && req.connection.remoteAddress) || 'unknown';
  return `${bucket}:${ip}`;
}
function rlPurge(arr) { const now = Date.now(); return arr.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS); }
function rlIsLimited(req, bucket){ const k=rlKey(req,bucket); const arr=rlPurge(__attempts.get(k)||[]); __attempts.set(k,arr); return arr.length>=RATE_LIMIT_MAX_ATTEMPTS; }
function rlRecordFailure(req,bucket){ const k=rlKey(req,bucket); const arr=rlPurge(__attempts.get(k)||[]); arr.push(Date.now()); __attempts.set(k,arr); }
function rlClear(req,bucket){ __attempts.delete(rlKey(req,bucket)); }

function getAdminCode() {
  return (process.env.ADMIN_CODE ?? '').toString().trim();
}
function hasAdminConfigured() {
  return getAdminCode().length > 0;
}
function isAuthorized(req) {
  if (!hasAdminConfigured()) return false;
  const admin = getAdminCode();
  const adminHash = sha256Hex(admin);
  // Accept from headers *or* body (so GETs and POSTs both work)
  const headerHash = req.get('x-admin-hash') || '';
  const headerCode = req.get('x-admin-code') || '';
  const bodyHash   = (req.body && req.body.code_hash) || '';
  const bodyCode   = (req.body && req.body.code) || '';
  if (headerHash && headerHash === adminHash) return true;
  if (headerCode && headerCode === admin)     return true;
  if (bodyHash   && bodyHash   === adminHash) return true;
  if (bodyCode   && bodyCode   === admin)     return true;
  return false;
}

function normalizeWebsiteUrl(url) {
  if (!url) return null;
  const u = String(url).trim();
  if (!u) return null;
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith('//')) return 'https:' + u;
  if (u.includes('.') || u.startsWith('www.')) return 'https://' + u.replace(/^\/+/, '');
  return u;
}

/* ---------------- Idempotent schema helpers ---------------- */
async function ensureColumnIfMissing(table, column, ddl) {
  const [[row]] = await pool.query(
    `
    SELECT COUNT(*) AS n
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME=? AND COLUMN_NAME=?
    `,
    [table, column]
  );
  if (!row.n) { await pool.query(ddl); console.log(`[schema] Added ${table}.${column}`); }
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
  // New installs get unique name baked in; existing installs are migrated below.
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
    // MySQL 8+ style (alias)
    await pool.query(`
      INSERT INTO meeting_days (id,name) VALUES
        (1,'Monday'),(2,'Tuesday'),(3,'Wednesday'),(4,'Thursday'),(5,'Friday'),
        (6,'Saturday'),(7,'Sunday')
      AS new ON DUPLICATE KEY UPDATE name=new.name
    `);
  } catch {
    // MySQL <8 fallback
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
  // Migrate away from legacy unique (name, president_code) to unique(name)
  await dropIndexIfExists('clubs', 'uq_name_code').catch(()=>{});
  // Before adding, check for duplicate names (to avoid migration failure)
  const [dups] = await pool.query(`
    SELECT name, COUNT(*) AS n
    FROM clubs
    GROUP BY name
    HAVING n > 1
  `);
  if (dups.length) {
    console.warn(`[schema] Found ${dups.length} duplicate club names; cannot enforce unique(name) yet.`);
    return;
  }
  try {
    await pool.query(`ALTER TABLE clubs ADD UNIQUE KEY uq_name (name)`);
    console.log('[schema] Ensured unique index clubs(name)');
  } catch (e) {
    if (e && String(e.code).includes('ER_DUP')) {
      console.warn('[schema] Could not add unique(name): duplicate data exists.');
    } else if (String(e.message || '').includes('Duplicate key name')) {
      // index already exists; ignore
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
    const [r] = await pool.query('SELECT 1'); if (r) console.log('[db] ping ok');
    await ensureSchema();
  } catch (e) {
    console.error('[schema] failed:', e.code || e.message);
  }
})();

/* ---------------- Constants ---------------- */
const daysLookup = new Map([['Monday',1],['Tuesday',2],['Wednesday',3],['Thursday',4],['Friday',5],['Saturday',6],['Sunday',7]]);
const ALLOWED_CATEGORIES = new Set(['competition','activity','community','research','advocacy','outreach']);
const MEETING_FREQUENCIES = new Set(['weekly','biweekly','monthly','event']); // 'event' == "Not applicable; specified in the description"
const TIME_TYPES = new Set(['lunch','after_school']);

/* ---------------- Health ---------------- */
app.get('/healthz', (_req, res) => res.json({ ok: true }));

/* ---------------- Public: list clubs ---------------- */
app.get('/api/clubs', async (req, res) => {
  try {
    const includePending = req.query.includePending === '1';
    const [rows] = await pool.query(
      `
      SELECT c.id, c.name, c.subject, c.meeting_time_type, c.meeting_time_range,
             c.meeting_frequency, c.prereq_required, c.prerequisites, c.description,
             c.open_to_all, c.volunteer_hours, c.status, c.website_url, c.meeting_room,
             c.president_contact
        FROM clubs c
       WHERE ? OR c.status='approved'
       ORDER BY c.name
      `,
      [includePending ? 1 : 0]
    );
    const ids = rows.map(r => r.id);
    if (!ids.length) return res.json({ clubs: [] });

    const [sf]   = await pool.query(
      `SELECT cs.club_id, s.label FROM club_subfields cs JOIN subfields s ON s.id=cs.subfield_id WHERE cs.club_id IN (?)`,
      [ids]
    );
    const [md]   = await pool.query(
      `SELECT cmd.club_id, d.name FROM club_meeting_days cmd JOIN meeting_days d ON d.id=cmd.day_id WHERE cmd.club_id IN (?)`,
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

    const byId = new Map(rows.map(r => [r.id, {
      id:r.id, name:r.name, subject:r.subject,
      meeting_time_type:r.meeting_time_type, meeting_time_range:r.meeting_time_range,
      meeting_frequency:r.meeting_frequency, prereq_required:!!r.prereq_required,
      prerequisites:r.prerequisites||'', description:r.description||'',
      open_to_all:!!r.open_to_all, volunteer_hours:!!r.volunteer_hours,
      status:r.status, website_url:r.website_url||null, meeting_room:r.meeting_room||'',
      president_contact:r.president_contact || null,
      subfield:[], meeting_days:[], categories:[], fields:[]
    }]));

    // (no optional chaining for wider Node compatibility)
    sf.forEach(r => { const v = byId.get(r.club_id); if (v) v.subfield.push(r.label); });
    md.forEach(r => { const v = byId.get(r.club_id); if (v) v.meeting_days.push(r.name); });
    cats.forEach(r => { const v = byId.get(r.club_id); if (v) v.categories.push(r.category); });
    flds.forEach(r => { const v = byId.get(r.club_id); if (v) v.fields.push(r.field_label); });

    byId.forEach(v => { if (!v.fields.length && v.subject) v.fields = [v.subject]; });

    res.json({ clubs: [...byId.values()] });
  } catch (e) {
    console.error('/api/clubs error:', e.code || e.message);
    res.status(500).json({ error: 'db_error' });
  }
});

/* ---------------- Public: one club ---------------- */
app.get('/api/clubs/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [[club]] = await pool.query(`SELECT * FROM clubs WHERE id=?`, [id]);
    if (!club) return res.status(404).json({ error:'not_found' });
    const [sf]   = await pool.query(`SELECT s.label FROM club_subfields cs JOIN subfields s ON s.id=cs.subfield_id WHERE cs.club_id=?`, [id]);
    const [md]   = await pool.query(`SELECT d.name  FROM club_meeting_days cmd JOIN meeting_days d ON d.id=cmd.day_id WHERE cmd.club_id=?`, [id]);
    const [cats] = await pool.query(`SELECT category FROM club_categories WHERE club_id=?`, [id]);
    const [flds] = await pool.query(`SELECT field_label FROM club_fields WHERE club_id=?`, [id]);
    club.subfield = sf.map(r=>r.label);
    club.meeting_days = md.map(r=>r.name);
    club.categories = cats.map(r=>r.category);
    club.fields = flds.length ? flds.map(r=>r.field_label) : (club.subject ? [club.subject] : []);
    res.json({ club });
  } catch (e) {
    console.error('/api/clubs/:id error:', e.code || e.message);
    res.status(500).json({ error:'db_error' });
  }
});

/* ---------------- Admin ---------------- */
app.post('/api/admin/login', (req, res) => {
  if (!hasAdminConfigured()) return res.status(500).json({ error: 'admin_not_configured' });
  if (rlIsLimited(req, 'admin_login')) return res.status(429).json({ error:'rate_limited' });
  const { code = '', code_hash = '' } = req.body || {};
  const admin = getAdminCode();
  const ok = (code && code === admin) || (code_hash && code_hash === sha256Hex(admin));
  if (!ok) { rlRecordFailure(req,'admin_login'); return res.status(401).json({ error:'invalid' }); }
  rlClear(req,'admin_login');
  res.json({ ok:true });
});

app.get('/api/admin/clubs', async (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error:'unauthorized' });
  try {
    const [rows] = await pool.query(`
      SELECT id, name, subject, meeting_time_type, meeting_time_range, meeting_frequency,
             prereq_required, prerequisites, description, open_to_all, volunteer_hours,
             status, website_url, meeting_room, president_contact
      FROM clubs
      ORDER BY name
    `);
    const ids = rows.map(r=>r.id);
    if (!ids.length) return res.json({ clubs: [] });
    const [sf]   = await pool.query(`SELECT cs.club_id, s.label FROM club_subfields cs JOIN subfields s ON s.id=cs.subfield_id WHERE cs.club_id IN (?)`, [ids]);
    const [md]   = await pool.query(`SELECT cmd.club_id, d.name FROM club_meeting_days cmd JOIN meeting_days d ON d.id=cmd.day_id WHERE cmd.club_id IN (?)`, [ids]);
    const [cats] = await pool.query(`SELECT club_id, category    FROM club_categories WHERE club_id IN (?)`, [ids]);
    const [flds] = await pool.query(`SELECT club_id, field_label FROM club_fields    WHERE club_id IN (?)`, [ids]);

    const byId = new Map(rows.map(r=>[r.id,{
      id:r.id, name:r.name, subject:r.subject,
      meeting_time_type:r.meeting_time_type, meeting_time_range:r.meeting_time_range,
      meeting_frequency:r.meeting_frequency, prereq_required:!!r.prereq_required,
      prerequisites:r.prerequisites||'', description:r.description||'',
      open_to_all:!!r.open_to_all, volunteer_hours:!!r.volunteer_hours,
      status:r.status, website_url:r.website_url||null, meeting_room:r.meeting_room||'',
      president_contact:r.president_contact || null,
      subfield:[], meeting_days:[], categories:[], fields:[]
    }]));

    sf.forEach(r => { const v = byId.get(r.club_id); if (v) v.subfield.push(r.label); });
    md.forEach(r => { const v = byId.get(r.club_id); if (v) v.meeting_days.push(r.name); });
    cats.forEach(r => { const v = byId.get(r.club_id); if (v) v.categories.push(r.category); });
    flds.forEach(r => { const v = byId.get(r.club_id); if (v) v.fields.push(r.field_label); });

    byId.forEach(v => { if (!v.fields.length && v.subject) v.fields = [v.subject]; });
    res.json({ clubs:[...byId.values()] });
  } catch (e) {
    console.error('/api/admin/clubs error:', e.code || e.message);
    res.status(500).json({ error:'db_error' });
  }
});

app.post('/api/clubs/:id/approve', async (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error:'unauthorized' });
  try { await pool.query(`UPDATE clubs SET status='approved' WHERE id=?`, [req.params.id]); res.json({ ok:true }); }
  catch (e){ console.error('approve error:', e.code || e.message); res.status(500).json({ error:'db_error' }); }
});
app.patch('/api/clubs/:id', async (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error:'unauthorized' });
  const body = (req && req.body && typeof req.body === 'object') ? req.body : {};
  const desc = typeof body.description === 'string' ? body.description : '';
  try { await pool.query(`UPDATE clubs SET description=? WHERE id=?`, [desc, req.params.id]); res.json({ ok:true }); }
  catch (e){ console.error('patch error:', e.code || e.message); res.status(500).json({ error:'db_error' }); }
});
app.delete('/api/clubs/:id', async (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error:'unauthorized' });
  try { await pool.query(`DELETE FROM clubs WHERE id=?`, [req.params.id]); res.json({ ok:true }); }
  catch (e){ console.error('delete error:', e.code || e.message); res.status(500).json({ error:'db_error' }); }
});

/* ---------------- Presidents: submit ---------------- */
app.post('/api/presidents/submit', async (req, res) => {
  try {
    if (rlIsLimited(req, 'pres_submit')) return res.status(429).json({ error:'rate_limited' });

    const body = req.body || {};
    const expected = process.env.PRESIDENT_PASSWORD || '';
    // Accept either exact or legacy key for the commissioner gate
    const submitPwd = body.president_submit_password || body.password || '';
    if (!submitPwd || submitPwd !== expected) {
      rlRecordFailure(req, 'pres_submit');
      return res.status(401).json({ error:'unauthorized', reason:'bad_president_password' });
    }
    rlClear(req,'pres_submit');

    // Accept both new and legacy names for max compatibility
    const club_name = String(body.club_name || body.name || '').trim();
    const president_contact = String(body.president_contact || body.contact_email || '').trim();
    const meeting_frequency = String(body.meeting_frequency || '').trim();
    const meeting_time_type = String(body.meeting_time_type || '').trim();
    const meeting_time_range = String(body.meeting_time_range || '').trim();
    const meeting_room = String(body.meeting_room || '').trim();
    const meeting_days = Array.isArray(body.meeting_days) ? body.meeting_days : [];
    const fields = Array.isArray(body.fields) ? body.fields : [];
    const categories = (Array.isArray(body.categories) ? body.categories : []).filter(c => ALLOWED_CATEGORIES.has(c));
    const subfields = Array.isArray(body.subfields) ? body.subfields : [];
    const description = String(body.description || body.desc || '').trim();
    const open_to_all = !!body.open_to_all;
    const prereq_required = !!body.prereq_required;
    const prerequisites = prereq_required ? String(body.prerequisites || '').trim() : '';
    const website_url = normalizeWebsiteUrl(body.website_url);
    const volunteer_hours =
      typeof body.volunteer_hours === 'boolean'
        ? (body.volunteer_hours ? 1 : 0)
        : String(body.volunteer_hours || '').toLowerCase() === 'true' ? 1 : 0;

    const missing = [];
    if (!club_name) missing.push('club_name');
    if (!meeting_frequency || !MEETING_FREQUENCIES.has(meeting_frequency)) missing.push('meeting_frequency');
    if (!meeting_time_type || !TIME_TYPES.has(meeting_time_type)) missing.push('meeting_time_type');
    if (!meeting_days.length) missing.push('meeting_days');
    if (meeting_time_type === 'after_school' && !meeting_time_range) missing.push('meeting_time_range');
    if (!meeting_room) missing.push('meeting_room');
    if (missing.length) return res.status(400).json({ error:'missing_required', fields: missing });

    const words = (description.match(/\S+/g) || []).length;
    if (words > 200) return res.status(400).json({ error:'desc_too_long', words });

    // subject = first field for legacy back-compat
    const subject = (fields[0] || 'Other').trim();

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Idempotent by exact name (case-sensitive)
      const [[existing]] = await conn.query(`SELECT id FROM clubs WHERE name=?`, [club_name]);
      let clubId = existing && existing.id;

      if (!clubId) {
        const [ins] = await conn.query(
          `
          INSERT INTO clubs
           (name, subject, meeting_frequency, meeting_time_type, meeting_time_range, meeting_room,
            open_to_all, prereq_required, prerequisites, description,
            volunteer_hours, president_code, status, website_url, president_contact)
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
            '',              // president_code kept for legacy schema; unused
            'approved',
            website_url,
            president_contact || null
          ]
        );
        clubId = ins.insertId;
      } else {
        await conn.query(
          `
          UPDATE clubs SET
              subject=?, meeting_frequency=?, meeting_time_type=?, meeting_time_range=?, meeting_room=?,
              open_to_all=?, prereq_required=?, prerequisites=?, description=?,
              volunteer_hours=?, website_url=?, president_contact=?
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
            (president_contact || null),
            clubId
          ]
        );
      }

      // meeting days
      await conn.query(`DELETE FROM club_meeting_days WHERE club_id=?`, [clubId]);
      if (meeting_days.length) {
        const rows = meeting_days
          .map(d => daysLookup.get(d))
          .filter(Boolean)
          .map(id => [clubId, id]);
        if (rows.length) await conn.query(`INSERT INTO club_meeting_days (club_id,day_id) VALUES ?`, [rows]);
      }

      // subfields
      for (const label of subfields) {
        await conn.query(`INSERT IGNORE INTO subfields (label) VALUES (?)`, [label]);
      }
      let sfrows = [];
      if (subfields.length) {
        const [rowsSF] = await conn.query(
          `SELECT id, label FROM subfields WHERE label IN (?)`,
          [subfields]
        );
        sfrows = rowsSF;
      }
      await conn.query(`DELETE FROM club_subfields WHERE club_id=?`, [clubId]);
      if (sfrows.length) {
        const vals = sfrows.map(r => [clubId, r.id]);
        await conn.query(`INSERT INTO club_subfields (club_id, subfield_id) VALUES ?`, [vals]);
      }

      // categories
      await conn.query(`DELETE FROM club_categories WHERE club_id=?`, [clubId]);
      if (categories.length) {
        const vals = categories.map(c => [clubId, c]);
        await conn.query(`INSERT INTO club_categories (club_id, category) VALUES ?`, [vals]);
      }

      // fields (multiple focuses)
      await conn.query(`DELETE FROM club_fields WHERE club_id=?`, [clubId]);
      if (fields.length) {
        const vals = fields
          .map(f => String(f).trim())
          .filter(Boolean)
          .map(f => [clubId, f]);
        if (vals.length) {
          await conn.query(`INSERT INTO club_fields (club_id, field_label) VALUES ?`, [vals]);
        }
      }

      await conn.commit();
      res.json({ ok: true, club_id: clubId });
    } catch (e) {
      await conn.rollback();
      console.error('/api/presidents/submit tx error:', e.code || e.message);
      // Duplicate name protection (if unique(name) is present and an insert races)
      if (e && (e.code === 'ER_DUP_ENTRY' || /Duplicate entry/.test(String(e.message)))) {
        return res.status(409).json({ error: 'duplicate_name' });
      }
      res.status(500).json({ error: 'db_error', mysql_code: e.code, mysql_message: e.sqlMessage });
    } finally {
      conn.release();
    }
  } catch (e) {
    console.error('/api/presidents/submit error:', e.code || e.message);
    res.status(500).json({ error: 'db_error' });
  }
});

/* ---------------- Start server ---------------- */
app.listen(port, () => {
  console.log(`✅ Server listening at http://localhost:${port}`);
});
