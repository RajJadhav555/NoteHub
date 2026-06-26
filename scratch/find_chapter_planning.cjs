const fs = require('fs');

const filePath = 'd:\\Notehub1\\Notehub\\Notehub Report\\Project Stage II Report.tex';

try {
  const content = fs.readFileSync(filePath, 'utf8');
  
  const headings = [
    '\\chapter{INTRODUCTION}',
    '\\chapter{LITERATURE REVIEW}',
    '\\chapter{SYSTEM ANALYSIS AND SPECIFICATIONS}',
    '\\chapter{SYSTEM PLANNING}',
    '\\chapter{SYSTEM DESIGN}',
    '\\chapter{SYSTEM IMPLEMENTATION}',
    '\\chapter{TESTING AND EVALUATION}',
    '\\chapter{RESULTS AND DISCUSSION}',
    '\\chapter{CONCLUSION}',
    '\\chapter{REFERENCES}'
  ];

  console.log('Searching for chapter markers:');
  headings.forEach(heading => {
    const idx = content.indexOf(heading);
    if (idx !== -1) {
      // Find line number
      const lineNum = content.substring(0, idx).split('\n').length;
      console.log(`Found: "${heading}" at line ${lineNum} (index ${idx})`);
    } else {
      console.log(`NOT Found: "${heading}"`);
    }
  });

} catch (err) {
  console.error(err);
}
