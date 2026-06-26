const fs = require('fs');
const content = fs.readFileSync('Notehub Report/Project Stage II Report.tex', 'utf8');
const lines = content.split('\n');

console.log("=== Listing all texttt lines ===");
lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    if (line.includes('\\texttt')) {
        console.log(`${lineNum}: ${line.trim()}`);
    }
});
