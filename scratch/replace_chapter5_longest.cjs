const fs = require('fs');
const path = require('path');

const filePath = 'd:\\Notehub1\\Notehub\\Notehub Report\\Project Stage II Report.tex';

try {
  let content = fs.readFileSync(filePath, 'utf8');

  const startMarker = '\\chapter{SYSTEM DESIGN}';
  const endMarker = '\\chapter{SYSTEM IMPLEMENTATION}';

  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker);

  if (startIndex === -1) {
    console.error('Could not find start marker: \\chapter{SYSTEM DESIGN}');
    process.exit(1);
  }
  if (endIndex === -1) {
    console.error('Could not find end marker: \\chapter{SYSTEM IMPLEMENTATION}');
    process.exit(1);
  }

  const before = content.substring(0, startIndex);
  const after = content.substring(endIndex);

  const newChapter5 = `\\chapter{SYSTEM DESIGN}
\\rule{\\textwidth}{1pt}

\\section{SYSTEM ARCHITECTURE}
The architecture of NoteHub follows a modern, decoupled three-tier model, separating the client interface from the backend business logic and the database layer. The system relies heavily on asynchronous API communication to handle file uploads, real-time collaboration, and intensive AI processing tasks without blocking the main event loop.

\\subsection{Three-Tier Logical Mapping}
\\begin{enumerate}
    \\item \\textbf{Presentation Tier (Client Layer):} Built with React.js Vite and TypeScript for the administrative web interface, and React Native with Expo CLI for the mobile application. The web app communicates via REST endpoints using Axios and is designed for heavy admin workflows. The mobile app interfaces via standard native view components, managing local caching and SQLite wrappers for offline document catalogs.
    \\item \\textbf{Application Logic Tier (Business Layer):} A Node.js runtime executing an Express.js API server. This layer is responsible for token signature checking, routing incoming multipart payloads, running text extraction pipelines, managing Socket.io channels, and executing API coordination to third-party services.
    \\item \\textbf{Data Tier (Persistence Layer):} PostgreSQL is the database engine. Relational models handle schemas for users, points, and study sessions. Vector data is stored using the \\texttt{VECTOR(1536)} type and queried using pgvector distance operators. File binaries are persisted in Cloudinary and Supabase buckets, minimizing local disk footprint.
\\end{enumerate}

\\subsection{Hardware and Software Interaction}
Clients connect to backend routes over HTTPS (port 443) for standard REST transactions and over WebSockets (WSS, port 443) for Socket.io events. The backend runs containerized within Docker engines on virtualized hosts (Render), connecting to a managed PostgreSQL cluster. Hardware parameters like memory allocation are highly monitored, as pgvector similarity index builds and document text extraction require significant RAM and CPU.

\\begin{figure}[H]
\\centering
\\resizebox{\\textwidth}{!}{%
\\begin{tikzpicture}[
    node distance=1.5cm and 2cm,
    box/.style={rectangle, draw, rounded corners, align=center, minimum width=3.5cm, minimum height=1.6cm, fill=blue!5, thick},
    db/.style={cylinder, draw, shape border rotate=90, aspect=0.25, align=center, minimum width=3.0cm, minimum height=2.5cm, fill=orange!10, thick},
    cloud/.style={ellipse, draw, align=center, minimum width=3.2cm, minimum height=1.8cm, fill=gray!10, thick},
    arrow/.style={-{Stealth[scale=1.2]}, thick}
]

% Nodes
\\node[box] (webclient) {\\textbf{Web Client (React Vite)}\\\\UI Dashboard, Axios};
\\node[box, below=of webclient] (mobileclient) {\\textbf{Mobile Client (Expo)}\\\\AsyncStorage, Camera};
\\node[box, right=of webclient, xshift=1cm, yshift=-1.5cm] (backend) {\\textbf{Express API Backend}\\\\Route Controllers, Middleware,\\\\Socket.io, Multer, pdf-parse};
\\node[db, right=of backend, xshift=1.5cm] (postgres) {\\textbf{PostgreSQL Database}\\\\pgvector Extension,\\\\Relational Tables,\\\\IVFFlat Vector Indexes};
\\node[cloud, below=of backend, yshift=-0.5cm] (cloudinary) {\\textbf{Cloudinary / Supabase}\\\\PDF \\& Image Storage};
\\node[cloud, above=of postgres, yshift=0.5cm] (gemini) {\\textbf{Google Gemini 2.0 API}\\\\RAG Embedding \\& Chat};
\\node[cloud, below=of postgres, yshift=-0.5cm] (crawler) {\\textbf{Google Search API}\\\\Web Crawler Matches};

% Connections
\\draw[arrow, <->] (webclient) -| node[above, xshift=-1cm, font=\\small] {HTTPS (REST)} (backend);
\\draw[arrow, <->] (mobileclient) -| node[below, xshift=-1.2cm, font=\\small] {WSS (WebSockets)} (backend);
\\draw[arrow, <->] (backend) -- node[above, font=\\small] {pg-pool SQL} (postgres);
\\draw[arrow, ->] (backend) -- node[left, font=\\small] {Binary Stream} (cloudinary);
\\draw[arrow, <->] (backend) -- node[right, font=\\small] {Embeddings \\& Vision} (gemini);
\\draw[arrow, ->] (backend) |- node[below right, font=\\small] {Axios crawling} (crawler);

\\end{tikzpicture}%
}
\\caption{Detailed NoteHub Hardware and Software Architecture}
\\label{fig:detailed_architecture}
\\end{figure}

\\section{MATHEMATICAL MODEL}
The core logic of NoteHub is built around mathematical definitions that enable document indexing, similarity searches, and rate limiting.

\\subsection{Jaccard Similarity for Lexical Plagiarism Check}
The Winnowing algorithm converts raw normalized text strings into a set of integers representing fingerprint hashes. Let $A$ be the shingle set of hashes from the uploaded PDF document, and $B$ be the shingle set of hashes of a note already stored in the database. The lexical similarity index $J(A, B)$ is defined as:
\\begin{equation}
J(A, B) = \\frac{|A \\cap B|}{|A \\cup B|} = \\frac{|A \\cap B|}{|A| + |B| - |A \\cap B|}
\\end{equation}
The system rejects the note and flags it as plagiarized if:
\\begin{equation}
J(A, B) \\ge \\theta_{\\text{lexical}} \\quad (\\text{where } \\theta_{\\text{lexical}} = 0.40)
\\end{equation}

\\subsection{Hamming Distance for SimHash Near-Duplicate Checking}
To handle paraphrase modifications, the system computes a 64-bit SimHash. The text is split into terms $T$, and each term is assigned a weight $w_i$. Let $h(t_i)$ be a 64-bit standard hash of term $t_i$. The SimHash vector $\\mathbf{V} = [v_0, v_1, \\dots, v_{63}]$ is computed by:
\\begin{equation}
v_j = \\sum_{i=1}^{m} w_i \\cdot \\text{sign}(h(t_i)_j) \\quad \\text{where } \\text{sign}(x) = \\begin{cases} 1 & \\text{if the } j\\text{-th bit is } 1 \\\\ -1 & \\text{if the } j\\text{-th bit is } 0 \\end{cases}
\\end{equation}
The final 64-bit fingerprint hash $F = [f_0, f_1, \\dots, f_{63}]$ is defined as:
\\begin{equation}
f_j = \\begin{cases} 1 & \\text{if } v_j > 0 \\\\ 0 & \\text{if } v_j \\le 0 \\end{cases}
\\end{equation}
The Hamming distance between the new fingerprint $F_1$ and database fingerprint $F_2$ is:
\\begin{equation}
\\text{HammingDistance}(F_1, F_2) = \\sum_{j=0}^{63} (f_{1,j} \\oplus f_{2,j}) = \\text{popcount}(F_1 \\oplus F_2)
\\end{equation}
Near-duplicates are flagged when:
\\begin{equation}
\\text{HammingDistance}(F_1, F_2) \\le \\theta_{\\text{semantic}} \\quad (\\text{where } \\theta_{\\text{semantic}} = 3)
\\end{equation}

\\subsection{Cosine Similarity for pgvector RAG matches}
Natural language search and RAG contexts require calculating semantic distance. Text chunks are embedded into 1536-dimensional vectors. Let $\\mathbf{q}$ be the query vector, and $\\mathbf{d}$ be the chunk embedding vector. The cosine similarity is:
\\begin{equation}
\\text{CosineSimilarity}(\\mathbf{q}, \\mathbf{d}) = \\frac{\\mathbf{q} \\cdot \\mathbf{d}}{\\|\\mathbf{q}\\| \\|\\mathbf{d}\\|} = \\frac{\\sum_{i=1}^{1536} q_i d_i}{\\sqrt{\\sum_{i=1}^{1536} q_i^2} \\sqrt{\\sum_{i=1}^{1536} d_i^2}}
\\end{equation}
The pgvector extension uses the distance operator \\texttt{<=>}, which evaluates $1 - \\text{CosineSimilarity}$. Chunks are selected when:
\\begin{equation}
1 - (\\mathbf{q} \\cdot \\mathbf{d}) / (\\|\\mathbf{q}\\| \\|\\mathbf{d}\\|) \\le 1 - \\alpha \\quad (\\text{where } \\alpha = 0.75)
\\end{equation}

\\subsection{Token Bucket Rate Limiting Algorithm}
API endpoints are protected from overload using the Token Bucket abstraction. A bucket has maximum token limit $B$. Tokens accumulate at refill rate $r$ per second. The number of active tokens $T(t)$ for client $k$ is:
\\begin{equation}
T_k(t) = \\min(B, T_k(t_0) + r(t - t_0) - C)
\\end{equation}
If $T_k(t) < 1$, the request is blocked, throwing an HTTP 429 error.

\\subsection{Score and Points Model}
User points are modeled by a linear point system:
\\begin{equation}
\\text{Points}(u) = 50 \\cdot N_{\\text{verified}}(u) + 20 \\cdot H_{\\text{resolved}}(u) + 10 \\cdot Q_{\\ge 80\\%}(u)
\\end{equation}
where $N_{\\text{verified}}$ is notes uploaded, $H_{\\text{resolved}}$ is peer help requests resolved, and $Q_{\\ge 80\\%}$ is quizzes completed with a score above 80\\%.

\\section{SYSTEM FLOW DIAGRAM}
The flow diagram illustrates the sequential pipeline a document undergoes during the upload process. The document must pass through distinct validation gates before being permanently stored and published.

\\begin{figure}[H]
\\centering
\\resizebox{!}{0.7\\textheight}{%
\\begin{tikzpicture}[
    node distance=1.3cm,
    startstop/.style={rectangle, rounded corners, minimum width=3.5cm, minimum height=0.9cm, text centered, draw, fill=red!10, thick},
    process/.style={rectangle, minimum width=3.5cm, minimum height=0.9cm, text centered, draw, fill=orange!10, thick},
    decision/.style={diamond, aspect=2, minimum width=3.5cm, minimum height=1.0cm, text centered, draw, fill=green!10, thick},
    arrow/.style={thick,->,>=stealth}
]

% Nodes
\\node (start) [startstop] {Upload Note PDF};
\\node (extract) [process, below of=start] {Extract Text (pdf-parse)};
\\node (winnow) [process, below of=extract] {Winnowing Fingerprinting};
\\node (dec1) [decision, below of=winnow, yshift=-0.3cm] {Lexical Match $\\ge 40\\%?$};
\\node (simhash) [process, below of=dec1, yshift=-0.5cm] {Calculate SimHash distance};
\\node (dec2) [decision, below of=simhash, yshift=-0.3cm] {Hamming Distance $\\le 3$?};
\\node (crawler) [process, below of=dec2, yshift=-0.5cm] {Sentence Crawler search};
\\node (dec3) [decision, below of=crawler, yshift=-0.3cm] {Web URL overlap $\ge 50\\%?$};
\\node (gemini) [process, below of=dec3, yshift=-0.5cm] {Gemini Content Audit};
\\node (dec4) [decision, below of=gemini, yshift=-0.3cm] {Valid Study material?};
\\node (save) [process, below of=dec4, yshift=-0.5cm] {Save to Postgres \\& Cloudinary};
\\node (end) [startstop, below of=save] {Publish Note};
\\node (reject) [startstop, right of=dec2, xshift=4cm] {Reject Upload \\& Set status = failed};

% Connections
\\draw [arrow] (start) -- (extract);
\\draw [arrow] (extract) -- (winnow);
\\draw [arrow] (winnow) -- (dec1);
\\draw [arrow] (dec1) -- node[anchor=east] {No} (simhash);
\\draw [arrow] (dec1) -| node[anchor=south, xshift=-0.5cm] {Yes} (reject);
\\draw [arrow] (simhash) -- (dec2);
\\draw [arrow] (dec2) -- node[anchor=east] {No} (crawler);
\\draw [arrow] (dec2) -- node[anchor=south] {Yes} (reject);
\\draw [arrow] (crawler) -- (dec3);
\\draw [arrow] (dec3) -- node[anchor=east] {No} (gemini);
\\draw [arrow] (dec3) -| node[anchor=south, xshift=-0.5cm] {Yes} (reject);
\\draw [arrow] (gemini) -- (dec4);
\\draw [arrow] (dec4) -- node[anchor=east] {Yes} (save);
\\draw [arrow] (dec4) -| node[anchor=south, xshift=-0.5cm] {No} (reject);
\\draw [arrow] (save) -- (end);

\\end{tikzpicture}%
}
\\caption{Document Ingestion and Multi-Gate Verification Pipeline Flow}
\\label{fig:pipeline_flow}
\\end{figure}

The pipeline begins when the student uploads a document. The server processes the upload asynchronously. If the document similarity checks trigger a pass, it is committed to storage and points are updated. Otherwise, the note is marked as rejected, preventing clutter.

\\section{ER DIAGRAM}
The Entity-Relationship model specifies the logical database schema for NoteHub, detailing tables, column types, keys, and foreign relational bindings.

\\begin{figure}[H]
\\centering
\\resizebox{\\textwidth}{!}{%
\\begin{tikzpicture}[
    node distance=1.5cm and 2.5cm,
    entity/.style={rectangle, draw, rounded corners=2pt, align=left, minimum width=3.5cm, fill=yellow!10, thick},
    relation/.style={draw, -{Stealth[scale=1.2]}, thick}
]

% Entities
\\node[entity] (users) {
\\textbf{users}\\\\
\\hline
\\underline{id} (UUID) [PK]\\\\
email (VARCHAR)\\\\
name (VARCHAR)\\\\
points (INTEGER)\\\\
role (VARCHAR)
};

\\node[entity, right=of users, xshift=1.5cm] (notes) {
\\textbf{notes}\\\\
\\hline
\\underline{id} (UUID) [PK]\\\\
title (VARCHAR)\\\\
file\\_url (VARCHAR)\\\\
uploader\\_id (UUID) [FK]\\\\
status (VARCHAR)\\\\
subject\\_id (UUID) [FK]
};

\\node[entity, below=of notes, yshift=-0.5cm] (embeddings) {
\\textbf{note\\_embeddings}\\\\
\\hline
\\underline{id} (UUID) [PK]\\\\
note\\_id (UUID) [FK]\\\\
chunk\\_index (INT)\\\\
content (TEXT)\\\\
embedding (VECTOR(1536))
};

\\node[entity, below=of users, yshift=-0.5cm] (messages) {
\\textbf{messages}\\\\
\\hline
\\underline{id} (UUID) [PK]\\\\
room\\_id (UUID) [FK]\\\\
sender\\_id (UUID) [FK]\\\\
content (TEXT)\\\\
timestamp (TIMESTAMP)
};

\\node[entity, right=of notes, xshift=1.5cm] (rooms) {
\\textbf{study\\_rooms}\\\\
\\hline
\\underline{id} (UUID) [PK]\\\\
name (VARCHAR)\\\\
subject\\_id (UUID) [FK]\\\\
creator\\_id (UUID) [FK]
};

% Connections (1 to Many relations)
\\draw[relation] (users) -- node[above, font=\\small] {1:N} (notes);
\\draw[relation] (notes) -- node[right, font=\\small] {1:N} (embeddings);
\\draw[relation] (users) -- node[left, font=\\small] {1:N} (messages);
\\draw[relation] (rooms) |- node[below, xshift=1cm, font=\\small] {1:N} (messages);
\\draw[relation] (users) -- node[above, font=\\small] {1:N} (rooms);

\\end{tikzpicture}%
}
\\caption{NoteHub Entity-Relationship (ER) Schema Diagram}
\\label{fig:er_diagram}
\\end{figure}

The database architecture leverages PostgreSQL primary keys and indexing. The \\texttt{note\_embeddings} table is separate from the metadata to optimize similarity search.

\\section{DATA FLOW DIAGRAMS}
Data Flow Diagrams model the movement of data elements through external entities, processes, and internal databases.

\\subsection{Level 0 DFD (Context Level)}
At Context Level 0, the NoteHub application is treated as a single process, showing external entities and data stores.

\\begin{figure}[H]
\\centering
\\resizebox{0.8\\textwidth}{!}{%
\\begin{tikzpicture}[
    node distance=2.5cm,
    external/.style={rectangle, draw, minimum width=3.0cm, minimum height=1.2cm, fill=gray!20, thick, align=center},
    process/.style={circle, draw, minimum size=2.8cm, fill=blue!10, thick, align=center},
    datastore/.style={rectangle, draw, minimum width=3.0cm, minimum height=1.2cm, fill=yellow!20, thick, align=center},
    arrow/.style={thick,->,>=stealth}
]

% Nodes
\\node (student) [external] {Student / Admin};
\\node (sys) [process, right=of student, xshift=0.5cm] {0.0\\\\NoteHub\\\\System};
\\node (ai) [external, right=of sys, xshift=0.5cm] {Gemini / Mistral};
\\node (db) [datastore, below=of sys] {PostgreSQL\\\\Database};

% Connections
\\draw [arrow] (student.15) -- node[above, font=\\small] {PDF note, chat queries} (sys.165);
\\draw [arrow] (sys.195) -- node[below, font=\\small] {Verified files, roadmaps} (student.345);
\\draw [arrow] (sys.15) -- node[above, font=\\small] {Text arrays} (ai.165);
\\draw [arrow] (ai.195) -- node[below, font=\\small] {Embeddings, text} (sys.345);
\\draw [arrow] (sys.250) -- node[left, font=\\small] {SQL updates} (db.110);
\\draw [arrow] (db.70) -- node[right, font=\\small] {Select arrays} (sys.290);

\\end{tikzpicture}%
}
\\caption{Context Level Data Flow Diagram (Level 0)}
\\label{fig:dfd0_ch5}
\\end{figure}

\\subsection{Level 1 DFD (Process Level)}
Level 1 DFD decomposes the system into core sub-processes: Authentication, Note Ingestion, Plagiarism, Advisor, and Collaboration.

\\begin{figure}[H]
\\centering
\\resizebox{\\textwidth}{!}{%
\\begin{tikzpicture}[
    node distance=1.5cm and 2.5cm,
    process/.style={circle, draw, minimum size=2.2cm, fill=blue!10, thick, align=center, font=\\small},
    datastore/.style={rectangle, draw, minimum width=2.5cm, minimum height=1cm, fill=yellow!20, thick, align=center, font=\\small},
    external/.style={rectangle, draw, minimum width=2.5cm, minimum height=1.2cm, fill=gray!20, thick, align=center, font=\\small},
    arrow/.style={thick,->,>=stealth}
]

% Nodes
\\node (student) [external] {Student};
\\node (auth) [process, below of=student, yshift=-1.5cm] {1.0\\\\Auth\\\\Process};
\\node (ingest) [process, right=of auth, xshift=1.5cm] {2.0\\\\Note\\\\Ingest};
\\node (verify) [process, below=of ingest, yshift=-1.0cm] {3.0\\\\Verification\\\\Pipeline};
\\node (rag) [process, right=of ingest, xshift=1.5cm] {4.0\\\\AI RAG\\\\Advisor};
\\node (db) [datastore, below=of auth, yshift=-1.0cm] {D1: Relational DB};

% Arrows
\\draw [arrow] (student) -- node[right] {Google credential} (auth);
\\draw [arrow] (auth) -- node[above] {Verify} (db);
\\draw [arrow] (student) -- node[above right] {Note upload} (ingest);
\\draw [arrow] (ingest) -- node[right] {Raw text} (verify);
\\draw [arrow] (verify) |- node[below right, yshift=0.3cm] {Update status} (db);
\\draw [arrow] (student) -| node[above] {Career queries} (rag);
\\draw [arrow] (rag) |- node[below] {Cosine query} (db);

\\end{tikzpicture}%
}
\\caption{Process Level Data Flow Diagram (Level 1)}
\\label{fig:dfd1}
\\end{figure}

\\subsection{Level 2 DFD (Decomposed Verification Pipeline)}
Level 2 DFD details the sub-processes of the Plagiarism and Verification Pipeline (Process 3.0).

\\begin{figure}[H]
\\centering
\\resizebox{\\textwidth}{!}{%
\\begin{tikzpicture}[
    node distance=1.5cm and 2.0cm,
    process/.style={circle, draw, minimum size=2.0cm, fill=blue!10, thick, align=center, font=\\small},
    datastore/.style={rectangle, draw, minimum width=2.5cm, minimum height=1cm, fill=yellow!20, thick, align=center, font=\\small},
    external/.style={rectangle, draw, minimum width=2.5cm, minimum height=1.2cm, fill=gray!20, thick, align=center, font=\\small},
    arrow/.style={thick,->,>=stealth}
]

% Nodes
\\node (input) [process] {3.1\\\\Parse PDF\\\\Text};
\\node (winnow) [process, right=of input, xshift=0.5cm] {3.2\\\\Lexical\\\\Winnowing};
\\node (simhash) [process, right=of winnow, xshift=0.5cm] {3.3\\\\Semantic\\\\SimHash};
\\node (crawler) [process, below=of winnow, yshift=-1.0cm] {3.4\\\\Web Search\\\\Crawler};
\\node (gemini) [process, below=of simhash, yshift=-1.0cm] {3.5\\\\Gemini\\\\Audit};
\\node (db) [datastore, below=of input, yshift=-1.0cm] {D2: Shingles \\& Notes};

% Connections
\\draw [arrow] (input) -- node[above] {Raw text} (winnow);
\\draw [arrow] (winnow) -- node[above] {Hashes} (simhash);
\\draw [arrow] (winnow) -- node[left] {Query shingles} (db);
\\draw [arrow] (simhash) -- node[left] {Hamming checks} (db);
\\draw [arrow] (simhash) -- node[left] {Sentences} (crawler);
\\draw [arrow] (crawler) -- node[above] {Web pages} (gemini);
\\draw [arrow] (gemini) |- node[below, xshift=1.5cm] {Save verified note} (db);

\\end{tikzpicture}%
}
\\caption{Decomposed Verification Data Flow Diagram (Level 2)}
\\label{fig:dfd2}
\\end{figure}

\\section{UML DIAGRAMS}
Unified Modeling Language (UML) diagrams specify the object-oriented structure, class operations, execution timelines, and deployments.

\\subsection{Use Case Diagram}
The Use Case Diagram defines the interactions between platform actors and functional boundaries.

\\begin{figure}[H]
\\centering
\\resizebox{!}{0.65\\textheight}{%
\\begin{tikzpicture}[
    actor/.style={draw, circle, minimum size=1cm, fill=blue!5, thick},
    usecase/.style={ellipse, draw, fill=green!5, minimum width=3cm, minimum height=1cm, thick, align=center, font=\\small},
    relation/.style={draw, thick}
]

% Student Actor
\\node[actor] (student) at (-4, 0) {};
\\draw[thick] (student.south) -- (-4, -1.2);
\\draw[thick] (-4.5, -0.6) -- (-3.5, -0.6);
\\draw[thick] (-4, -1.2) -- (-4.4, -2.0);
\\draw[thick] (-4, -1.2) -- (-3.6, -2.0);
\\node[below=of student, yshift=-1.3cm] {\\textbf{Student}};

% Admin Actor
\\node[actor] (admin) at (6, 0) {};
\\draw[thick] (admin.south) -- (6, -1.2);
\\draw[thick] (5.5, -0.6) -- (6.5, -0.6);
\\draw[thick] (6, -1.2) -- (5.6, -2.0);
\\draw[thick] (6, -1.2) -- (6.4, -2.0);
\\node[below=of admin, yshift=-1.3cm] {\\textbf{Administrator}};

% Use Cases
\\node[usecase] (uc1) at (1, 3) {Google Sign-In};
\\node[usecase] (uc2) at (1, 1.5) {Upload note PDF};
\\node[usecase] (uc3) at (1, 0) {Search note RAG};
\\node[usecase] (uc4) at (1, -1.5) {Chat Career Advisor};
\\node[usecase] (uc5) at (1, -3) {Join study room};
\\node[usecase] (uc6) at (1, -4.5) {Manage Whitelist};

% Connections
\\draw[relation] (-3.3, -0.5) -- (uc1);
\\draw[relation] (-3.3, -0.5) -- (uc2);
\\draw[relation] (-3.3, -0.5) -- (uc3);
\\draw[relation] (-3.3, -0.5) -- (uc4);
\\draw[relation] (-3.3, -0.5) -- (uc5);
\\draw[relation] (5.3, -0.5) -- (uc1);
\\draw[relation] (5.3, -0.5) -- (uc6);

\\end{tikzpicture}%
}
\\caption{UML Use Case Diagram}
\\label{fig:use_case}
\\end{figure}

\\subsection{Class Diagram}
The Class Diagram models the attributes and operations of the backend routing and business controllers.

\\begin{figure}[H]
\\centering
\\resizebox{\\textwidth}{!}{%
\\begin{tikzpicture}[
    class/.style={rectangle, draw, minimum width=4.5cm, fill=yellow!5, thick, align=left, font=\\small}
]

% UserController
\\node[class] (userCtrl) {
\\textbf{UserController}\\\\
\\hline
- dbPool: pg.Pool\\\\
+ registerUser(req, res)\\\\
+ loginGoogle(req, res)\\\\
+ getAchievements(req, res)
};

% NoteController
\\node[class, right=of userCtrl, xshift=1cm] (noteCtrl) {
\\textbf{NoteController}\\\\
\\hline
- storageClient: Supabase\\\\
+ uploadNote(req, res)\\\\
+ searchSemantic(req, res)\\\\
+ getNoteDetails(req, res)
};

% PlagiarismEngine
\\node[class, below=of noteCtrl, yshift=-0.5cm] (plagEngine) {
\\textbf{PlagiarismEngine}\\\\
\\hline
- kgramSize: int = 20\\\\
- windowSize: int = 15\\\\
+ runWinnowing(text): int[]\\\\
+ calculateSimHash(text): long\\\\
+ queryCrawler(sentences): URL[]
};

% Connections
\\draw[thick, ->] (noteCtrl) -- (plagEngine);

\\end{tikzpicture}%
}
\\caption{UML Class Diagram}
\\label{fig:class_diagram}
\\end{figure}

\\subsection{Sequence Diagram}
The Sequence Diagram traces the operational steps during note upload and plagiarism checking.

\\begin{figure}[H]
\\centering
\\resizebox{\\textwidth}{!}{%
\\begin{tikzpicture}[
    lifeline/.style={rectangle, draw, minimum width=2cm, fill=blue!5, thick, align=center, font=\\small},
    line/.style={dashed, thick},
    arrow/.style={-{Stealth}, thick}
]

% Lifelines
\\node[lifeline] (client) {Client App};
\\node[lifeline, right=of client, xshift=1cm] (backend) {Express API};
\\node[lifeline, right=of backend, xshift=1cm] (engine) {Plagiarism};
\\node[lifeline, right=of engine, xshift=1cm] (db) {PostgreSQL};

% Timelines
\\draw[line] (client) -- (client |- 0,-8);
\\draw[line] (backend) -- (backend |- 0,-8);
\\draw[line] (engine) -- (engine |- 0,-8);
\\draw[line] (db) -- (db |- 0,-8);

% Actions
\\draw[arrow] (0,-1) -- node[above, font=\\small] {POST /upload (PDF)} (3.4,-1);
\\draw[arrow] (3.4,-2) -- node[above, font=\\small] {runVerification()} (6.9,-2);
\\draw[arrow] (6.9,-3) -- node[above, font=\\small] {query shingles} (10.4,-3);
\\draw[arrow] (10.4,-4) -- node[below, font=\\small] {Fingerprint results} (6.9,-4);
\\draw[arrow] (6.9,-5) -- node[below, font=\\small] {Audit verdict} (3.4,-5);
\\draw[arrow] (3.4,-6) -- node[above, font=\\small] {Commit record (status=verified)} (10.4,-6);
\\draw[arrow] (3.4,-7) -- node[below, font=\\small] {HTTP 201 Created} (0,-7);

\\end{tikzpicture}%
}
\\caption{UML Sequence Diagram for Note Upload Pipeline}
\\label{fig:sequence_diagram}
\\end{figure}

\\subsection{Collaboration Diagram}
The Collaboration Diagram highlights the structural interactions and message numbering between client, server, and storage.

\\begin{figure}[H]
\\centering
\\resizebox{0.85\\textwidth}{!}{%
\\begin{tikzpicture}[
    object/.style={rectangle, draw, minimum width=2.8cm, minimum height=1cm, fill=blue!5, thick, align=center, font=\\small},
    arrow/.style={-{Stealth}, thick}
]

% Nodes
\\node[object] (client) {Client App};
\\node[object, right=of client, xshift=2cm] (api) {Express Server};
\\node[object, below=of api, yshift=-1.5cm] (db) {PostgreSQL};
\\node[object, left=of db, xshift=-2cm] (storage) {Cloudinary};

% Messages
\\draw[thick] (client) -- node[above, font=\\small] {1: uploadNote()} (api);
\\draw[thick] (api) -- node[right, font=\\small] {3: saveMetadata()} (db);
\\draw[thick] (api) -- node[below left, font=\\small] {2: streamBinary()} (storage);
\\draw[thick] (client) -- node[left, font=\\small] {4: retrieveFile()} (storage);

\\end{tikzpicture}%
}
\\caption{UML Collaboration Diagram}
\\label{fig:collaboration_diagram}
\\end{figure}

\\subsection{Activity Diagram}
The Activity Diagram maps the process states of real-time messaging verification in Socket namespaces.

\\begin{figure}[H]
\\centering
\\resizebox{!}{0.65\\textheight}{%
\\begin{tikzpicture}[
    state/.style={rectangle, draw, rounded corners, minimum width=3cm, fill=orange!10, thick, align=center, font=\\small},
    decision/.style={diamond, draw, aspect=2, fill=green!10, thick, align=center, font=\\small},
    arrow/.style={-{Stealth}, thick}
]

% Nodes
\\node[circle, draw, fill=black, minimum size=0.5cm] (start) at (0,0) {};
\\node[state, below=of start, yshift=0.3cm] (recv) {Receive Message Event};
\\node[state, below=of recv, yshift=0.3cm] (jwt) {Check Socket Handshake Token};
\\node[decision, below=of jwt, yshift=0.1cm] (dec1) {Token Valid?};
\\node[state, below=of dec1, yshift=-0.2cm] (filter) {Run leo-profanity filters};
\\node[state, below=of filter, yshift=0.3cm] (db) {Save chat log to PostgreSQL};
\\node[state, below=of db, yshift=0.3cm] (broadcast) {Broadcast sanitized array};
\\node[circle, draw, double, fill=black, minimum size=0.5cm, below=of broadcast, yshift=0.3cm] (end) {};
\\node[state, right=of dec1, xshift=1.5cm] (reject) {Disconnect Sockets};

% Connections
\\draw[arrow] (start) -- (recv);
\\draw[arrow] (recv) -- (jwt);
\\draw[arrow] (jwt) -- (dec1);
\\draw[arrow] (dec1) -- node[left] {Yes} (filter);
\\draw[arrow] (dec1) -- node[above] {No} (reject);
\\draw[arrow] (filter) -- (db);
\\draw[arrow] (db) -- (broadcast);
\\draw[arrow] (broadcast) -- (end);
\\draw[arrow] (reject) |- (end);

\\end{tikzpicture}%
}
\\caption{UML Activity Diagram for Socket Chat Moderation}
\\label{fig:activity_diagram}
\\end{figure}

\\subsection{State Chart Diagram}
The State Chart Diagram models the states of Note upload.

\\begin{figure}[H]
\\centering
\\resizebox{\\textwidth}{!}{%
\\begin{tikzpicture}[
    state/.style={rectangle, draw, rounded corners, minimum width=2.8cm, minimum height=1cm, fill=blue!5, thick, align=center, font=\\small},
    arrow/.style={-{Stealth}, thick}
]

% Nodes
\\node[state] (uploaded) {Uploaded};
\\node[state, right=of uploaded, xshift=1cm] (pending) {Pending Verification};
\\node[state, below=of pending, yshift=-1cm] (failed) {Rejected};
\\node[state, left=of failed, xshift=-1cm] (verified) {Published};

% Connections
\\draw[arrow] (uploaded) -- node[above] {Multipart parser} (pending);
\\draw[arrow] (pending) -- node[right] {Plagiarism score $\ge 40\\%$} (failed);
\\draw[arrow] (pending) -- node[below left] {Passed all checkpoints} (verified);

\\end{tikzpicture}%
}
\\caption{UML State Chart Diagram for Document Entity}
\\label{fig:statechart_diagram}
\\end{figure}

\\subsection{Component Diagram}
The Component Diagram details the module packages on client web, mobile, and Express APIs.

\\begin{figure}[H]
\\centering
\\resizebox{\\textwidth}{!}{%
\\begin{tikzpicture}[
    component/.style={rectangle, draw, minimum width=3.5cm, fill=green!5, thick, align=center, font=\\small},
    interface/.style={circle, draw, minimum size=0.3cm, fill=white, thick},
    arrow/.style={draw, -{Stealth}, thick}
]

% Components
\\node[component] (frontend) {Frontend Clients\\\\(Web \\& Mobile)};
\\node[component, right=of frontend, xshift=2cm] (backend) {Express Application\\\\Controllers};
\\node[component, below=of backend, yshift=-1cm] (security) {Auth Middleware\\\\Helmet, JWT};
\\node[component, below=of frontend, yshift=-1cm] (ai) {AI Gateway\\\\Gemini API wrapper};

% Connectors
\\draw[arrow] (frontend) -- node[above] {HTTP / WSS} (backend);
\\draw[arrow] (backend) -- (security);
\\draw[arrow] (backend) |- (ai);

\\end{tikzpicture}%
}
\\caption{UML Component Diagram}
\\label{fig:component_diagram}
\\end{figure}

\\subsection{Deployment Diagram}
The Deployment Diagram maps the physical hosts (Vercel, Render Docker containers, PostgreSQL databases, Cloudinary clusters).

\\begin{figure}[H]
\\centering
\\resizebox{\\textwidth}{!}{%
\\begin{tikzpicture}[
    node/.style={rectangle, draw, minimum width=3.8cm, minimum height=1.6cm, fill=gray!10, thick, align=center, font=\\small},
    device/.style={rectangle, draw, rounded corners, minimum width=3.0cm, minimum height=1.2cm, fill=blue!5, thick, align=center, font=\\small},
    arrow/.style={draw, -{Stealth}, thick}
]

% Nodes
\\node[device] (client) {Client Browser /\\\\Mobile Expo OS};
\\node[node, right=of client, xshift=1.5cm] (vercel) {\\textbf{Vercel Server}\\\\Static Assets Content};
\\node[node, below=of vercel, yshift=-0.5cm] (render) {\\textbf{Render Server}\\\\Docker Containers,\\\\Express API REST Server};
\\node[node, below=of render, yshift=-0.5cm] (postgres) {\\textbf{PostgreSQL Host}\\\\Relational tables \\& vector};

% Connections
\\draw[arrow] (client) -- node[above] {HTTP GET} (vercel);
\\draw[arrow] (client) |- node[below right, yshift=0.3cm] {HTTPS / WebSockets} (render);
\\draw[arrow] (render) -- node[right] {TCP/IP Port 5432} (postgres);

\\end{tikzpicture}%
}
\\caption{UML Physical Deployment Diagram}
\\label{fig:deployment_diagram}
\\end{figure}

\\subsection{Package Diagram}
The Package Diagram segments the repository codebase into backend routes, controller files, middleware wrappers, and configurations.

\\begin{figure}[H]
\\centering
\\resizebox{\\textwidth}{!}{%
\\begin{tikzpicture}[
    package/.style={rectangle, draw, minimum width=3.5cm, fill=yellow!10, thick, align=center, font=\\small},
    arrow/.style={draw, -{Stealth}, thick}
]

% Packages
\\node[package] (routes) {Routes Package\\\\(auth, notes, career)};
\\node[package, below=of routes, yshift=0.5cm] (ctrl) {Controllers Package\\\\(user, note, solver)};
\\node[package, below=of ctrl, yshift=0.5cm] (model) {Models Package\\\\(relational schemas)};
\\node[package, right=of ctrl, xshift=1.5cm] (utils) {Utils Package\\\\(winnowing, SimHash)};

% Connections
\\draw[arrow] (routes) -- (ctrl);
\\draw[arrow] (ctrl) -- (model);
\\draw[arrow] (ctrl) -- (utils);

\\end{tikzpicture}%
}
\\caption{UML Package Structure Diagram}
\\label{fig:package_diagram}
\\end{figure}

The packages diagram (Figure~\\ref{fig:package_diagram}) represents the directory setup, isolating routing endpoints from controller operations and utility math modules, which guarantees model-view-controller separation.
`;

  const finalContent = before + newChapter5 + after;
  fs.writeFileSync(filePath, finalContent, 'utf8');
  console.log('Successfully replaced Chapter 5 with super-expanded version v6 in Project Stage II Report.tex');
} catch (err) {
  console.error('Error modifying file:', err);
  process.exit(1);
}
