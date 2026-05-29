const fs = require('fs');
const https = require('https');

const diagrams = [
{
 name: 'system_architecture',
 code: `graph TD
    subgraph Client Tier
        UI[React Web App - Vite]
        Auth[Google OAuth Provider]
    end
    subgraph Network Layer
        NGINX[Nginx Reverse Proxy]
    end
    subgraph Application Tier
        API[Express.js REST API]
        WS[Socket.IO Server]
        subgraph Services
            NoteEngine[Note Management]
            CollabEngine[Real-Time Collab]
            Gamification[Leaderboard & Flare]
            AIEngine[AI Services]
            VerifEngine[Security & Plagiarism]
        end
    end
    subgraph Data & Storage Tier
        DB[(PostgreSQL)]
        Cache[(LRU Cache)]
        CDN[Cloudinary]
        VectorStore[(Vector DB)]
    end
    subgraph External APIs
        LLM[OpenAI / Gemini]
    end
    UI -->|HTTPs/REST| NGINX
    UI -->|WSS| NGINX
    UI -.->|OAuth| Auth
    NGINX --> API
    NGINX --> WS
    API --> NoteEngine
    API --> Gamification
    API --> AIEngine
    API --> VerifEngine
    WS --> CollabEngine
    API --> DB
    API --> Cache
    NoteEngine --> CDN
    AIEngine --> LLM
    AIEngine -.-> VectorStore
    VerifEngine --> LLM`
},
{
 name: 'plagiarism_flow',
 code: `sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant PlagiarismEngine
    participant Database

    User->>Frontend: Uploads .pdf/.docx Note Document
    Frontend->>API: POST /api/notes/upload 
    API->>API: Document Parsing 
    
    API->>PlagiarismEngine: Initiates SimHash Check
    PlagiarismEngine->>Database: Query existing node hashes
    Database-->>PlagiarismEngine: Returns corpus fingerprints
    PlagiarismEngine->>PlagiarismEngine: Calculate Jaccard Similarity
    
    alt Similarity > Threshold (e.g., 40%)
        PlagiarismEngine-->>API: Reject 
        API-->>Frontend: Error 406 - Duplicate Content
    else Similarity < Threshold
        API->>Database: Insert Note Meta & Compute Hash
        API-->>Frontend: Success (Points Awarded!)
    end`
}
];

function downloadImage(name, code) {
  const json = JSON.stringify({ code, mermaid: { theme: 'default' } });
  const base64 = Buffer.from(json).toString('base64');
  const url = 'https://mermaid.ink/img/' + base64;
  
  const dest = name + '.png';
  const file = fs.createWriteStream(dest);
  
  https.get(url, (res) => {
    if (res.statusCode !== 200) {
      console.error('Failed to download ' + name + ': ' + res.statusCode);
      res.resume();
      return;
    }
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Downloaded ' + dest);
    });
  }).on('error', (err) => {
    console.error('Error on ' + name + ': ' + err.message);
  });
}

diagrams.forEach(d => downloadImage(d.name, d.code));
