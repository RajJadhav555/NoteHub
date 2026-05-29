const pool = require('./backend/src/db');
async function checkManualReview() {
  try {
    const res = await pool.query("SELECT id, title, verification_status FROM notes WHERE verification_status = 'manual_review'");
    console.log(`Found ${res.rows.length} notes with 'manual_review' status.`);
    res.rows.forEach(note => console.log(`- ID ${note.id}: ${note.title}`));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}
checkManualReview();
