const { Pool } = require('../backend/node_modules/pg');

const directUrl = "postgresql://postgres:RDJTSKVSROKP1111@db.ukseqpubzzzjvuyjqivp.supabase.co:5432/postgres";

const pool = new Pool({
  connectionString: directUrl,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    const res = await pool.query("SELECT id, name, last_seen, NOW(), NOW() - last_seen as diff FROM users ORDER BY id");
    console.log("=== USER LAST SEEN ===");
    res.rows.forEach(r => {
      console.log(`ID: ${r.id} | Name: ${r.name} | Last Seen: ${r.last_seen} | Server Time: ${r.now} | Diff: ${JSON.stringify(r.diff)}`);
    });
  } catch (err) {
    console.error("Database query failed:", err);
  } finally {
    await pool.end();
    process.exit();
  }
}

run();
