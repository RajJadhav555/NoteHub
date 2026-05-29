const pool = require('./backend/src/db');
async function runCleanup() {
  try {
    const res = await pool.query("UPDATE notes SET verification_status = 'pending' WHERE verification_status = 'manual_review'");
    console.log(`✅ Successfully updated ${res.rowCount} legacy records from 'manual_review' to 'pending'.`);
  } catch (err) {
    console.error("❌ SQL Update Error:", err);
  } finally {
    process.exit();
  }
}
runCleanup();
