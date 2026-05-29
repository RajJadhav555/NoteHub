const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walk(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

const SEARCH_DIR = 'e:/Notehub/src';

walk(SEARCH_DIR, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.ts')) {
    let original = fs.readFileSync(filePath, 'utf8');
    let content = original;
    
    // 1. services/api.js & NotePreviewModal.tsx
    content = content.replace(
      /const API_BASE_URL = \(import\.meta\.env && import\.meta\.env\.VITE_API_URL\) \|\| 'http:\/\/localhost:5300\/api';/g,
      "const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:5300/api`;"
    );
    
    // 2. PYQAnalyzer.tsx, AssessmentAI.tsx
    content = content.replace(
      /const API_BASE = import\.meta\.env\?\.VITE_API_BASE_URL \|\| 'http:\/\/localhost:5300';/g,
      "const API_BASE = `${window.location.protocol}//${window.location.hostname}:5300`;"
    );
    
    // 3. Notes.tsx line 50
    content = content.replace(
      /fetch\("http:\/\/localhost:5300\/api\/notes-ai\/chat"/g,
      'fetch(`${window.location.protocol}//${window.location.hostname}:5300/api/notes-ai/chat`'
    );
    
    // 4. Notes.tsx line 214
    content = content.replace(
      /fetch\(`http:\/\/localhost:5300\/api\/notes\/\$\{note\.id\}`/g,
      'fetch(`${window.location.protocol}//${window.location.hostname}:5300/api/notes/${note.id}`'
    );

    // 5. Notes.tsx line 238
    content = content.replace(
      /fetch\(`http:\/\/localhost:5300\/api\/notes\/\$\{note\.id\}\/download`/g,
      'fetch(`${window.location.protocol}//${window.location.hostname}:5300/api/notes/${note.id}/download`'
    );
    
    // 6. Collaborate.tsx line 47
    content = content.replace(
      /const API_BASE_URL = "http:\/\/localhost:5300\/api";/g,
      'const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:5300/api`;'
    );
    
    // 7. UploadModal.tsx line 457
    content = content.replace(
      /fetch\("http:\/\/localhost:5300\/api\/notes\/upload"/g,
      'fetch(`${window.location.protocol}//${window.location.hostname}:5300/api/notes/upload`'
    );
    
    // 8. NotePreviewModal.tsx line 280
    content = content.replace(
      /fetch\(`http:\/\/localhost:5300\/api\/notes\/\$\{note\.id\}\/rating`/g,
      'fetch(`${window.location.protocol}//${window.location.hostname}:5300/api/notes/${note.id}/rating`'
    );

    if (original !== content) {
      fs.writeFileSync(filePath, content);
      console.log('Fixed', filePath);
    }
  }
});
