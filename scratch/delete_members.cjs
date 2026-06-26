const { Pool } = require('../backend/node_modules/pg');

const directUrl = "postgresql://postgres:RDJTSKVSROKP1111@db.ukseqpubzzzjvuyjqivp.supabase.co:5432/postgres";

const pool = new Pool({
  connectionString: directUrl,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    // Delete Tushar Khandagale (ID: 17) and TSK (ID: 18) from study_group_members for group_id: 2
    console.log("Removing User 17 and User 18 from Group 2...");
    const res = await pool.query(
      "DELETE FROM study_group_members WHERE group_id = 2 AND user_id IN (17, 18)"
    );
    console.log(`Deleted ${res.rowCount} rows from study_group_members.`);
  } catch (err) {
    console.error("Database deletion failed:", err);
  } finally {
    await pool.end();
    process.exit();
  }
}

run();
