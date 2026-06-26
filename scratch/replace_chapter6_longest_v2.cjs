const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'Notehub Report', 'Project Stage II Report.tex');
const content = fs.readFileSync(filePath, 'utf8');

const startMarker = '\\chapter{SYSTEM IMPLEMENTATION}';
const endMarker = '\\chapter{TESTING AND EVALUATION}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found!');
  process.exit(1);
}

const newChapter6 = `\\chapter{SYSTEM IMPLEMENTATION}
\\rule{\\textwidth}{1pt}
\\paragraph{}
\\section{PROJECT IMPLEMENTATION OVERVIEW}

System implementation is the phase in which the abstract architecture, interface designs, mathematical models, and process flows documented in previous chapters are translated into a concrete, executable software system. The development of NoteHub was structured around a modern, iterative lifecycle utilizing Agile Scrum principles. This approach allowed the development team to iteratively build, test, and refine modules in a controlled manner, ensuring that the critical core engines---such as the Winnowing plagiarism checker and the pgvector-powered career advisor---were validated before building secondary client features.

Development was conducted over a four-phase schedule corresponding to four 2-week sprints. The team prioritized database schema design and file management first (Sprint 1), followed by the core API pipeline and plagiarism checker (Sprint 2), the RAG pipeline and AI career advisor (Sprint 3), and finally, real-time collaboration, user interfaces, gamification, and cloud deployment (Sprint 4).

To maintain code quality and prevent integration conflicts in the monorepo codebase, Git version control was strictly enforced using a feature-branch workflow. The workflow rules were defined as follows:
\\begin{itemize}
    \\item \\textbf{Main Branch (production):} Represents the stable, production-ready release of NoteHub. Direct commits to the main branch were blocked.
    \\item \\textbf{Development Branch (dev):} Serves as the primary integration branch where new features are combined and tested.
    \\item \\textbf{Feature Branches (feature/\\textit{name}):} Developers worked on isolated features (e.g., \\texttt{feature/auth}, \\texttt{feature/plagiarism-engine}, \\texttt{feature/rag-chat}) branched off the \\texttt{dev} branch.
    \\item \\textbf{Pull Requests (PR):} Merging into the dev branch required a pull request, passing local verification checks (ESLint compilation and unit tests), and receiving approval from at least one other developer.
\\end{itemize}

The implementation process followed six distinct milestones, detailed chronologically below.

% ---------------------------------------------------------
\\subsection{Step 1 — Development Environment Setup}

The first milestone was establishing a uniform and reproducible development environment across all developers' local machines. This mitigated the common problem of environmental inconsistencies (\\textit{\"it works on my machine\"}).

On the backend, Node.js v20 LTS was selected as the JavaScript runtime to ensure access to modern async/await syntax and ES modules. The project was initialized with \\texttt{npm init}, and the basic middleware packages were configured: \\texttt{express} for handling routes, \\texttt{cors} to manage cross-origin request permissions, and \\texttt{dotenv} to safely extract database credentials and private API keys from local configuration files.

On the frontend, Vite was used to bootstrap the React application using a TypeScript configuration. Vite was chosen for its fast Hot Module Replacement (HMR) and lightweight dev server, which avoids the long bundling delays of traditional Webpack. Core UI utility packages, such as \\texttt{lucide-react} for icons and Tailwind CSS for utility styling, were added. Global workspace directories were structured to isolate components, custom routes, database migrations, and utilities.

% ---------------------------------------------------------
\\subsection{Step 2 — Database Initialisation}

The second milestone was the configuration and setup of the PostgreSQL database. NoteHub relies heavily on PostgreSQL\'s robust relational features and support for high-dimensional vector search via the \\texttt{pgvector} extension.

A comprehensive schema initialization script, \\texttt{init.sql}, was written to define all tables, fields, constraints, and relationships. First, the \\texttt{pgvector} extension was enabled using \\texttt{CREATE EXTENSION IF NOT EXISTS vector}. Next, core tables representing users, notes, shingles, and embeddings were constructed. 

Primary keys were index-configured, and foreign keys were defined with cascading rules to prevent orphaned records (for example, deleting a user automatically cascades to their leaderboard standing). To optimize the performance of similarity searches on high-dimensional data, special indices were configured: standard B-Tree indexes on textual search columns (such as Note categories) and a specialized \\texttt{IVFFlat} index on vector columns to accelerate nearest-neighbor retrieval.

% ---------------------------------------------------------
\\subsection{Step 3 — Backend API Implementation}

With the database established, the Express.js application was structured as a collection of decoupled route controllers. All REST API endpoints were registered under the \\texttt{/api/v1} prefix, separating public endpoints (such as public note searches and login) from protected routes (such as note uploading, profile modifications, and career advisory).

A custom authentication middleware, \\texttt{authenticateToken}, was written to intercept requests to protected endpoints. This middleware extracts the JSON Web Token (JWT) from the incoming authorization header, decodes the user identity, checks the signature against the server\'s secret key, and appends the user information to the request object. 

To process file uploads, \\texttt{multer} was integrated as a middleware on the note upload route. When a client submits a PDF note, Multer buffers the binary file in server memory, permitting the backend to immediately extract textual strings using \\texttt{pdf-parse} and compute hashes. On completion, the binary file is streamed to Supabase Cloud Storage, and the metadata is saved to PostgreSQL.

% ---------------------------------------------------------
\\subsection{Step 4 — Frontend Client Implementation}

The presentation layer was implemented as a responsive React Single Page Application (SPA). Global application state, specifically the logged-in student\'s user profile, JWT, and authentication status, is maintained using a React Context Provider (\\texttt{AuthContext}). This prevents the antipattern of prop-drilling.

Client-side routing is managed through a lightweight hash-based router that dynamically mounts top-level view modules based on the window location. Key layouts (such as the Note Cards grid, Leaderboard ranking tables, and Group Chat panel) were constructed with responsive Tailwind classes, ensuring usability on both mobile screens and desktop monitors.

The Note Upload Modal was designed as a finite state machine with animated scanning phases. While the backend performs calculations, the frontend transitions through states: \\texttt{uploading} $\\rightarrow$ \\texttt{extracting\_text} $\\rightarrow$ \\texttt{checking\_internal\_similarity} $\\rightarrow$ \\texttt{crawling\_web\_sources} $\\rightarrow$ \\texttt{generating\_ai\_report} $\\rightarrow$ \\texttt{done}.

% ---------------------------------------------------------
\\subsection{Step 5 — Integration and Testing}

Once both the client and server components reached functional parity, they were integrated. A local Docker-compose environment was configured to run PostgreSQL, the Express server, and the Vite client together.

Integration testing focused heavily on the synchronization of the plagiarism checker and the RAG pipeline. Automated test scripts using Jest and Supertest were executed to simulate concurrent note uploads, verifying that the server correctly computed Jaccard similarities, logged embedding vectors in pgvector, rejected overlapping shingles, and properly formatted the JSON responses.

Manual User Acceptance Testing (UAT) was conducted using Chrome and Firefox developer tool consoles to debug layout alignments, WebSocket chat connections under simulated packet loss, and error boundaries for API failures (such as token expiration).

% ---------------------------------------------------------
\\subsection{Step 6 — Cloud Deployment and Production Setup}

The final step was deploying the functional monorepo to production cloud infrastructure. A production-ready configuration was established:
\\begin{itemize}
    \\item \\textbf{Frontend Hosting:} The Vite application was compiled into static HTML/JS/CSS assets using \\texttt{npm run build}. The output directory was deployed to Vercel, which provides fast global delivery via its CDN.
    \\item \\textbf{Backend Hosting:} The Node.js Express server was packaged into a Docker container and deployed to Render. The service was configured to auto-scale based on memory utilization.
    \\item \\textbf{Database Hosting:} A managed PostgreSQL database was provisioned on Supabase, and the \\texttt{init.sql} script was run to construct the tables and enable \\texttt{pgvector}.
    \\item \\textbf{Cloud File Storage:} Supabase Storage buckets were created with policies that restrict direct write permissions, ensuring all PDF uploads are routed through the backend verifications first.
\\end{itemize}

\\subsection{Implementation Steps Summary}

Table~\\ref{tab:impl_steps} summarizes the tasks, outputs, and sprint schedule followed during the implementation phase.

\\begin{table}[htbp]
\\centering
\\renewcommand{\\arraystretch}{1.5}
\\caption{NoteHub Implementation Steps Summary}
\\label{tab:impl_steps}
\\resizebox{\\textwidth}{!}{%
\\begin{tabular}{|c|l|l|l|p{4.5cm}|}
\\hline
\\textbf{Step} & \\textbf{Activity} & \\textbf{Key Outputs} & \\textbf{Sprint} & \\textbf{Developer Role} \\\\
\\hline
1 & Env Setup & Project directory structure, Git configuration & Pre-IT & Lead Developer \\\\
\\hline
2 & DB Setup & init.sql, pgvector installation, indices & Sprint 1 & Database Engineer \\\\
\\hline
3 & API Routes & Auth handlers, upload route, message router & Sprint 1-2 & Backend Developer \\\\
\\hline
4 & UI Screens & Notes Grid, Chat Panel, Career Chat Interface & Sprint 3 & Frontend Developer \\\\
\\hline
5 & Engines & Winnowing custom algorithm, RAG pgvector helper & Sprint 2-3 & ML/Algorithm Specialist \\\\
\\hline
6 & Deployment & Render Docker deploy, Vercel build, CDN routing & Sprint 4 & DevOps Engineer \\\\
\\hline
\\end{tabular}%
}
\\end{table}

\\newpage
\\section{IMPLEMENTED SYSTEM ARCHITECTURE}

The physical implementation of NoteHub is structured around a \\textbf{three-tier client--server architecture}. The separation of concerns between presentation, business logic, and database persistence is maintained across all modules. This design guarantees that database operations are isolated from user-facing screens and that the server acts as an authoritative controller.

\\subsection{Architecture Diagram}

Figure~\\ref{fig:arch_diagram} illustrates the physical deployment topology of the implemented NoteHub system, tracing HTTP REST traffic, real-time WebSocket events, database query protocols, and third-party API connections.

\\begin{figure}[htbp]
\\centering
\\resizebox{\\textwidth}{!}{%
\\begin{tikzpicture}[
    node distance = 0.6cm and 1.0cm,
    box/.style     = {rectangle, draw=black, rounded corners=4pt,
                      minimum width=3.0cm, minimum height=0.7cm,
                      font=\\small, fill=white, align=center},
    tier/.style    = {rectangle, draw=black!40, rounded corners=6pt,
                      inner sep=10pt, fill=gray!8},
    ext/.style     = {rectangle, draw=orange!70, rounded corners=4pt,
                      minimum width=2.8cm, minimum height=0.7cm,
                      font=\\small, fill=orange!10, align=center},
    arrow/.style   = {-{Stealth[length=5pt]}, thick},
    darrow/.style  = {{Stealth[length=5pt]}-{Stealth[length=5pt]}, thick, gray!70}
]

%% -- Tier 1: Frontend --------------------------------------
\\node[box, fill=blue!10] (auth_ui)   {Auth / Profile UI};
\\node[box, fill=blue!10, right=0.4cm of auth_ui]  (notes_ui)   {Notes Module};
\\node[box, fill=blue!10, right=0.4cm of notes_ui] (career_ui)  {Career AI UI};
\\node[box, fill=blue!10, below=0.3cm of auth_ui]  (upload_ui)  {Upload Modal};
\\node[box, fill=blue!10, right=0.4cm of upload_ui](collab_ui)  {Collaborate UI};
\\node[box, fill=blue!10, right=0.4cm of collab_ui](leader_ui)  {Leaderboard UI};

\\begin{scope}[on background layer]
  \\node[tier, fit=(auth_ui)(notes_ui)(career_ui)(upload_ui)(collab_ui)(leader_ui),
        label=above:{\\textbf{Tier 1 — Presentation Layer (React.js + Vite + TypeScript)}}]
        (tier1) {};
\\end{scope}

%% -- Tier 2: Backend ---------------------------------------
\\node[box, fill=green!10, below=1.4cm of upload_ui] (auth_rt)   {auth.js};
\\node[box, fill=green!10, right=0.4cm of auth_rt]   (notes_rt)  {notes.js};
\\node[box, fill=green!10, right=0.4cm of notes_rt]  (career_rt) {career.js};
\\node[box, fill=green!10, below=0.3cm of auth_rt]   (leader_rt) {leaderboard.js};
\\node[box, fill=green!10, right=0.4cm of leader_rt] (msg_rt)    {messages.js};

\\node[box, fill=teal!10, right=0.4cm of msg_rt]     (plag_ut)   {plagiarism\\\\Checker.js};
\\node[box, fill=teal!10, below=0.3cm of plag_ut]    (webp_ut)   {webPlagiarism\\\\Checker.js};
\\node[box, fill=teal!10, right=0.4cm of plag_ut]    (ai_ut)     {ai.js};
\\node[box, fill=teal!10, below=0.3cm of ai_ut]      (rag_ut)    {rag.js};

\\begin{scope}[on background layer]
  \\node[tier, fit=(auth_rt)(notes_rt)(career_rt)(leader_rt)(msg_rt)(plag_ut)(webp_ut)(ai_ut)(rag_ut),
        label=above:{\\textbf{Tier 2 — Application Layer (Node.js / Express.js)}}]
        (tier2) {};
\\end{scope}

%% -- Tier 3: Database --------------------------------------
\\node[box, fill=purple!10, below=1.4cm of leader_rt] (db_users)  {users};
\\node[box, fill=purple!10, right=0.4cm of db_users]  (db_notes)  {notes};
\\node[box, fill=purple!10, right=0.4cm of db_notes]  (db_shin)   {note\\_shingles};
\\node[box, fill=purple!10, right=0.4cm of db_shin]   (db_emb)    {note\\_embeddings\\\\(pgvector)};
\\node[box, fill=purple!10, below=0.3cm of db_users]  (db_lb)     {leaderboard};
\\node[box, fill=purple!10, right=0.4cm of db_lb]     (db_msg)    {messages};

\\begin{scope}[on background layer]
  \\node[tier, fit=(db_users)(db_notes)(db_shin)(db_emb)(db_lb)(db_msg),
        label=below:{\\textbf{Tier 3 — Data Layer (PostgreSQL + pgvector)}}]
        (tier3) {};
\\end{scope}

%% -- External Services -------------------------------------
\\node[ext, right=1.6cm of ai_ut]   (mistral)  {Mistral AI API};
\\node[ext, below=0.3cm of mistral] (gemini)   {Google Gemini};
\\node[ext, below=0.3cm of gemini]  (gsearch)  {Google Search\\\\API};
\\node[ext, below=0.3cm of gsearch] (ddg)      {DuckDuckGo\\\\Scraper};
\\node[ext, below=0.3cm of ddg]     (supabase) {Supabase\\\\Storage};
\\node[ext, below=0.3cm of supabase](goauth)   {Google OAuth\\\\2.0};

%% -- Arrows: Frontend <-> Backend ----------------------------
\\draw[darrow] (tier1.south) -- node[right, font=\\scriptsize]{REST / HTTP} (tier2.north);

%% -- Arrows: Backend <-> Database ----------------------------
\\draw[darrow] (tier2.south) -- node[right, font=\\scriptsize]{SQL / pgvector} (tier3.north);

%% -- Arrows: Backend -> External ----------------------------
\\draw[arrow, orange!80] (ai_ut.east)   -- (mistral.west);
\\draw[arrow, orange!80] (ai_ut.east)   -- (gemini.west);
\\draw[arrow, orange!80] (webp_ut.east) -- (gsearch.west);
\\draw[arrow, orange!80] (webp_ut.east) -- (ddg.west);
\\draw[arrow, orange!80] (notes_rt.east)-- (supabase.west);
\\draw[arrow, orange!80] (auth_rt.east) -- (goauth.west);

\\end{tikzpicture}%
}
\\caption{NoteHub Implemented System Architecture (Three-Tier with External Services)}
\\label{fig:arch_diagram}
\\end{figure}

% ---------------------------------------------------------
\\subsection{Tier 1 — Presentation Layer}

The presentation layer is the user\'s entry point. Developed using React.js 18, Vite, and TypeScript, it is compiled as a static Single Page Application (SPA). To maintain a smooth user experience, all API calls to the backend are asynchronous (using Axios) and do not trigger page refreshes.

The UI utilizes dynamic layouts that resize automatically based on the user\'s device. CSS styles are handled using Tailwind CSS utility definitions. When the application loads, Vite mounts the main \\texttt{App.tsx} component which acts as the layout shell, rendering navigation menus and checking if a valid JWT is saved in the browser\'s session storage.

If the user is logged in, the \\texttt{AuthContext} is populated, making the user\'s profile available to all views. Communication with the backend is abstracted into \\texttt{src/services/api.js}, which automatically attaches the JWT token to the authorization headers of outgoing requests.

% ---------------------------------------------------------
\\subsection{Tier 2 — Application Layer}

The business logic of NoteHub runs on a Node.js Express server. It handles routing, coordinates file parsing, executes the plagiarism logic, and structures database operations.

Rather than maintaining a single large server file, routes are segmented into dedicated controllers (such as \\texttt{routes/auth.js} and \\texttt{routes/notes.js}) and mounted as Express sub-routers. Heavy computing operations, such as computing hashes or comparing fingerprint arrays, are isolated into helper utility modules in the \\texttt{utils/} directory. This structure allows the main server routing layer to remain clean.

To handle real-time chat, a Socket.io server is attached directly to the Node.js HTTP server. This allows client connections to bypass the standard REST request pipeline, establishing persistent, bidirectional TCP tunnels for fast message delivery.

% ---------------------------------------------------------
\\subsection{Tier 3 — Data Layer}

The database layer runs on PostgreSQL 15. The database structures all note metadata, student profiles, shingles, and chat history. To perform Retrieval-Augmented Generation, pgvector stores 1536-dimensional float vector embeddings generated by the LLM embedding API. 

The backend application establishes connection pooling via the \\texttt{pg.Pool} client. Connection pooling allows the backend to keep a pool of reusable database connections active, reducing the CPU and latency overhead of establishing a new TCP handshake for every single API request.

Database indexes are split into:
\\begin{itemize}
    \\item \\textbf{B-Tree Indexes:} Configured on foreign keys (such as \\texttt{uploader\_id} and \\texttt{user\_id}) and string search inputs (such as Note subjects and academic departments).
    \\item \\textbf{Vector Indexes (IVFFlat):} Set up on the embedding vector column on the \\texttt{note\_embeddings} table to allow fast cosine distance queries.
\\end{itemize}

% ---------------------------------------------------------
\\subsection{External Service Integration}

NoteHub relies on several third-party cloud APIs to enrich its feature set:
\\begin{enumerate}
    \\item \\textbf{Mistral AI API:} The primary LLM provider. Used to evaluate document quality during verification and generate answers for the career advisor.
    \\item \\textbf{Google Gemini API:} The backup LLM provider. Used when the Mistral service is unavailable or rate-limited.
    \\item \\textbf{Google Custom Search API:} Used during web plagiarism checks. The backend submits extracted sentences to Google to find online matches.
    \\item \\textbf{DuckDuckGo HTML Scraper:} A backup search mechanism that scrapes search results if the Google API limit is reached.
    \\item \\textbf{Supabase Storage:} Hosts PDF files. When a note is verified, the file is saved to Supabase, which returns a public URL.
    \\item \\textbf{Google OAuth 2.0 API:} Handles social authentication, verifying the student\'s university identity.
\\end{enumerate}

% ---------------------------------------------------------
\\subsection{Project Directory Structure}

The NoteHub codebase is organized as a monorepo containing both the frontend client code and backend server code. This layout makes it easy to share configurations and run local tests. The folder directory structure is shown below:

\\begin{verbatim}
Notehub/
|-- .env                        # Root configuration file
|-- init.sql                    # Database tables and constraints
|-- package.json                # Frontend dependencies
|-- vite.config.ts              # Vite bundle configuration
|-- src/                        # Frontend source folder
|   |-- components/             # Reusable UI parts
|   |   |-- UploadModal.tsx     # Note upload workflow
|   |   |-- LeaderboardTable.tsx# Student ranking display
|   |   `-- NotePreviewModal.tsx# PDF reader and report viewer
|   |-- modules/                # Core page views
|   |   |-- Notes.tsx           # Search and filter notes
|   |   |-- CareerAI.tsx        # Career advisor chat interface
|   |   |-- Collaborate.tsx     # Real-time study groups
|   |   `-- Leaderboard.tsx     # Gamified standings
|   |-- services/
|   |   `-- api.js              # Asynchronous HTTP requests
|   `-- context/
|       `-- AuthContext.tsx     # Global JWT and user state
`-- backend/
    |-- package.json            # Backend package configurations
    `-- src/
        |-- server.js           # Main Express server entry point
        |-- db.js               # PostgreSQL connection pool helper
        |-- routes/             # Express routes controllers
        |   |-- auth.js         # User registration and social login
        |   |-- notes.js        # Note uploads and database CRUD
        |   |-- career.js       # RAG pipeline routing
        |   |-- leaderboard.js  # Ranking update queries
        |   `-- messages.js     # Persistent chat records
        `-- utils/              # Computational algorithms
            |-- ai.js           # Multi-provider LLM connector
            |-- rag.js          # Vector chunking and embedding queries
            |-- plagiarismChecker.js # Rolling hash plagiarism engine
            |-- webPlagiarismChecker.js # Search API web comparison
            `-- aiVerifier.js   # Content validation logic
\\end{verbatim}

\\newpage
\\section{DEVELOPMENT ENVIRONMENT}

To support consistent development, the workspace was configured with detailed hardware, software, and configuration files.

\\subsection{Hardware and Operating System}

Table~\\ref{tab:hardware} lists the minimum local development specs required to compile and run NoteHub\'s client and server.

\\begin{table}[htbp]
\\centering
\\renewcommand{\\arraystretch}{1.5}
\\caption{Development Hardware and OS Specifications}
\\label{tab:hardware}
\\resizebox{\\textwidth}{!}{%
\\begin{tabular}{|l|l|p{8.0cm}|}
\\hline
\\textbf{Component} & \\textbf{Specification} & \\textbf{Importance to NoteHub} \\\\
\\hline
Operating System   & Windows 11 Home (64-bit) & Standard environment matching student test machines. \\\\
\\hline
Processor          & Intel Core i5 / AMD Ryzen 5 & Essential for fast compilation of TS files and local builds. \\\\
\\hline
RAM                & 8 GB DDR4 & Minimum memory required to run Postgres, Node, and Vite concurrently. \\\\
\\hline
Storage            & 256 GB SSD & Provides fast disk I/O, vital for loading node\\_modules. \\\\
\\hline
Browser            & Chrome 124 / Firefox 125 & Used to verify CSS layouts, localStorage, and WebSockets. \\\\
\\hline
\\end{tabular}%
}
\\end{table}

\\subsection{Development Tools and IDE}

Visual Studio Code (v1.88+) served as the unified IDE for the team. Code standards were enforced using ESLint for static script auditing and Prettier for automated syntax formatting. VS Code extensions including \\texttt{TypeScript IntelliSense}, \\texttt{GitLens}, and \\texttt{REST Client} accelerated feature iteration. API endpoint validation was performed using Postman before writing front-end client services.

\\subsection{Backend Production Dependencies}

All backend packages are configured in \\texttt{backend/package.json}. Table~\\ref{tab:backend_deps} details these modules.

\\begin{table}[htbp]
\\centering
\\renewcommand{\\arraystretch}{1.4}
\\caption{Backend Production Dependencies}
\\label{tab:backend_deps}
\\resizebox{\\textwidth}{!}{%
\\begin{tabular}{|l|l|p{7.5cm}|}
\\hline
\\textbf{Package} & \\textbf{Version} & \\textbf{Purpose / Application} \\\\
\\hline
\\texttt{express} & \\^{}4.18.2 & Core server router, registers HTTP request middleware. \\\\
\\hline
\\texttt{cors} & \\^{}2.8.5 & Handles cross-origin client request credentials. \\\\
\\hline
\\texttt{dotenv} & \\^{}16.4.5 & Extracts secure keys from root configuration variables. \\\\
\\hline
\\texttt{pg} & \\^{}8.11.3 & Connects to PostgreSQL, manages query connection pooling. \\\\
\\hline
\\texttt{multer} & \\^{}1.4.5 & Processes multipart/form-data for inbound PDF uploads. \\\\
\\hline
\\texttt{bcrypt} & \\^{}5.1.1 & Hashes student passwords using salt-iterated keys. \\\\
\\hline
\\texttt{jsonwebtoken} & \\^{}9.0.2 & Generates signed JWT tokens representing user identity. \\\\
\\hline
\\texttt{google-auth-library} & \\^{}9.7.0 & Cryptographically validates Google authentication tokens. \\\\
\\hline
\\texttt{pdf-parse} & \\^{}1.1.1 & Extracts raw text segments from binary PDF buffers. \\\\
\\hline
\\texttt{openai} & \\^{}4.28.0 & Communicates with Mistral AI via OpenAI endpoint emulation. \\\\
\\hline
\\texttt{@google/generative-ai} & \\^{}0.15.0 & Native client wrapper for Gemini LLM calls. \\\\
\\hline
\\texttt{socket.io} & \\^{}4.7.4 & Initiates WebSocket routing for real-time study rooms. \\\\
\\hline
\\texttt{bottleneck} & \\^{}2.19.5 & Prevents external API failures by rate-limiting calls. \\\\
\\hline
\\texttt{@supabase/supabase-js} & \\^{}2.39.0 & Manages file uploads to Supabase cloud buckets. \\\\
\\hline
\\texttt{node-fetch} & \\^{}2.7.0 & Fetches web content for search crawlers in Node.js. \\\\
\\hline
\\end{tabular}%
}
\\end{table}

\\subsection{Frontend Production Dependencies}

Frontend dependencies are defined in the main \\texttt{package.json} file at the project root. Table~\\ref{tab:frontend_deps} outlines the library structures used in the client.

\\begin{table}[htbp]
\\centering
\\renewcommand{\\arraystretch}{1.4}
\\caption{Frontend Production Dependencies}
\\label{tab:frontend_deps}
\\resizebox{\\textwidth}{!}{%
\\begin{tabular}{|l|l|p{7.5cm}|}
\\hline
\\textbf{Package} & \\textbf{Version} & \\textbf{Purpose / Application} \\\\
\\hline
\\texttt{react} & \\^{}18.2.0 & Component-driven client state model and user interface framework. \\\\
\\hline
\\texttt{react-dom} & \\^{}18.2.0 & Renders React components to browser HTML elements. \\\\
\\hline
\\texttt{typescript} & \\^{}5.2.2 & Implements strict typing for API responses and structures. \\\\
\\hline
\\texttt{vite} & \\^{}5.0.0 & Dev compiler and packager for static assets. \\\\
\\hline
\\texttt{pdfjs-dist} & \\^{}4.0.3 & Renders PDF file buffers directly on browser canvases. \\\\
\\hline
\\texttt{lucide-react} & \\^{}0.378.0 & UI icons (shields, brains, download metrics, user ranks). \\\\
\\hline
\\texttt{tailwindcss} & \\^{}3.4.1 & Utility classes for rapid UI construction and dark mode. \\\\
\\hline
\\texttt{socket.io-client} & \\^{}4.7.4 & Connects client application to server WebSocket endpoints. \\\\
\\hline
\\end{tabular}%
}
\\end{table}

\\newpage
\\section{TECHNOLOGIES AND TOOLS USED}

The technology selections for NoteHub were chosen based on execution speed, package ecosystems, developer support, and integration compatibility.

\\subsection{Programming Languages}

\\subsubsection*{JavaScript (Node.js)}
JavaScript is the foundation of the NoteHub server. Running Node.js v20 LTS, it utilizes an asynchronous, event-driven, single-threaded execution model. This is critical for NoteHub, where a typical file upload request requires making concurrent asynchronous outbound network calls to Supabase Storage, Google Search APIs, and LLM verification endpoints. A multi-threaded platform (such as Java or C\\#) would block a thread per client request while waiting for these network responses. Node.js manages these operations concurrently using its internal event loop, maximizing throughput while minimizing CPU usage.

\\subsubsection*{TypeScript}
TypeScript is used across the frontend workspace. Writing a student platform with multiple features (like note uploading, plagiarism checks, and interactive AI chats) introduces complex nested object models. TypeScript\'s type definitions ensure that changes to the structure of the API response (such as modifications to the JSON plagiarism report schema) are automatically checked across all frontend components at compile-time. This eliminates runtime \\texttt{undefined} errors in the browser.

\\subsubsection*{Structured Query Language (SQL)}
SQL is the language used to interact with PostgreSQL. Because NoteHub relies on relationships between users, uploaded documents, chat history, and gamification ranks, relational integrity is important. Parameterized SQL queries are used to prevent SQL injection vulnerabilities. PostgreSQL-specific features, such as arrays for shingles and the custom vector operators provided by pgvector, are utilized for system operations.

\\subsection{Frontend Framework and CSS Engine}

\\subsubsection*{React.js 18}
React is the client-side framework used to build NoteHub. It structures the application into self-contained components. React\'s Virtual DOM diffing algorithm is critical during note uploads, where multiple UI states (upload status, percentage rings, current step label) are updated in real-time. By calculating DOM changes in memory and batching updates to the page, React maintains a smooth 60 FPS user interface.

\\subsubsection*{Tailwind CSS 3}
Tailwind CSS provides utility classes for styling. Rather than writing traditional CSS files, Tailwind styles are applied directly in JSX files. Tailwind\'s Just-In-Time (JIT) compiler parses the codebase at build time and compiles only the CSS classes that are actually used. This keeps production stylesheets lightweight and enables responsive dark mode styling using the \\texttt{dark:} selector.

\\subsection{Algorithmic and Database Extensions}

\\subsubsection*{pgvector}
The \\texttt{pgvector} extension is used to store text vector embeddings within PostgreSQL. In a typical relational database, searching for semantic similarity across text requires expensive full-text search indexing or running external engines (such as Elasticsearch). pgvector integrates vector storage directly into standard SQL. By using pgvector\'s cosine distance operator (\\texttt{<=>}), NoteHub can run high-dimensional vector search queries alongside standard relational filters in a single SQL statement.

\\newpage
\\section{MODULE IMPLEMENTATION}

This section describes the physical implementation of the nine core modules that make up the NoteHub system. Each module section describes the implementation logic on both the frontend and backend, and provides a representative code snippet inside a \\texttt{verbatim} block to illustrate the implementation pattern.

% ==========================================
\\subsection{Module 1: Authentication and Profile Management}

The authentication module handles user registrations, logins, and social authorization via Google OAuth 2.0. The frontend uses the Google Login button component. On a successful login, the client receives a Google token ID and submits it to the backend endpoint \\texttt{POST /api/auth/google}. 

The backend verifies the token using the official Google Auth Library. If valid, it extracts the student\'s name, email, and profile photo. If this is a new registration, a corresponding user row is created in the database. The server then generates a JWT containing the user ID, role, and department, signed with the server\'s secret key, and sends it to the client. The client stores this JWT in local storage to authorize subsequent requests.

Representative backend login token validation code is shown in Listing~\\ref{lst:auth_code}:

\\begin{verbatim}
// backend/src/routes/auth.js (Google Authentication Endpoint)
const router = require('express').Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Check if user already exists in PostgreSQL
    let userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    let user = userResult.rows[0];

    if (!user) {
      // Create user with default 100 registration points
      const insertQuery = \`
        INSERT INTO users (name, email, avatar_url, points, badges) 
        VALUES ($1, $2, $3, 100, '{}') RETURNING *
      \`;
      const insertResult = await pool.query(insertQuery, [name, email, picture]);
      user = insertResult.rows[0];
      
      // Initialize corresponding empty leaderboard row
      await pool.query('INSERT INTO leaderboard (user_id, points) VALUES ($1, 100)', [user.id]);
    }

    // Sign identity JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ success: true, token, user });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ success: false, error: 'Invalid Google credential' });
  }
});
\\end{verbatim}
\\label{lst:auth_code}

% ==========================================
\\subsection{Module 2: Note Management and Discovery}

This module manages note search, tag-filtering, cataloging, and document uploads. The frontend uses input elements that filter the note listings by subject and semester. 

When a student initiates an upload, the backend routes the file upload through \\texttt{multer} configuration middleware. The file is saved in memory, text content is extracted using \\texttt{pdf-parse}, and unique hashes are computed. The file is then uploaded to Supabase Storage. The storage service returns a public URL, which is written to the database along with the metadata, category fields, and plagiarism statistics.

Representative upload routing code is shown in Listing~\\ref{lst:upload_code}:

\\begin{verbatim}
// backend/src/routes/notes.js (Note Upload Router)
const router = require('express').Router();
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const pool = require('../db');
const upload = multer({ storage: multer.memoryStorage() });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

router.post('/upload', upload.single('noteFile'), async (req, res) => {
  const { title, subject, semester, userId } = req.body;
  const fileBuffer = req.file.buffer;
  const filename = \`\${Date.now()}_\${req.file.originalname}\`;

  try {
    // 1. Upload binary file to Supabase Bucket
    const { data, error } = await supabase.storage
      .from('student-notes')
      .upload(filename, fileBuffer, { contentType: 'application/pdf' });

    if (error) throw error;
    const publicUrl = \`\${process.env.SUPABASE_URL}/storage/v1/object/public/student-notes/\${filename}\`;

    // 2. Commit file references and metadata to database
    const insertQuery = \`
      INSERT INTO notes (title, subject, semester, file_url, uploader_id, verified) 
      VALUES ($1, $2, $3, $4, $5, false) RETURNING *
    \`;
    const noteResult = await pool.query(insertQuery, [title, subject, semester, publicUrl, userId]);
    
    res.status(201).json({ success: true, note: noteResult.rows[0] });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, message: 'Internal server upload failure' });
  }
});
\\end{verbatim}
\\label{lst:upload_code}

% ==========================================
\\subsection{Module 3: Plagiarism Detection Engine}

The plagiarism checker parses document text into overlapping k-gram arrays. Each k-gram is hashed using a rolling hash function. A sliding window selector selects the minimum hash value from each window as a fingerprint. 

The resulting set of fingerprints is compared against the database of existing note fingerprints. The similarity index is computed as the Jaccard intersection over union. If the similarity is above the 40\\% threshold, the upload is rejected.

Representative plagiarism fingerprint computation code is shown in Listing~\\ref{lst:plag_code}:

\\begin{verbatim}
// backend/src/utils/plagiarismChecker.js (Winnowing Rolling Hash)
function generateFingerprints(text, k = 5, w = 4) {
  // Normalize text to lowercase characters only
  const cleanText = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  const hashes = [];

  // Generate rolling hash for each k-gram shingle
  for (let i = 0; i <= cleanText.length - k; i++) {
    const kgram = cleanText.substring(i, i + k);
    let hash = 0;
    for (let j = 0; j < k; j++) {
      hash = (hash * 31 + kgram.charCodeAt(j)) % 1000003;
    }
    hashes.push({ hash, pos: i });
  }

  const fingerprints = new Set();
  // Select min values inside sliding windows
  for (let i = 0; i <= hashes.length - w; i++) {
    let minHash = hashes[i].hash;
    for (let j = 1; j < w; j++) {
      if (hashes[i + j].hash < minHash) {
        minHash = hashes[i + j].hash;
      }
    }
    fingerprints.add(minHash);
  }
  return Array.from(fingerprints);
}
\\end{verbatim}
\\label{lst:plag_code}

% ==========================================
\\subsection{Module 4: Web Plagiarism Engine}

If a note passes the internal plagiarism check, the system runs a web plagiarism check. The engine extracts the 5 longest, most distinct sentences from the document text. It then queries the Google Custom Search API with these sentences. 

If search results return matching web page snippets, the system compares the texts to compute web similarity. If the Google Custom Search API is rate-limited, the backend switches to a scraper that parses HTML search result pages from DuckDuckGo.

Representative web plagiarism search query code is shown in Listing~\\ref{lst:web_plag_code}:

\\begin{verbatim}
// backend/src/utils/webPlagiarismChecker.js (Google Search Queries)
const fetch = require('node-fetch');

async function queryWebSources(sentences) {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const cxId = process.env.GOOGLE_SEARCH_CX;
  let matches = [];

  for (const sentence of sentences) {
    const query = encodeURIComponent(\`"\${sentence}"\`);
    const searchUrl = \`https://www.googleapis.com/customsearch/v1?key=\${apiKey}&cx=\${cxId}&q=\${query}\`;

    try {
      const response = await fetch(searchUrl);
      const json = await response.json();
      if (json.items && json.items.length > 0) {
        json.items.forEach(item => {
          matches.push({
            title: item.title,
            link: item.link,
            snippet: item.snippet
          });
        });
      }
    } catch (error) {
      console.warn('Google search limit exceeded. Switching to backup web scraper.');
      return await fallbackScrape(sentences);
    }
  }
  return matches;
}
\\end{verbatim}
\\label{lst:web_plag_code}

% ==========================================
\\subsection{Module 5: AI Quality Verification}

To filter out low-quality files, spam, or off-topic documents, all uploaded notes pass through an AI quality review step. The text is sent to the LLM (Mistral or Gemini) with a structured prompt. 

The prompt instructs the model to evaluate the text for academic depth, relevance to the subject, formatting quality, and correctness. The model is instructed to return a structured JSON response containing a score from 0 to 100, an evaluation status, and a list of key concepts found in the text.

Representative prompt orchestration and response parsing code is shown in Listing~\\ref{lst:ai_verify_code}:

\\begin{verbatim}
// backend/src/utils/aiVerifier.js (LLM Prompt Verification)
const { GoogleGenAI } = require('@google/generative-ai');
const aiPool = new GoogleGenAI(process.env.GOOGLE_API_KEY);

async function verifyNoteQuality(noteText, subject) {
  const model = aiPool.getGenerativeModel({ model: 'gemini-pro' });
  const prompt = \`
    You are an academic quality verifier. Review the following text for the subject: \"\${subject}\".
    Assess:
    1. Relevance to the subject.
    2. Quality, clarity, and detail.
    Return ONLY a JSON object containing:
    {
      \"score\": number (0-100),
      \"passed\": boolean,
      \"reasons\": [\"reason1\", \"reason2\"],
      \"concepts\": [\"concept1\", \"concept2\"]
    }
    Text: \${noteText.substring(0, 4000)}
  \`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Extract JSON payload from markup block
  const jsonMatch = text.match(/\\{([\\s\\S]*)\\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  throw new Error('LLM did not return parseable JSON');
}
\\end{verbatim}
\\label{lst:ai_verify_code}

% ==========================================
\\subsection{Module 6: AI Career Advisor (RAG Pipeline)}

This module provides career guidance. When a student asks a career question, the query is vectorized and searched against the \\texttt{note\_embeddings} table in PostgreSQL. 

The system retrieves the top 5 most similar note text chunks using the cosine distance operator (\\texttt{<=>}). These text chunks are injected into the LLM system prompt as context, grounding the AI\'s career recommendations in the student\'s actual course materials.

Representative pgvector query execution and prompt composition code is shown in Listing~\\ref{lst:rag_code}:

\\begin{verbatim}
// backend/src/utils/rag.js (Vector Retrieval Query and LLM Prompting)
const { OpenAI } = require('openai');
const pool = require('../db');
const openai = new OpenAI({ apiKey: process.env.MISTRAL_API_KEY });

async function queryCareerAdvisor(studentQuery, userId) {
  // 1. Vectorize the student query
  const embedResponse = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: studentQuery
  });
  const queryVector = JSON.stringify(embedResponse.data[0].embedding);

  // 2. Query Postgres for similar chunks from this user's notes
  const searchQuery = \`
    SELECT ne.content, (ne.embedding <=> $1::vector) AS distance 
    FROM note_embeddings ne
    JOIN notes n ON ne.note_id = n.id
    WHERE n.uploader_id = $2
    ORDER BY distance ASC LIMIT 5
  \`;
  const dbResult = await pool.query(searchQuery, [queryVector, userId]);
  const contextText = dbResult.rows.map(row => row.content).join('\\n\\n');

  // 3. Prompt engineering with injected context
  const messages = [
    { role: 'system', content: 'You are an engineering career advisor. Ground your advice in these course materials.' },
    { role: 'system', content: \`Course Context:\\n\${contextText}\` },
    { role: 'user', content: studentQuery }
  ];

  const completion = await openai.chat.completions.create({
    model: 'mistral-large-latest',
    messages
  });
  return completion.choices[0].message.content;
}
\\end{verbatim}
\\label{lst:rag_code}

% ==========================================
\\subsection{Module 7: Real-Time Collaborative Chat}

The real-time collaboration module enables students to join subject-specific study groups. Real-time events are managed by a Socket.io server. When a client establishes a connection, it receives the room name corresponding to its group. 

Incoming messages are verified, saved to the PostgreSQL \\texttt{messages} table for history retention, and broadcast to all clients currently connected to the same room.

Representative Socket.io server connection handling code is shown in Listing~\\ref{lst:socket_code}:

\\begin{verbatim}
// backend/src/server.js (Socket.io Connection Manager)
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] }
});
const pool = require('./db');

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join_room', (roomName) => {
    socket.join(roomName);
    console.log(\`Socket \${socket.id} joined room \${roomName}\`);
  });

  socket.on('send_message', async (data) => {
    const { room, senderId, content } = data;
    try {
      // 1. Persist message to database
      const insertQuery = \`
        INSERT INTO messages (group_name, sender_id, content) 
        VALUES ($1, $2, $3) RETURNING *
      \`;
      const res = await pool.query(insertQuery, [room, senderId, content]);
      const savedMsg = res.rows[0];

      // 2. Broadcast message to all room members
      io.to(room).emit('receive_message', savedMsg);
    } catch (error) {
      console.error('WebSocket save failure:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});
\\end{verbatim}
\\label{lst:socket_code}

% ==========================================
\\subsection{Module 8: Gamification and Leaderboard}

To incentivize quality contributions, NoteHub features a gamification system. Students earn points for verified uploads, high note ratings, and downloads by peers. 

The leaderboard ranks contributors. To compute these ranks efficiently, the backend runs a SQL query using the \\texttt{RANK()} window function. This calculates ranks on the database server, avoiding the overhead of sorting records in Node.js.

Representative SQL-based leaderboard query code is shown in Listing~\\ref{lst:leaderboard_code}:

\\begin{verbatim}
// backend/src/routes/leaderboard.js (Leaderboard Ranking Query)
const router = require('express').Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    // Calculate student ranks using SQL Window functions
    const rankQuery = \`
      SELECT 
        u.id, 
        u.name, 
        u.avatar_url, 
        l.points,
        RANK() OVER (ORDER BY l.points DESC) as rank
      FROM leaderboard l
      JOIN users u ON l.user_id = u.id
      ORDER BY l.points DESC LIMIT 50
    \`;
    const result = await pool.query(rankQuery);
    res.status(200).json({ success: true, leaderboard: result.rows });
  } catch (error) {
    console.error('Leaderboard load error:', error);
    res.status(500).json({ success: false, message: 'Could not fetch leaderboard' });
  }
});
\\end{verbatim}
\\label{lst:leaderboard_code}

% ==========================================
\\subsection{Module 9: Note Preview and Rating System}

The preview module enables students to read notes in-browser. The frontend uses \\texttt{pdfjs-dist} to load the document\'s cloud URL and render pages onto an HTML5 canvas element. 

Students can submit ratings (1 to 5 stars). When a rating is submitted, the backend records the vote in the ratings table, recalculates the note\'s average rating, and updates the uploader\'s gamification points.

Representative React canvas rendering code is shown in Listing~\\ref{lst:preview_code}:

\\begin{verbatim}
// src/components/NotePreviewModal.tsx (PDF.js Browser Canvas Rendering)
import React, { useEffect, useRef } from 'react';
import * as pdfjs from 'pdfjs-dist';

// Point PDF.js to standard worker asset
pdfjs.GlobalWorkerOptions.workerSrc = \`//cdnjs.cloudflare.com/ajax/libs/pdf.js/\${pdfjs.version}/pdf.worker.min.js\`;

export const NotePreview: React.FC<{ fileUrl: string }> = ({ fileUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderPdf = async () => {
      const loadingTask = pdfjs.getDocument(fileUrl);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1); // Render first page preview

      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          const renderContext = { canvasContext: context, viewport };
          await page.render(renderContext).promise;
          console.log('PDF Page 1 rendered successfully on canvas.');
        }
      }
    };
    renderPdf().catch(console.error);
  }, [fileUrl]);

  return <canvas ref={canvasRef} className="border border-stone-200 rounded-xl" />;
};
\\end{verbatim}
\\label{lst:preview_code}

\\newpage
\\section{DATABASE DESIGN AND IMPLEMENTATION}

NoteHub utilizes a PostgreSQL relational database. This section presents the complete DDL schema statements, common operational queries, and sample database tables.

\\subsection{Database Table DDL Schemas}

The SQL schema configuration is structured as follows. Foreign key constraints enforce relational rules, and vector tables use pgvector\'s \\texttt{VECTOR} type:

\\begin{verbatim}
-- init.sql: Schema Definition

-- Enable high-dimensional vector search extension
CREATE EXTENSION IF NOT EXISTS vector;

-- User Accounts and Academic Settings
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  avatar_url VARCHAR(255),
  role VARCHAR(20) DEFAULT 'student',
  points INTEGER DEFAULT 100,
  badges VARCHAR(50)[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Note Metadata
CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  subject VARCHAR(50) NOT NULL,
  semester VARCHAR(10) NOT NULL,
  file_url VARCHAR(255) NOT NULL,
  uploader_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  verified BOOLEAN DEFAULT false,
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Plagiarism Fingerprint Collections
CREATE TABLE note_shingles (
  note_id INTEGER PRIMARY KEY REFERENCES notes(id) ON DELETE CASCADE,
  winnow_fingerprints INTEGER[] NOT NULL,
  sentence_hashes VARCHAR(64)[] NOT NULL
);

-- Vector Embeddings for Semantic RAG Search
CREATE TABLE note_embeddings (
  id SERIAL PRIMARY KEY,
  note_id INTEGER REFERENCES notes(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(1536) NOT NULL
);

-- Active Leaderboard Standings
CREATE TABLE leaderboard (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL DEFAULT 100
);

-- Group Message Logs
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  group_name VARCHAR(50) NOT NULL,
  sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE INDEXES FOR OPTIMAL SEARCH SPEED

-- B-Tree index for looking up notes by semester/subject
CREATE INDEX idx_notes_filter ON notes(semester, subject);

-- B-Tree index for fetching group messages
CREATE INDEX idx_msg_group ON messages(group_name);

-- IVFFlat index on embedding vector for pgvector cosine distance search
CREATE INDEX idx_embeddings_cosine 
ON note_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
\\end{verbatim}

\\subsection{Common Database Queries}

The following queries illustrate how NoteHub handles common database operations:

\\paragraph{1. Internal Plagiarism Fingerprint Matching}
This query checks if the shingles of a newly uploaded note match any shingles already in the database.
\\begin{verbatim}
SELECT note_id, CARDINALITY(ARRAY(
  SELECT UNNEST(winnow_fingerprints) 
  INTERSECT 
  SELECT UNNEST($1::integer[])
)) AS matched_shingles_count 
FROM note_shingles;
\\end{verbatim}

\\paragraph{2. Semantic RAG Search (Cosine Distance)}
This query retrieves the most semantically similar note text chunks for a given query vector.
\\begin{verbatim}
SELECT content, (embedding <=> $1::vector) AS cosine_distance 
FROM note_embeddings
ORDER BY cosine_distance ASC LIMIT 5;
\\end{verbatim}

\\subsection{Sample Database Tables}

This section provides sample rows for key database tables:

\\paragraph{Table: users}
\\begin{table}[H]
\\centering
\\begin{tabular}{|l|l|l|l|l|l|}
\\hline
\\textbf{id} & \\textbf{name} & \\textbf{email} & \\textbf{role} & \\textbf{points} & \\textbf{badges} \\\\
\\hline
1 & Raj Jadhav & raj@samarth.edu & student & 420 & \\{uploader, scholar\\} \\\\
2 & Omkar Pokharkar & omkar@samarth.edu & student & 280 & \\{uploader\\} \\\\
3 & Prof. Thitme & thitme@samarth.edu & admin & 999 & \\{verifier, educator\\} \\\\
\\hline
\\end{tabular}
\\end{table}

\\paragraph{Table: notes}
\\begin{table}[H]
\\centering
\\begin{tabular}{|l|l|l|l|l|l|}
\\hline
\\textbf{id} & \\textbf{title} & \\textbf{subject} & \\textbf{semester} & \\textbf{uploader\\_id} & \\textbf{verified} \\\\
\\hline
101 & Data Structures Unit 1 & Computer & Sem 3 & 1 & true \\\\
102 & Database Normalization & IT & Sem 4 & 2 & true \\\\
103 & Neural Networks Overview & AI & Sem 7 & 1 & false \\\\
\\hline
\\end{tabular}
\\end{table}

\\paragraph{Table: note\\_embeddings (pgvector)}
\\begin{table}[H]
\\centering
\\begin{tabular}{|l|l|l|p{4.5cm}|l|}
\\hline
\\textbf{id} & \\textbf{note\\_id} & \\textbf{chunk} & \\textbf{content} & \\textbf{embedding (vector)} \\\\
\\hline
1 & 101 & 0 & \"Linked list node pointer definitions...\" & [0.012, -0.045, \\ldots, 0.089] \\\\
2 & 101 & 1 & \"Binary tree insertions occur...\" & [0.034, 0.011, \\ldots, -0.076] \\\\
3 & 102 & 0 & \"Third normal form relations require...\" & [-0.054, -0.098, \\ldots, 0.021] \\\\
\\hline
\\end{tabular}
\\end{table}

\\newpage
\\section{USER INTERFACE DESIGN AND IMPLEMENTATION}

The user interface was built to prioritize clean layout design, visual feedback, and responsive navigation. This section describes the interface layouts and user interaction flows.

\\subsection{Interface Layout and Visual Mockups}

The frontend layout uses a three-panel layout on desktop screens and shifts to a single-column layout on mobile devices.

\\paragraph{1. Student Dashboard Screen}
The Dashboard presents active study stats, trending notes, and a global search input.
\\begin{verbatim}
+-------------------------------------------------------------------------+
| [NH] NoteHub     Search Notes... [ Q ]             (Profile) [Theme Toggle]|
+-------------------------------------------------------------------------+
|  STUDENT STATISTICS    |  TRENDING STUDY NOTES                          |
|  * Verified Uploads: 8 |  +--------------------+  +--------------------+|
|  * Reward Points:  420 |  | Data Structures    |  | Web Engineering    ||
|  * Rank standing:  #12 |  | Sub: Computer Sem:3|  | Sub: IT    Sem: 5  ||
|                        |  | Stars: *****       |  | Stars: ****        ||
|  STUDY GROUPS PANEL    |  | [Preview] [Download|  | [Preview] [Download||
|  * [Join Computer Gp]  |  +--------------------+  +--------------------+|
|  * [Join IT Group]     |  * Leaderboard Standing                        |
|  * [Join Mech Group]   |  1. Raj Jadhav (420 pts) 2. Omkar P. (280 pts) |
+-------------------------------------------------------------------------+
\\end{verbatim}

\\paragraph{2. Plagiarism Scan Upload Modal}
The Upload Modal uses an animated timeline that indicates progress as the backend processes the file.
\\begin{verbatim}
+-------------------------------------------------------------------------+
|  UPLOAD STUDY NOTES                                                 [X] |
+-------------------------------------------------------------------------+
|  File: DS_LectureNotes.pdf  [ Size: 1.4 MB ]                            |
|                                                                         |
|  Scanning Status Timeline:                                              |
|  [ cmark ] 1. Uploading Document Buffer (100%)                          |
|  [ cmark ] 2. Extracting Textual Strings                                |
|  [ / ]     3. Internal Plagiarism Check: Processing winnow shingles...   |
|  [   ]     4. External Web Plagiarism Engine: Querying sentences...     |
|  [   ]     5. AI Verification Verdict: Evaluating content relevance...  |
|                                                                         |
|  +-------------------------- Similarity Score ------------------------+  |
|  |           (( 12% ))  <- Plagiarism Match (Safe Threshold < 40%)    |  |
|  +--------------------------------------------------------------------+  |
+-------------------------------------------------------------------------+
\\end{verbatim}

\\paragraph{3. Career AI Advisor Interface}
The Career AI module uses a chat layout styled like a messaging app, featuring pre-configured prompts for common queries.
\\begin{verbatim}
+-------------------------------------------------------------------------+
| [NH] NoteHub      Career Advisor Chat Client         (Back to Home) [X] |
+-------------------------------------------------------------------------+
| (AI Advisor) Welcome to the Career Advisor! Based on your Computer      |
|              notes, would you like to review roadmap suggestions        |
|              for Software Engineering or Database Administration?       |
|                                                                         |
| (Student)    Show me the software engineering roadmap suggestions.      |
|                                                                         |
| (AI Advisor) Looking at your 'Data Structures' and 'Database' notes,   |
|              you should focus on:                                       |
|              1. Graph traversal algorithms.                             |
|              2. SQL query optimization.                                 |
|                                                                         |
| (Prompt Buttons): [Show DB Roadmap] [Find Jobs] [Explain Graph Query]   |
+-------------------------------------------------------------------------+
| [ Type your career question here...                     ] [ Send Msg ]  |
+-------------------------------------------------------------------------+
\\end{verbatim}

\\subsection{UI States and Interaction Flow}

The frontend components maintain UI states to handle asynchronous API updates. The Note Upload Modal handles states:
\\begin{verbatim}
IDLE -> UPLOADING -> SCANNING_INTERNAL -> SCANNING_WEB -> AI_VERIFY -> DONE
\\end{verbatim}
When a user drops a file, the modal transitions from \\texttt{IDLE} to \\texttt{UPLOADING}, displaying an upload progress bar. 

When the upload completes, the state transitions to \\texttt{SCANNING\_INTERNAL}, sending a request to the backend. The backend returns the plagiarism match score. If the score is below the 40\\% threshold, the client enters the \\texttt{SCANNING\_WEB} state, fetching search results. 

If this step passes, the state transitions to \\texttt{AI\_VERIFY}, sending a request to the AI evaluator. Once verified, the state transitions to \\texttt{DONE}. If any step fails or matches are too high, the interface redirects the user to a rejection screen.

\\newpage
\\section{ALGORITHM IMPLEMENTATION}

NoteHub relies on two core algorithms: Winnowing for internal plagiarism checks, and RAG for the Career Advisor.

\\subsection{Winnowing Plagiarism Checker Algorithm}

The Winnowing plagiarism algorithm converts text into numerical fingerprint hashes that are robust against formatting changes, spacing differences, or synonyms.

\\subsubsection*{1. Preprocessing and Shingle Generation}
The document text is normalized to lowercase and stripped of whitespace and punctuation. This normalized text is parsed into contiguous overlapping strings of size $k$ (k-grams). For example, with $k=5$, the text \\texttt{\"database\"} generates k-grams:
\\begin{verbatim}
\"datab\", \"ataba\", \"tabas\", \"abase\"
\\end{verbatim}

\\subsubsection*{2. Rolling Hash Computation}
Each k-gram is hashed using a rolling hash function to generate a 32-bit integer. The Rabin-Karp rolling hash represents a k-gram $c_0 c_1 \\dots c_{k-1}$ as:
\\begin{equation}
H(c_0 c_1 \\dots c_{k-1}) = \\left( c_0 \\cdot p^{k-1} + c_1 \\cdot p^{k-2} + \\dots + c_{k-1} \\cdot p^0 \\right) \\pmod m
\\end{equation}
where $p$ is a prime base (commonly $p=31$) and $m$ is the hash range modulo ($m=1000003$).

\\subsubsection*{3. Sliding Window Fingerprint Selection}
A sliding window of size $w$ is passed over the sequence of hashes. The minimum hash value within each window is selected. The position of the minimum hash value is recorded to resolve ties, ensuring consistent fingerprint selection across matching documents. The selected hashes make up the document\'s unique fingerprint set.

\\subsubsection*{4. Jaccard Similarity Calculation}
The similarity between two fingerprint sets $A$ and $B$ is computed as the Jaccard coefficient:
\\begin{equation}
J(A, B) = \\frac{|A \\cap B|}{|A \\cup B|} = \\frac{\\text{Number of matching fingerprints}}{\\text{Total unique fingerprints in both sets}}
\\end{equation}

Listing~\\ref{algo:winnowing} shows the structured pseudo-code for the Winnowing algorithm.

\\begin{verbatim}
Algorithm: Winnowing Document Fingerprinting
Input: documentText, shingleSize k, windowSize w
Output: array of fingerprint hashes

1.  cleanText <- RemoveWhitespaceAndPunctuation(Lowercase(documentText))
2.  kGrams <- Array of overlapping substrings of size k from cleanText
3.  hashes <- Array of integers of size (Length(kGrams))
4.  For i = 0 To Length(kGrams) - 1:
5.      hashes[i] <- ComputeRabinKarpHash(kGrams[i])
6.  EndFor
7.  
8.  fingerprints <- Empty Set
9.  For i = 0 To Length(hashes) - w:
10.     minHash <- hashes[i]
11.     For j = 1 To w - 1:
12.         If hashes[i + j] < minHash Then
13.             minHash <- hashes[i + j]
14.         EndIf
15.     EndFor
16.     fingerprints.Add(minHash)
17. EndFor
18. Return Array(fingerprints)
\\end{verbatim}
\\label{algo:winnowing}

\\subsection{Retrieval-Augmented Generation (RAG) Pipeline Algorithm}

The RAG pipeline retrieves relevant academic context from the database to answer student career queries.

\\subsubsection*{1. Document Chunking}
When a note is verified, its text is split into overlapping chunks of 1000 characters, with an overlap of 200 characters to prevent splitting sentences.

\\subsubsection*{2. Vector Embedding Generation}
Each chunk is sent to the Mistral AI embedding API to generate a 1536-dimensional float vector:
\\begin{equation}
\\vec{v} = [x_1, x_2, \\dots, x_{1536}], \\quad x_i \\in \\mathbb{R}
\\end{equation}

\\subsubsection*{3. Vector Database Insertion}
The chunks and their embedding vectors are stored in the \\texttt{note\_embeddings} table.

\\subsubsection*{4. Query Vectorization and Cosine Distance Matching}
When a student query is received, the query is vectorized to generate $\\vec{q}$. The database retrieves the top 5 chunks with the smallest cosine distance to the query vector. The cosine distance is defined as:
\\begin{equation}
d_{\\text{cosine}}(\\vec{q}, \\vec{v}) = 1 - \\frac{\\vec{q} \\cdot \\vec{v}}{\\|\\vec{q}\\| \\|\\vec{v}\\|} = 1 - \\frac{\\sum_{i=1}^{1536} q_i v_i}{\\sqrt{\\sum_{i=1}^{1536} q_i^2} \\sqrt{\\sum_{i=1}^{1536} v_i^2}}
\\end{equation}

\\subsubsection*{5. Prompt Composition and LLM Completion}
The retrieved chunks are added to the system prompt. The LLM receives this prompt and generates an answer, referencing the course context.

Listing~\\ref{algo:rag} shows the structured pseudo-code for the RAG advisor query process.

\\begin{verbatim}
Algorithm: RAG Query Processing
Input: studentQuery, userId
Output: textResponse

1.  queryVector <- GenerateEmbeddingVector(studentQuery, model="text-embedding-3-small")
2.  
3.  // Query pgvector database using cosine distance operator <=>
4.  matchingChunks <- ExecuteSQL("
5.      SELECT content 
6.      FROM note_embeddings ne
7.      JOIN notes n ON ne.note_id = n.id
8.      WHERE n.uploader_id = userId
9.      ORDER BY ne.embedding <=> queryVector
10.     LIMIT 5
11. ")
12. 
13. contextString <- ConcatenateWithNewlines(matchingChunks)
14. 
15. systemInstructions <- "You are a career advisor. Answer using the provided context."
16. finalPrompt <- Concatenate(systemInstructions, "\nContext:\n", contextString, "\nQuery:\n", studentQuery)
17. 
18. textResponse <- CallLLM(model="mistral-large-latest", prompt=finalPrompt)
19. Return textResponse
\\end{verbatim}
\\label{algo:rag}

\\newpage
`;

const updatedContent = content.substring(0, startIndex) + newChapter6 + content.substring(endIndex);
fs.writeFileSync(filePath, updatedContent, 'utf8');
console.log('Successfully replaced Chapter 6!');
console.log(`Original line count of Chapter 6: ${content.substring(startIndex, endIndex).split('\n').length}`);
console.log(`New line count of Chapter 6: ${newChapter6.split('\n').length}`);
