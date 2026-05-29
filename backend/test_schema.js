const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.ukseqpubzzzjvuyjqivp:RDJTSKVSROKP1111@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres' });
client.connect()
  .then(() => client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'"))
  .then(res => { console.log(res.rows.map(r=>r.column_name)); return client.end(); })
  .catch(e => console.error(e));
