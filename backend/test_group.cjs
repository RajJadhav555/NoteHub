require('dotenv').config({ path: '../.env' });
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function check() {
  try {
    const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'study_groups'");
    console.log("study_groups columns:", res.rows.map(r => r.column_name));
    
    // Test if we can insert
    const insertRes = await pool.query(
      `INSERT INTO study_groups (name, description, subject, creator_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      ['Test Group', 'Test Desc', 'Test Subject', 1]
    );
    console.log("Insert success:", insertRes.rows[0]);
    await pool.query('DELETE FROM study_groups WHERE id = $1', [insertRes.rows[0].id]);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    pool.end();
  }
}
check();
