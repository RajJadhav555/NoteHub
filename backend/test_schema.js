const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.ukseqpubzzzjvuyjqivp:RDJTSKVSROKP1111@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres' });
client.connect()
  .then(() => client.query("SELECT * FROM users WHERE email = 'tushar@gmail.com'"))
  .then(res => { console.log(res.rows); return client.end(); })
  .catch(e => console.error(e));
