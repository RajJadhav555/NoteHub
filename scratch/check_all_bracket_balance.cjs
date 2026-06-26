const fs = require('fs');
const content = fs.readFileSync('Notehub Report/Project Stage II Report.tex', 'utf8');

let braceCount = 0;
let bracketCount = 0;
const unmatchedBraces = [];
const unmatchedBrackets = [];

for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '{') {
        braceCount++;
    } else if (char === '}') {
        braceCount--;
        if (braceCount < 0) {
            unmatchedBraces.push({ type: 'extra_close', pos: i });
            braceCount = 0;
        }
    } else if (char === '[') {
        bracketCount++;
    } else if (char === ']') {
        bracketCount--;
        if (bracketCount < 0) {
            unmatchedBrackets.push({ type: 'extra_close', pos: i });
            bracketCount = 0;
        }
    }
}

console.log("Brace balance:", braceCount);
console.log("Bracket balance:", bracketCount);
console.log("Extra closing braces count:", unmatchedBraces.length);
console.log("Extra closing brackets count:", unmatchedBrackets.length);
