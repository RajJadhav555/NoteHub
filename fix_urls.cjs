const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory() && !dirPath.includes('node_modules')) {
      walk(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

const SEARCH_DIR = 'e:/Notehub/src';

walk(SEARCH_DIR, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.ts')) {
    let original = fs.readFileSync(filePath, 'utf8');
    let content = original;
    
    // Replace all instances of hardcoded http://localhost:5300
    // First, API_BASE_URL patterns
    content = content.replace(/\|\| 'http:\/\/localhost:5300\/api'/g, "|| (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:5300/api` : 'http://localhost:5300/api')");
    content = content.replace(/\|\| 'http:\/\/localhost:5300'/g, "|| (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:5300` : 'http://localhost:5300')");
    
    // Explicit string declarations
    content = content.replace(/"http:\/\/localhost:5300\/api"/g, "(typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:5300/api` : 'http://localhost:5300/api')");
    
    // fetch calls using ""
    content = content.replace(/"http:\/\/localhost:5300\/api/g, "`${window.location.protocol}//${window.location.hostname}:5300/api");
    // fetch calls using `` inside template literals
    content = content.replace(/http:\/\/localhost:5300\/api/g, "${window.location.protocol}//${window.location.hostname}:5300/api");

    if (original !== content) {
      fs.writeFileSync(filePath, content);
      console.log('Fixed:', filePath);
    }
  }
});
