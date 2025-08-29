// server.js
import 'dotenv/config';
import express from 'express';
import path from 'path';
import mysql from 'mysql2/promise';
import crypto from 'crypto';
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
const sha256Hex = (s) => crypto.createHash('sha256').update(String(s)).digest('hex');

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
  if (u.startsWith('//')) return 'https:'+u;
  if (u.includes('.') || u.startsWith('www.')) return 'https://' + u.replace(/^\/+/, '');
  return u;
}

/* ---------------- Schema ---------------- */
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
      status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'approved',
      website_url VARCHAR(512) DEFAULT NULL,
      president_contact VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_name_contact (name, president_contact)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}
async function ensureMeetingDays() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS meeting_days (
      id INT PRIMARY KEY,
      name VARCHAR(20) NOT NULL UNIQUE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
  await pool.query(`
    INSERT INTO meeting_days (id,name) VALUES
      (1,'Monday'),(2,'Tuesday'),(3,'Wednesday'),(4,'Thursday'),(5,'Friday')
    ON DUPLICATE KEY UPDATE name=VALUES(name)`);
}
async function ensureSubfieldsBase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS subfields (
      id INT AUTO_INCREMENT PRIMARY KEY,
      label VARCHAR(100) NOT NULL UNIQUE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
}
async function ensureLinkTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS club_subfields (
      club_id INT NOT NULL,
      subfield_id INT NOT NULL,
      PRIMARY KEY (club_id, subfield_id),
      FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
      FOREIGN KEY (subfield_id) REFERENCES subfields(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS club_meeting_days (
      club_id INT NOT NULL,
      day_id INT NOT NULL,
      PRIMARY KEY (club_id, day_id),
      FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
      FOREIGN KEY (day_id) REFERENCES meeting_days(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
}
async function ensureClubCategories() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS club_categories (
      club_id INT NOT NULL,
      category VARCHAR(50) NOT NULL,
      PRIMARY KEY (club_id, category),
      FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
}
async function ensureClubFields() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS club_fields (
      club_id INT NOT NULL,
      field_label VARCHAR(100) NOT NULL,
      PRIMARY KEY (club_id, field_label),
      FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
}
async function ensureSchema() {
  await ensureBaseTables();
  await ensureMeetingDays();
  await ensureSubfieldsBase();
  await ensureLinkTables();
  await ensureClubCategories();
  await ensureClubFields();
}
(async () => {
  try { await ensureSchema(); console.log('[schema] ok'); }
  catch (e) { console.error('[schema] failed:', e.code || e.message); }
})();

/* ---------------- Public APIs ---------------- */
app.get('/healthz', (_req, res) => res.json({ ok: true }));

app.get('/api/clubs', async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT id, name, subject, meeting_time_type, meeting_time_range,
            meeting_frequency, prereq_required, prerequisites, description,
            open_to_all, volunteer_hours, status, website_url, meeting_room,
            president_contact
       FROM clubs WHERE status='approved' ORDER BY name`
  );
  res.json({ clubs: rows });
});

/* ---------------- Admin APIs ---------------- */
app.post('/api/admin/login', (req, res) => {
  const { code, code_hash } = req.body || {};
  const admin = process.env.ADMIN_CODE || '';
  const ok = code ? code === admin : code_hash && code_hash === sha256Hex(admin);
  if (!ok) return res.status(401).json({ error: 'invalid' });
  res.json({ ok: true });
});

app.get('/api/admin/clubs', async (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error:'unauthorized' });
  const [rows] = await pool.query(
    `SELECT id, name, subject, meeting_time_type, meeting_time_range,
            meeting_frequency, prereq_required, prerequisites, description,
            open_to_all, volunteer_hours, status, website_url, meeting_room,
            president_contact
       FROM clubs ORDER BY name`
  );
  res.json({ clubs: rows });
});

app.patch('/api/clubs/:id', async (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error:'unauthorized' });
  const desc = typeof req.body.description === 'string' ? req.body.description : '';
  try {
    await pool.query(`UPDATE clubs SET description=? WHERE id=?`, [desc, req.params.id]);
    res.json({ ok:true });
  } catch (e) {
    console.error('patch error:', e.code || e.message);
    res.status(500).json({ error:'db_error' });
  }
});
app.delete('/api/clubs/:id', async (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error:'unauthorized' });
  try {
    await pool.query(`DELETE FROM clubs WHERE id=?`, [req.params.id]);
    res.json({ ok:true });
  } catch (e) {
    console.error('delete error:', e.code || e.message);
    res.status(500).json({ error:'db_error' });
  }
});

/* ---------------- Presidents submit ---------------- */
app.post('/api/presidents/submit', async (req, res) => {
  try {
    const body = req.body || {};
    const expected = process.env.PRESIDENT_PASSWORD || '';
    if (body.president_submit_password !== expected) {
      return res.status(401).json({ error:'unauthorized', reason:'bad_president_password' });
    }

    const club_name = (body.club_name || '').trim();
    const president_contact = (body.president_contact || '').trim();

    if (!club_name || !president_contact) {
      return res.status(400).json({ error:'missing_required', fields:['club_name','president_contact'] });
    }

    await pool.query(
      `INSERT INTO clubs (name, subject, meeting_frequency, meeting_time_type, meeting_time_range,
                          meeting_room, open_to_all, prereq_required, prerequisites, description,
                          volunteer_hours, status, website_url, president_contact)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE subject=VALUES(subject), meeting_frequency=VALUES(meeting_frequency),
                               meeting_time_type=VALUES(meeting_time_type), meeting_time_range=VALUES(meeting_time_range),
                               meeting_room=VALUES(meeting_room), open_to_all=VALUES(open_to_all),
                               prereq_required=VALUES(prereq_required), prerequisites=VALUES(prerequisites),
                               description=VALUES(description), volunteer_hours=VALUES(volunteer_hours),
                               status=VALUES(status), website_url=VALUES(website_url),
                               president_contact=VALUES(president_contact)`,
      [
        club_name,
        body.subject || 'Other',
        body.meeting_frequency || 'weekly',
        body.meeting_time_type || 'lunch',
        body.meeting_time_range || '',
        body.meeting_room || '',
        body.open_to_all ? 1 : 0,
        body.prereq_required ? 1 : 0,
        body.prerequisites || '',
        body.description || '',
        body.volunteer_hours ? 1 : 0,
        'approved',
        normalizeWebsiteUrl(body.website_url),
        president_contact
      ]
    );
    res.json({ ok: true });
  } catch (e) {
    console.error('/api/presidents/submit error:', e.code || e.message);
    res.status(500).json({ error:'db_error' });
  }
});

/* ---------------- Start server ---------------- */
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
