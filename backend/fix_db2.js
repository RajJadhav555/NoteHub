require('dotenv').config({ path: '../.env' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function fix() {
  try {
    console.log("Using DB:", process.env.DATABASE_URL);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false`);
    console.log("Successfully added is_verified column to users table!");
  } catch (e) {
    console.error("Error:", e);
  } finally {
    pool.end();
  }
}
fix();
