const pool = require('./backend/src/db.js');
pool.query("SELECT id, email, password_hash, google_id FROM users WHERE email = 'raajdjadhav1111@gmail.com'")
  .then(r => {
    console.log(r.rows);
    process.exit(0);
  })
  .catch(console.error);
