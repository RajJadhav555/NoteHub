const fs = require('fs');
const content = fs.readFileSync('Notehub Report/Project Stage II Report.tex', 'utf8');

const commands = new Set();
const matches = content.matchAll(/\\([a-zA-Z]+)/g);
for (const m of matches) {
    commands.add(m[1]);
}

console.log("All commands in the entire document:");
console.log(Array.from(commands).sort().join(', '));
