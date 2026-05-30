require('dotenv').config({ path: '../.env' });
const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const BUCKET_NAME = 'notehub-uploads';
const uploadsDir = path.join(__dirname, 'uploads');

async function migrate() {
  const client = await pool.connect();
  try {
    // Find notes that need migration
    const res = await client.query(`
      SELECT id, title, file_name, file_url 
      FROM notes 
      WHERE file_url IS NULL OR file_url LIKE '%localhost%' OR file_url = ''
    `);
    
    console.log(`Found ${res.rows.length} notes to check for migration.`);

    for (const note of res.rows) {
      if (!note.file_name) {
        console.log(`Skipping note ${note.id} ("${note.title}") - no file_name.`);
        continue;
      }

      const localPath = path.join(uploadsDir, note.file_name);
      if (!fs.existsSync(localPath)) {
        console.log(`Skipping note ${note.id} - file not found on disk: ${note.file_name}`);
        continue;
      }

      console.log(`Uploading note ${note.id}: ${note.file_name}...`);
      const fileBuffer = fs.readFileSync(localPath);
      
      // Determine content type
      const ext = path.extname(note.file_name).toLowerCase();
      let contentType = 'application/octet-stream';
      if (ext === '.pdf') contentType = 'application/pdf';
      else if (ext === '.docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      else if (ext === '.pptx') contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      else if (ext === '.txt') contentType = 'text/plain';

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(note.file_name, fileBuffer, {
          contentType,
          upsert: true
        });

      if (error) {
        console.error(`❌ Failed to upload note ${note.id}:`, error.message);
        continue;
      }

      const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(note.file_name);
      const publicUrl = urlData.publicUrl;

      // Update database
      await client.query(`UPDATE notes SET file_url = $1 WHERE id = $2`, [publicUrl, note.id]);
      console.log(`✅ Note ${note.id} updated with URL: ${publicUrl}`);
    }

    console.log("Migration completed successfully.");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
