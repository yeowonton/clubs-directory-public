import mysql from 'mysql2/promise';
import fs from 'fs';

async function dumpDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQLHOST || process.env.MYSQL_URL?.split('@')[1]?.split(':')[0],
    port: process.env.MYSQLPORT || 3306,
    user: process.env.MYSQLUSER || "root",
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE || "railway",
  });

  const [tables] = await connection.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE();
  `);

  let dump = "";

  for (const row of tables) {
    const table = row.table_name;

    // Drop statement
    dump += `DROP TABLE IF EXISTS \`${table}\`;\n`;

    // Create table
    const [[createRow]] = await connection.query(`SHOW CREATE TABLE \`${table}\`;`);
    dump += createRow['Create Table'] + ";\n\n";

    // Dump data
    const [rows] = await connection.query(`SELECT * FROM \`${table}\`;`);
    if (rows.length > 0) {
      dump += `INSERT INTO \`${table}\` VALUES\n`;
      dump += rows
        .map(row =>
          "(" +
            Object.values(row)
              .map(v => (v === null ? "NULL" : mysql.escape(v)))
              .join(",") +
          ")"
        )
        .join(",\n");
      dump += `;\n\n`;
    }
  }

  fs.writeFileSync("backup.sql", dump);
  console.log("✅ Backup complete! File written: backup.sql");

  await connection.end();
}

dumpDatabase().catch(err => {
  console.error("❌ ERROR:", err);
  process.exit(1);
});
