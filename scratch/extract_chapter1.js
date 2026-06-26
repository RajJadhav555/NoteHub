const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\ADMIN\\.gemini\\antigravity-ide\\brain\\e585acaa-4d87-4cdd-83fe-35e442a350b1\\.system_generated\\logs\\transcript.jsonl';
const outputPath = path.join(__dirname, 'chapter1_draft.tex');

try {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n');
  let found = false;

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      if (obj.tool_calls) {
        for (const tc of obj.tool_calls) {
          if (tc.name === 'replace_file_content' && tc.args && tc.args.ReplacementContent) {
            fs.writeFileSync(outputPath, tc.args.ReplacementContent, 'utf8');
            console.log(`Successfully extracted Chapter 1 draft to: ${outputPath}`);
            found = true;
            break;
          }
        }
      }
      if (found) break;
    } catch (err) {
      // Ignore JSON parse errors for incomplete lines
    }
  }

  if (!found) {
    console.log('Could not find replace_file_content tool call with ReplacementContent in transcript.');
  }
} catch (error) {
  console.error('Error reading transcript or writing output:', error);
}
