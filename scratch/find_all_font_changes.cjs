const fs = require('fs');
const content = fs.readFileSync('Notehub Report/Project Stage II Report.tex', 'utf8');
const lines = content.split('\n');

const fontCmds = [
    'sffamily', 'ttfamily', 'rmfamily', 'normalfont', 'bfseries', 'itshape', 'slshape', 'scshape',
    'fontfamily', 'fontseries', 'fontshape', 'fontsize', 'selectfont',
    'rm', 'sf', 'tt', 'bf', 'it', 'sl', 'sc', 'cal', 'em'
];

console.log("=== Searching for all possible font-changing commands ===");
lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    fontCmds.forEach(cmd => {
        const regex = new RegExp('\\\\' + cmd + '\\b');
        if (regex.test(line)) {
            console.log(`${lineNum}: [${cmd}] ${line.trim()}`);
        }
    });
});
