const fs = require('fs');
const content = fs.readFileSync('Notehub Report/Project Stage II Report.tex', 'utf8');
const lines = content.split('\n');

console.log("=== Searching for listings in the file ===");
lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    if (line.includes('listings') || line.includes('lstlisting')) {
        console.log(`${lineNum}: ${line.trim()}`);
    }
});
