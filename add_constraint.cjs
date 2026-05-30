const pool = require('./backend/src/db.js');
pool.query("ALTER TABLE leaderboard ADD CONSTRAINT unique_user_id UNIQUE (user_id);")
  .then(r => { console.log("Constraint added successfully"); process.exit(0); })
  .catch(console.error);
