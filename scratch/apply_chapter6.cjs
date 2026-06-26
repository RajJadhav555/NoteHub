const fs = require('fs');
const path = require('path');

const reportPath = path.join(__dirname, '..', 'Notehub Report', 'Project Stage II Report.tex');
const contentPath = path.join(__dirname, 'chapter6_content.txt');

try {
  const reportContent = fs.readFileSync(reportPath, 'utf8');
  const chapter6Content = fs.readFileSync(contentPath, 'utf8');

  const startMarker = '\\chapter{SYSTEM IMPLEMENTATION}';
  const endMarker = '\\chapter{TESTING AND EVALUATION}';

  const startIndex = reportContent.indexOf(startMarker);
  const endIndex = reportContent.indexOf(endMarker);

  if (startIndex === -1) {
    console.error('Could not find start marker: \\chapter{SYSTEM IMPLEMENTATION}');
    process.exit(1);
  }
  if (endIndex === -1) {
    console.error('Could not find end marker: \\chapter{TESTING AND EVALUATION}');
    process.exit(1);
  }

  const updatedReport = reportContent.substring(0, startIndex) + chapter6Content + reportContent.substring(endIndex);
  
  fs.writeFileSync(reportPath, updatedReport, 'utf8');
  console.log('Successfully updated Chapter 6 in the LaTeX report!');
  console.log(`Original character length: ${reportContent.length}`);
  console.log(`Updated character length: ${updatedReport.length}`);
} catch (error) {
  console.error('An error occurred:', error);
  process.exit(1);
}
