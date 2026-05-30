const pool = require('./backend/src/db.js');
pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'leaderboard'")
  .then(r => { console.log(r.rows); process.exit(0); })
  .catch(console.error);
