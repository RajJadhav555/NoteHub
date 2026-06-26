const fs = require('fs');
const https = require('https');
const path = require('path');

const diagramCode = `graph TD
    WebClient["💻 Web Client <br> (React + Vite + TS)"]:::client
    MobileClient["📱 Mobile Client <br> (Expo + TS)"]:::client

    Proxy["Proxy Gateway <br> (HTTPS / WSS Port 443)"]:::middleware
    AuthGuard["JWT Auth Guard <br> & Security Headers"]:::middleware
    RateLimiter["Token Bucket Rate Limiter"]:::middleware

    AuthController["🔐 Auth Controller"]:::backend
    LLMCoordinator["🤖 LLM & RAG Coordinator"]:::backend
    CollabController["💬 Collaboration Controller"]:::backend
    PlagiarismEngine["🔍 Plagiarism Engine"]:::backend
    DocExtractor["📄 Doc Text Extractor"]:::backend

    Cloudinary[("🖼️ Cloudinary CDN <br> (User Avatars)")]:::cloud
    GeminiAPI["🧠 Google Gemini 2.0 <br> (Study AI & Career Chat)"]:::cloud
    Database[("🗄️ Supabase PostgreSQL DB <br> (+ pgvector Indexing)")]:::database
    WebCrawler["🌐 Web Search Crawler <br> (Lexical checks)"]:::cloud
    SupabaseStorage[("☁️ Supabase Cloud Storage <br> (Note PDF Bucket)")]:::cloud

    WebClient --> Proxy
    MobileClient --> Proxy
    Proxy --> AuthGuard
    AuthGuard --> RateLimiter
    RateLimiter --> AuthController
    RateLimiter --> LLMCoordinator
    RateLimiter --> CollabController
    RateLimiter --> PlagiarismEngine
    PlagiarismEngine --> DocExtractor

    AuthController --> Cloudinary
    AuthController --> Database
    LLMCoordinator --> GeminiAPI
    LLMCoordinator --> Database
    CollabController --> Database
    PlagiarismEngine --> Database
    PlagiarismEngine --> WebCrawler
    DocExtractor --> SupabaseStorage

    classDef client fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#01579b;
    classDef middleware fill:#f5f5f5,stroke:#9e9e9e,stroke-width:2px,color:#212121;
    classDef backend fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#e65100;
    classDef database fill:#efebe9,stroke:#5d4037,stroke-width:2px,color:#3e2723;
    classDef cloud fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,color:#1b5e20;
`;

const json = JSON.stringify({ code: diagramCode, mermaid: { theme: 'default' } });
const base64 = Buffer.from(json).toString('base64');
const url = 'https://mermaid.ink/img/' + base64;

console.log('Fetching image from ' + url);

const destWorkspace = path.join(__dirname, 'system_architecture_v3.png');
const destArtifact = 'C:/Users/ADMIN/.gemini/antigravity/brain/9ebb8b4a-6d0d-4736-a2c5-df94f87d704f/system_architecture_v3.png';

const fileWorkspace = fs.createWriteStream(destWorkspace);

https.get(url, (res) => {
  if (res.statusCode !== 200) {
    console.error('Failed to download image: ' + res.statusCode);
    res.resume();
    return;
  }
  
  res.pipe(fileWorkspace);
  
  fileWorkspace.on('finish', () => {
    fileWorkspace.close();
    console.log('Saved to workspace: ' + destWorkspace);
    
    // Copy to artifact directory
    try {
      fs.copyFileSync(destWorkspace, destArtifact);
      console.log('Copied to artifacts: ' + destArtifact);
    } catch (err) {
      console.error('Failed to copy to artifacts: ' + err.message);
    }
  });
}).on('error', (err) => {
  console.error('Download error: ' + err.message);
});
