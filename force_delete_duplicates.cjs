const pool = require('./backend/src/db');

async function forceDeleteDuplicates() {
  try {
    // 1. Find the entries first to see what we are deleting
    const searchRes = await pool.query("SELECT id, title, file_hash FROM notes WHERE title LIKE '%SDN - Unit 3%'");
    console.log(`Found ${searchRes.rows.length} duplicate entries.`);
    
    if (searchRes.rows.length > 0) {
      const ids = searchRes.rows.map(r => r.id);
      const hashes = searchRes.rows.map(r => r.file_hash).filter(h => h);
      
      // 2. Delete by IDs
      const delIds = await pool.query("DELETE FROM notes WHERE id = ANY($1)", [ids]);
      console.log(`✅ Deleted ${delIds.rowCount} records by ID.`);
      
      // 3. Delete by File Hash (just in case there are others with same hash but different titles)
      if (hashes.length > 0) {
        const delHashes = await pool.query("DELETE FROM notes WHERE file_hash = ANY($1)", [hashes]);
        console.log(`✅ Deleted ${delHashes.rowCount} records by File Hash.`);
      }
    } else {
      console.log("No notes found with title 'SDN - Unit 3'.");
    }

  } catch (err) {
    console.error("❌ Deletion Failed:", err);
  } finally {
    process.exit();
  }
}

forceDeleteDuplicates();
