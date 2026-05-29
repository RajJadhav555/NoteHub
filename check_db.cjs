const pool = require('./backend/src/db');
async function checkSchema() {
  try {
    const res = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'");
    console.log("Users table columns:");
    res.rows.forEach(col => console.log(`- ${col.column_name}: ${col.data_type}`));
    const res2 = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'notes'");
    console.log("\nNotes table columns:");
    res2.rows.forEach(col => console.log(`- ${col.column_name}: ${col.data_type}`));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}
checkSchema();
