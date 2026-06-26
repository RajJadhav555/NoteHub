const { Pool } = require('../backend/node_modules/pg');

const directUrl = "postgresql://postgres:RDJTSKVSROKP1111@db.ukseqpubzzzjvuyjqivp.supabase.co:5432/postgres";

const pool = new Pool({
  connectionString: directUrl,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    console.log("Removing inactive User 1 from Group 2...");
    const delRes = await pool.query(
      "DELETE FROM study_group_members WHERE group_id = 2 AND user_id = 1"
    );
    console.log(`Deleted ${delRes.rowCount} rows.`);

    console.log("Adding active User 17 back to Group 2...");
    const insRes = await pool.query(
      "INSERT INTO study_group_members (group_id, user_id) VALUES (2, 17) ON CONFLICT DO NOTHING"
    );
    console.log(`Inserted ${insRes.rowCount} rows.`);
  } catch (err) {
    console.error("Database migration failed:", err);
  } finally {
    await pool.end();
    process.exit();
  }
}

run();
