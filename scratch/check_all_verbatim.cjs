const fs = require('fs');
const content = fs.readFileSync('Notehub Report/Project Stage II Report.tex', 'utf8');
const lines = content.split('\n');

console.log("=== Listing all verbatim starts and ends ===");
lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    if (line.includes('verbatim')) {
        console.log(`${lineNum}: ${JSON.stringify(line)}`);
    }
});
