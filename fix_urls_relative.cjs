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
    
    // Replace the (typeof window !== 'undefined' ? `${window.location.protocol}//...` : '...') pattern
    content = content.replace(/\(typeof window !== 'undefined' \? `\$\{window\.location\.protocol\}\/\/\$\{window\.location\.hostname\}:5300\/api` : '\$\{window\.location\.protocol\}\/\/\$\{window\.location\.hostname\}:5300\/api'\)/g, "'/api'");
    content = content.replace(/\(typeof window !== 'undefined' \? `\$\{window\.location\.protocol\}\/\/\$\{window\.location\.hostname\}:5300` : 'http:\/\/localhost:5300'\)/g, "''");
    content = content.replace(/\(typeof window !== 'undefined' \? `\$\{window\.location\.protocol\}\/\/\$\{window\.location\.hostname\}:5300\/api` : 'http:\/\/localhost:5300\/api'\)/g, "'/api'");
    
    // Replace the template literal endpoints
    content = content.replace(/\$\{window\.location\.protocol\}\/\/\$\{window\.location\.hostname\}:5300\/api/g, "/api");
    content = content.replace(/\$\{window\.location\.protocol\}\/\/\$\{window\.location\.hostname\}:5300/g, "");

    // Also replace lingering http://localhost:5300 just in case
    content = content.replace(/http:\/\/localhost:5300\/api/g, "/api");
    
    if (original !== content) {
      fs.writeFileSync(filePath, content);
      console.log('Fixed to relative:', filePath);
    }
  }
});
