
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/health',
  method: 'GET',
  timeout: 2000 // 2s timeout
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(`Backend Check Failed: ${e.message}`);
});

req.on('timeout', () => {
    req.destroy();
    console.error('Backend Check Timeout');
});

req.end();
