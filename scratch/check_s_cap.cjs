const fs = require('fs');
const content = fs.readFileSync('Notehub Report/Project Stage II Report.tex', 'utf8');
const lines = content.split('\n');

console.log("=== Checking for \\s and \\cap ===");
lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    if (line.match(/\\s\b/)) {
        console.log(`${lineNum}: [\\s] ${line.trim()}`);
    }
    if (line.match(/\\cap\b/)) {
        console.log(`${lineNum}: [\\cap] ${line.trim()}`);
    }
});
