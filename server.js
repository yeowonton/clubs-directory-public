// server.js
import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import mysql from 'mysql2/promise';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, 'public');

const app = express();
const port = Number(process.env.PORT || 3000);

// so req.ip is correct behind BrowserSync/NGINX
app.set('trust proxy', true);

/* ---------------- Parsers + static ---------------- */

app.use(express.static(publicDir));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/TWEB', express.static(path.join(publicDir, 'TWEB'), { index: ['index.html'] }));
app.get(['/TWEB', '/TWEB/'], (_req, res) =>
  res.sendFile(path.join(publicDir, 'TWEB', 'index.html'))
);
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
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'clubs_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/* ---------------- Helpers ---------------- */
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000);
const RATE_LIMIT_MAX_ATTEMPTS = Number(process.env.RATE_LIMIT_MAX_ATTEMPTS || 5);
const __attempts = new Map(); // key -> [timestamps]
const sha256Hex = (s) => crypto.createHash('sha256').update(String(s)).digest('hex');

function rlKey(req, bucket) {
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  return `${bucket}:${ip}`;
}
function rlPurge(arr) {
  const now = Date.now();
  return arr.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
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

function isAuthorized(req) {
  const admin = process.env.ADMIN_CODE || '';
  const code = req.get('x-admin-code') || (req.body && req.body.code);
  const hash = req.get('x-admin-hash') || (req.body && req.body.code_hash);
  if (hash && hash === sha256Hex(admin)) return true;
  if (code && code === admin) return true;
  return false;
}

function normalizeWebsiteUrl(url) {
  if (!url) return null;
  const u = String(url).trim();
  if (!u) return null;
  if (/^https?:\/\//i.test(u)) return u;
  if (u.includes('.') || u.startsWith('www.')) return 'https://' + u.replace(/^\/+/, '');
  return u;
}

/* ---------------- Startup: ensure schema ---------------- */
async function ensureColumnIfMissing(table, column, ddl) {
  const db = process.env.MYSQL_DATABASE || 'clubs_db';
  const [[col]] = await pool.query(
    `SELECT COUNT(*) n FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA=? AND TABLE_NAME=? AND COLUMN_NAME=?`, [db, table, column]
  );
  if (!col.n) {
    await pool.query(ddl);
    console.log(`[schema] Added ${table}.${column}`);
  }
}

async function ensureWebsiteColumn() {
  await ensureColumnIfMissing(
    'clubs',
    'website_url',
    `ALTER TABLE clubs ADD COLUMN website_url VARCHAR(512) DEFAULT NULL`
  );
}

async function ensureMeetingRoomColumn() {
  await ensureColumnIfMissing(
    'clubs',
    'meeting_room',
    `ALTER TABLE clubs ADD COLUMN meeting_room VARCHAR(50) DEFAULT NULL`
  );
}

async function ensureMeetingDays() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS meeting_days (
      id INT PRIMARY KEY,
      name VARCHAR(20) NOT NULL UNIQUE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  await pool.query(`
    INSERT INTO meeting_days (id,name) VALUES
    (1,'Monday'),(2,'Tuesday'),(3,'Wednesday'),(4,'Thursday'),(5,'Friday')
    ON DUPLICATE KEY UPDATE name=VALUES(name)
  `);
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
  const db = process.env.MYSQL_DATABASE || 'clubs_db';

  // Create if missing (correct schema)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS club_fields (
      club_id INT NOT NULL,
      field_label VARCHAR(100) NOT NULL,
      PRIMARY KEY (club_id, field_label),
      CONSTRAINT fk_cf_club FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  // If the table exists but with an old column name, rename or add it.
  const [[hasFieldLabel]] = await pool.query(
    `SELECT COUNT(*) n FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA=? AND TABLE_NAME='club_fields' AND COLUMN_NAME='field_label'`,
    [db]
  );
  if (!hasFieldLabel.n) {
    const [[hasField]] = await pool.query(
      `SELECT COUNT(*) n FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA=? AND TABLE_NAME='club_fields' AND COLUMN_NAME='field'`,
      [db]
    );
    const [[hasLabel]] = await pool.query(
      `SELECT COUNT(*) n FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA=? AND TABLE_NAME='club_fields' AND COLUMN_NAME='label'`,
      [db]
    );
    if (hasField.n) {
      await pool.query(`ALTER TABLE club_fields CHANGE COLUMN field field_label VARCHAR(100) NOT NULL`);
    } else if (hasLabel.n) {
      await pool.query(`ALTER TABLE club_fields CHANGE COLUMN label field_label VARCHAR(100) NOT NULL`);
    } else {
      await pool.query(`ALTER TABLE club_fields ADD COLUMN field_label VARCHAR(100) NOT NULL`);
    }
  }

  // Ensure PK is (club_id, field_label). No-op if already correct.
  try {
    await pool.query(`ALTER TABLE club_fields DROP PRIMARY KEY, ADD PRIMARY KEY (club_id, field_label)`);
  } catch (_) {}
}

async function ensureUniqueIndex() {
  try {
    await pool.query(`ALTER TABLE clubs ADD UNIQUE KEY uq_club_name_code (name, president_code)`);
    console.log('[schema] Added unique index clubs(name, president_code)');
  } catch {
    /* exists */
  }
}

async function ensureSchema() {
  await ensureWebsiteColumn();
  await ensureMeetingRoomColumn();
  await ensureMeetingDays();
  await ensureSubfieldsBase();
  await ensureLinkTables();
  await ensureClubCategories();
  await ensureClubFields(); // auto-migrates legacy column names
  await ensureUniqueIndex();
}

(async () => {
  try {
    const [r] = await pool.query('SELECT 1');
    console.log('[db] OK', r && 'connected');
    await ensureSchema();
  } catch (e) {
    console.error('[db] connection failed (API calls will 500 until fixed):', e.code || e.message);
  }
})();

/* ---------------- Constants ---------------- */
const daysLookup = new Map([
  ['Monday',1],['Tuesday',2],['Wednesday',3],['Thursday',4],['Friday',5]
]);
const ALLOWED_CATEGORIES = new Set(['competition','activity','community','research','advocacy','outreach']);
const MEETING_FREQUENCIES = new Set(['weekly','biweekly','monthly','event']);
const TIME_TYPES = new Set(['lunch','after_school']);

/* ---------------- Public: list clubs ---------------- */
app.get('/api/clubs', async (req, res) => {
  try {
    const includePending = req.query.includePending === '1';
    const [rows] = await pool.query(
      `SELECT c.id, c.name, c.subject, c.meeting_time_type, c.meeting_time_range,
              c.meeting_frequency, c.prereq_required, c.prerequisites, c.description,
              c.open_to_all, c.volunteer_hours, c.status, c.website_url, c.meeting_room
       FROM clubs c
       WHERE ? OR c.status='approved'
       ORDER BY c.name`,
      [includePending ? 1 : 0]
    );
    const ids = rows.map(r => r.id);
    if (!ids.length) return res.json({ clubs: [] });

    const [sf] = await pool.query(
      `SELECT cs.club_id, s.label
         FROM club_subfields cs
         JOIN subfields s ON s.id=cs.subfield_id
        WHERE cs.club_id IN (?)`, [ids]
    );
    const [md] = await pool.query(
      `SELECT cmd.club_id, d.name
         FROM club_meeting_days cmd
         JOIN meeting_days d ON d.id=cmd.day_id
        WHERE cmd.club_id IN (?)`, [ids]
    );
    const [cats] = await pool.query(
      `SELECT club_id, category FROM club_categories WHERE club_id IN (?)`, [ids]
    );
    const [fields] = await pool.query(
      `SELECT club_id, field_label FROM club_fields WHERE club_id IN (?)`, [ids]
    );

    const byId = new Map(rows.map(r => [r.id, {
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
      subfield: [],
      meeting_days: [],
      categories: [],
      fields: [] // filled below
    }]));

    sf.forEach(r => byId.get(r.club_id).subfield.push(r.label));
    md.forEach(r => byId.get(r.club_id).meeting_days.push(r.name));
    cats.forEach(r => byId.get(r.club_id).categories.push(r.category));
    fields.forEach(r => byId.get(r.club_id).fields.push(r.field_label));

    // back-compat: if a club has no rows in club_fields, fall back to subject as single field
    byId.forEach(v => {
      if (!v.fields.length && v.subject) v.fields = [v.subject];
    });

    res.json({ clubs: [...byId.values()] });
  } catch (e) {
    console.error('/api/clubs error:', e);
    res.status(500).json({ error: 'db_error' });
  }
});

/* ---------------- Public: get one ---------------- */
app.get('/api/clubs/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [[club]] = await pool.query(`SELECT * FROM clubs WHERE id=?`, [id]);
    if (!club) return res.status(404).json({ error: 'not_found' });

    const [sf] = await pool.query(
      `SELECT s.label FROM club_subfields cs JOIN subfields s ON s.id=cs.subfield_id WHERE cs.club_id=?`, [id]
    );
    const [md] = await pool.query(
      `SELECT d.name FROM club_meeting_days cmd JOIN meeting_days d ON d.id=cmd.day_id WHERE cmd.club_id=?`, [id]
    );
    const [cats] = await pool.query(
      `SELECT category FROM club_categories WHERE club_id=?`, [id]
    );
    const [fields] = await pool.query(
      `SELECT field_label FROM club_fields WHERE club_id=?`, [id]
    );

    club.subfield = sf.map(r => r.label);
    club.meeting_days = md.map(r => r.name);
    club.categories = cats.map(r => r.category);
    club.fields = fields.length ? fields.map(r => r.field_label) : (club.subject ? [club.subject] : []);
    res.json({ club });
  } catch (e) {
    console.error('/api/clubs/:id error:', e);
    res.status(500).json({ error: 'db_error' });
  }
});

/* ---------------- Admin: login (rate-limited) ---------------- */
app.post('/api/admin/login', (req, res) => {
  if (rlIsLimited(req, 'admin_login')) {
    return res.status(429).json({ error: 'rate_limited' });
  }
  const { code, code_hash } = req.body || {};
  const admin = process.env.ADMIN_CODE || '';
  const ok = code ? (code === admin) : (code_hash && code_hash === sha256Hex(admin));
  if (!ok) {
    rlRecordFailure(req, 'admin_login');
    return res.status(401).json({ error: 'invalid' });
  }
  rlClear(req, 'admin_login');
  res.json({ ok: true });
});

/* ---------------- Admin: list clubs (incl. president_code) ---------------- */
app.get('/api/admin/clubs', async (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error: 'unauthorized' });
  try {
    const [rows] = await pool.query(
      `SELECT id, name, subject, meeting_time_type, meeting_time_range, meeting_frequency,
              prereq_required, prerequisites, description, open_to_all, volunteer_hours,
              status, president_code, website_url, meeting_room
       FROM clubs
       ORDER BY name`
    );
    const ids = rows.map(r => r.id);
    if (!ids.length) return res.json({ clubs: [] });

    const [sf] = await pool.query(
      `SELECT cs.club_id, s.label
         FROM club_subfields cs
         JOIN subfields s ON s.id=cs.subfield_id
        WHERE cs.club_id IN (?)`, [ids]
    );
    const [md] = await pool.query(
      `SELECT cmd.club_id, d.name
         FROM club_meeting_days cmd
         JOIN meeting_days d ON d.id=cmd.day_id
        WHERE cmd.club_id IN (?)`, [ids]
    );
    const [cats] = await pool.query(
      `SELECT club_id, category FROM club_categories WHERE club_id IN (?)`, [ids]
    );
    const [fields] = await pool.query(
      `SELECT club_id, field_label FROM club_fields WHERE club_id IN (?)`, [ids]
    );

    const byId = new Map(rows.map(r => [r.id, {
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
      president_code: r.president_code || '',
      website_url: r.website_url || null,
      meeting_room: r.meeting_room || '',
      subfield: [],
      meeting_days: [],
      categories: [],
      fields: []
    }]));

    sf.forEach(r => byId.get(r.club_id).subfield.push(r.label));
    md.forEach(r => byId.get(r.club_id).meeting_days.push(r.name));
    cats.forEach(r => byId.get(r.club_id).categories.push(r.category));
    fields.forEach(r => byId.get(r.club_id).fields.push(r.field_label));
    byId.forEach(v => { if (!v.fields.length && v.subject) v.fields = [v.subject]; });

    res.json({ clubs: [...byId.values()] });
  } catch (e) {
    console.error('/api/admin/clubs error:', e);
    res.status(500).json({ error: 'db_error' });
  }
});

/* ---------------- Admin: edit/delete ---------------- */
app.patch('/api/clubs/:id', async (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error: 'unauthorized' });
  try {
    await pool.query(`UPDATE clubs SET description=? WHERE id=?`, [req.body.description ?? "", req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    console.error('patch error:', e);
    res.status(500).json({ error: 'db_error' });
  }
});

app.delete('/api/clubs/:id', async (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error: 'unauthorized' });
  try {
    await pool.query(`DELETE FROM clubs WHERE id=?`, [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    console.error('delete error:', e);
    res.status(500).json({ error: 'db_error' });
  }
});

/* ---------------- Presidents: submit (rate-limited) ---------------- */
app.post('/api/presidents/submit', async (req, res) => {
  try {
    if (rlIsLimited(req, 'pres_submit')) {
      return res.status(429).json({ error: 'rate_limited' });
    }

    const body = req.body || {};
    const expected = process.env.PRESIDENT_PASSWORD || '';
    if (!body.president_submit_password || body.president_submit_password !== expected) {
      rlRecordFailure(req, 'pres_submit');
      return res.status(401).json({ error: 'unauthorized', reason: 'bad_president_password' });
    }
    rlClear(req, 'pres_submit');

    const club_name = (body.club_name || '').trim();
    const president_code = (body.president_code || '').trim();
    const meeting_frequency = (body.meeting_frequency || '').trim();
    const meeting_time_type = (body.meeting_time_type || '').trim();
    const meeting_time_range = (body.meeting_time_range || '').trim();
    const meeting_room = (body.meeting_room || '').trim();
    const meeting_days = Array.isArray(body.meeting_days) ? body.meeting_days : [];
    const fields = Array.isArray(body.fields) ? body.fields : [];
    const categories = (Array.isArray(body.categories) ? body.categories : []).filter(c => ALLOWED_CATEGORIES.has(c));
    const subfields = Array.isArray(body.subfields) ? body.subfields : [];
    const description = (body.description || '').trim();
    const open_to_all = !!body.open_to_all;
    const prereq_required = !!body.prereq_required;
    const prerequisites = prereq_required ? (body.prerequisites || '').trim() : '';
    const website_url = normalizeWebsiteUrl(body.website_url);
    const volunteer_hours = typeof body.volunteer_hours === 'boolean'
      ? (body.volunteer_hours ? 1 : 0)
      : (String(body.volunteer_hours).toLowerCase() === 'true' ? 1 : 0);

    const missing = [];
    if (!club_name) missing.push('club_name');
    if (!president_code) missing.push('president_code');
    if (!meeting_frequency || !MEETING_FREQUENCIES.has(meeting_frequency)) missing.push('meeting_frequency');
    if (!meeting_time_type || !TIME_TYPES.has(meeting_time_type)) missing.push('meeting_time_type');
    if (!meeting_days.length) missing.push('meeting_days');
    if (meeting_time_type === 'after_school' && !meeting_time_range) missing.push('meeting_time_range');
    if (!meeting_room) missing.push('meeting_room'); // REQUIRED
    if (missing.length) return res.status(400).json({ error: 'missing_required', fields: missing });

    const words = (description.match(/\S+/g) || []).length;
    if (words > 200) return res.status(400).json({ error: 'desc_too_long', words });

    // Subject is legacy single-field; keep for back-compat, but store ALL fields in club_fields.
    const subject = (fields[0] || 'Other').trim();

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [[existing]] = await conn.query(
        `SELECT id FROM clubs WHERE name=? AND president_code=?`,
        [club_name, president_code]
      );

      let clubId = existing?.id;

      if (!clubId) {
        const [ins] = await conn.query(
          `INSERT INTO clubs
           (name, subject, meeting_frequency, meeting_time_type, meeting_time_range, meeting_room,
            open_to_all, prereq_required, prerequisites, description,
            volunteer_hours, president_code, status, website_url)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
          [
            club_name, subject, meeting_frequency, meeting_time_type, meeting_time_range, meeting_room || '',
            open_to_all ? 1 : 0, prereq_required ? 1 : 0, prerequisites, description,
            volunteer_hours, president_code, 'approved', website_url
          ]
        );
        clubId = ins.insertId;
      } else {
        await conn.query(
          `UPDATE clubs SET
              subject=?, meeting_frequency=?, meeting_time_type=?, meeting_time_range=?, meeting_room=?,
              open_to_all=?, prereq_required=?, prerequisites=?, description=?,
              volunteer_hours=?, website_url=?
           WHERE id=?`,
          [
            subject, meeting_frequency, meeting_time_type, meeting_time_range, meeting_room || '',
            open_to_all ? 1 : 0, prereq_required ? 1 : 0, prerequisites, description,
            volunteer_hours, website_url, clubId
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
        if (rows.length) {
          await conn.query(`INSERT INTO club_meeting_days (club_id, day_id) VALUES ?`, [rows]);
        }
      }

      // subfields
      for (const label of subfields) {
        await conn.query(`INSERT IGNORE INTO subfields (label) VALUES (?)`, [label]);
      }
      const [sfrows] = subfields.length
        ? await conn.query(`SELECT id,label FROM subfields WHERE label IN (?)`, [subfields])
        : [ [] ];
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

      // fields (allow multiple focuses)
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
      console.error('/api/presidents/submit tx error:', e);
      res.status(500).json({ error: 'db_error', mysql_code: e.code, mysql_message: e.sqlMessage });
    } finally {
      conn.release();
    }
  } catch (e) {
    console.error('/api/presidents/submit error:', e);
    res.status(500).json({ error: 'db_error' });
  }
});

/* ---------------- Health ---------------- */
app.get('/healthz', (_req, res) => res.json({ ok: true }));

/* ---------------- Start ---------------- */
console.log('[server] publicDir =', publicDir);
console.log('[server] index exists =', fs.existsSync(path.join(publicDir, 'index.html')));
app.listen(port, () => {
  console.log(`Server running: http://localhost:${port}`);
  console.log('Dev (live reload): http://localhost:5173');
});
