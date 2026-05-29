import http from 'http';

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/notes/reindex',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

console.log("🔄 Triggering Note Re-indexing...");

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
        console.log("✅ Re-indexing triggered successfully!");
        try {
            const json = JSON.parse(data);
            console.log("Response:", JSON.stringify(json, null, 2));
        } catch (e) {
            console.log("Response:", data);
        }
    } else {
        console.error(`❌ Failed with status code: ${res.statusCode}`);
        console.error("Response:", data);
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Connection error: ${e.message}`);
  console.log("Make sure your backend server is running on port 5000!");
});

req.end();
