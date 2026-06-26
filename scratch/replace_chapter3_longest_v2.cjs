const fs = require('fs');
const path = require('path');

const filePath = 'd:\\Notehub1\\Notehub\\Notehub Report\\Project Stage II Report.tex';

try {
  let content = fs.readFileSync(filePath, 'utf8');

  const startMarker = '\\chapter{SYSTEM ANALYSIS AND SPECIFICATIONS}';
  const endMarker = '\\chapter{SYSTEM PLANNING}';

  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker);

  if (startIndex === -1) {
    console.error('Could not find start marker: \\chapter{SYSTEM ANALYSIS AND SPECIFICATIONS}');
    process.exit(1);
  }
  if (endIndex === -1) {
    console.error('Could not find end marker: \\chapter{SYSTEM PLANNING}');
    process.exit(1);
  }

  const before = content.substring(0, startIndex);
  const after = content.substring(endIndex);

  const newChapter3 = `\\chapter{SYSTEM ANALYSIS AND SPECIFICATIONS}
\\rule{\\textwidth}{1pt}

\\section{INTRODUCTION}
System analysis is a systematic process of breaking down a software system into its core components to understand its requirements, define its specifications, and ensure that the final architecture solves the user's problem. For NoteHub, this analysis is critical due to the hybrid nature of the platform. Unlike traditional file-hosting systems, NoteHub combines a React.js web application and a React Native mobile application under a shared Node.js/Express.js backend and a PostgreSQL database. It processes documents in real-time, calculates lexical and semantic similarity, coordinates real-time user study rooms, and executes Retrieval-Augmented Generation (RAG) queries to provide career advising. 

Modeling and specifying these components before writing code is essential to prevent several architectural bottlenecks:
\\begin{itemize}
    \\item \\textbf{Concurrency Issues:} Real-time study chats and help boards can generate thousands of concurrent WebSocket connections. System analysis helps size connection pools and establish event-driven socket namespaces.
    \\item \\textbf{API and Compute Latency:} Text extraction from PDFs, SimHash calculations, Winnowing fingerprint matching, and Google Gemini AI calls require significant processing time. System analysis models these steps to separate fast synchronous requests from slow asynchronous verification queues.
    \\item \\textbf{Database Performance:} Storing and searching high-dimensional vector embeddings for career guidance can cause database slowdowns. Modeling vector indexes ensures the system maintains sub-second query responses.
\\end{itemize}

By conducting a thorough system analysis, the development team identified functional and non-functional specifications, established hardware and software baselines, and defined mathematical system boundaries. This ensures that NoteHub remains secure, scalable, and responsive under high user loads.

\\subsection{System Modeling and Analysis Philosophy}
In modern software engineering, system analysis serves as the blueprint that bridges requirements gathering with physical design. Without a rigorous analysis phase, projects integrating heterogeneous components (such as cross-platform clients, real-time message brokers, and large language models) often suffer from scope creep, architectural misalignment, and data consistency issues. 

For NoteHub, the system analysis process employed both structural and object-oriented paradigms:
\\begin{itemize}
    \\item \\textbf{Structural Decomposition:} Defining the flow of data through the ingestion and verification pipelines, establishing clear processes for document parsing, hashing, web search scraping, and AI analysis.
    \\item \\textbf{Object-Oriented Specification:} Defining system components as discrete services (Authentication Service, Document Service, Collaboration Service, AI Service) with well-defined APIs and schemas.
    \\item \\textbf{State-Transition Modeling:} Mapping the lifecycle of a document from its initial raw upload state, through pending verification, lexical and semantic checks, and final publication or rejection.
\\end{itemize}
This dual approach guarantees that the system is structurally sound to handle heavy file operations and object-oriented enough to allow modular feature additions like SnapSolve and Assessment AI.

\\section{PROBLEM STATEMENT}
In technical terms, the core problem is defined as: \\textit{designing, building, and deploying a secure, real-time, cross-platform academic knowledge network that automates note validation, curriculum-aligned indexing, semantic information retrieval, and peer collaboration, without relying on centralized manual curation.}

The technical problems and gaps in current academic resource management methods include:
\\begin{enumerate}
    \\item \\textbf{Vulnerability to Academic Plagiarism and Low-Quality Uploads:} Existing public repositories do not verify uploaded documents in real-time. This allows users to upload plagiarized, low-resolution, or irrelevant files. This compromises the academic credibility of the repository and discourages genuine contributors from sharing their work.
    \\item \\textbf{Lack of Structured, Curriculum-Aware Indexing:} Cloud storage platforms (e.g., Google Drive) use flat folder structures that rely entirely on the uploader's labeling. This results in inconsistent metadata. Engineering notes must be indexed hierarchically (Course $\\rightarrow$ Branch $\\rightarrow$ Year $\\rightarrow$ Semester $\\rightarrow$ Subject) to be discoverable.
    \\item \\textbf{Incoherent Multi-Platform Collaborations:} Most collaboration tools are designed for web browsers or mobile screens, but not both. Synchronizing state, document editing, and room management in real-time across React.js web clients and React Native mobile clients presents complex socket routing challenges.
    \\item \\textbf{Fragmented Study and Career Contexts:} Students must switch between different platforms to read notes, solve previous questions, search for explanations, and seek career roadmaps. There is no integrated system that uses the student's study content to recommend tailored career paths and mock assessments.
    \\item \\textbf{The \"Free-Rider\" Problem in Peer Communities:} Without a reputation system, a small group of users upload notes while the majority only consume, leading to platform stagnation.
\\end{enumerate}

To address this problem, NoteHub must operate within several mathematical and system design constraints:
\\begin{enumerate}
    \\item \\textbf{Processing Latency Boundary:} The total execution time $T_{total}$ for processing a document upload must remain below a user tolerance threshold of 60 seconds. This is defined as:
    \\begin{equation}
    T_{total} = T_{upload} + T_{extraction} + T_{winnowing} + T_{simhash} + T_{web\\_crawl} + T_{gemini\\_verify} < 60\\text{ seconds}
    \\end{equation}
    where $T_{upload}$ is the network file transit time, $T_{extraction}$ is the PDF text parsing latency, $T_{winnowing}$ is the local database fingerprint comparison time, $T_{simhash}$ is the near-duplicate Hamming distance calculation time, $T_{web\\_crawl}$ is the Google Search API lookup time, and $T_{gemini\\_verify}$ is the Gemini content audit time.
    
    \\item \\textbf{Storage Capacity Boundary:} Let $N_m$ be the daily volume of note uploads, each of average size $S_m$. The storage usage $C(t)$ at day $t$ must satisfy the cost and server capacity limit $C_{limit}$:
    \\begin{equation}
    C(t) = \\sum_{i=1}^{t} (N_m(i) \\times S_m) < C_{limit}
    \\end{equation}
    To respect this limit, the system must offload document binaries to external object stores (Cloudinary and Supabase Storage) and store only metadata and text indexes in PostgreSQL.
    
    \\item \\textbf{Cosine Similarity Search Boundary:} The RAG career advisor must query the vector database and retrieve matching chunks in sub-second time. The database must compute the cosine similarity between the query embedding $\\mathbf{q}$ and document embeddings $\\mathbf{d}$ in a high-dimensional vector space ($N = 1536$ dimensions):
    \\begin{equation}
    \\text{Similarity}(\\mathbf{q}, \\mathbf{d}) = \\frac{\\mathbf{q} \\cdot \\mathbf{d}}{\\|\\mathbf{q}\\| \\|\\mathbf{d}\\|} = \\frac{\\sum_{j=1}^{1536} q_j d_j}{\\sqrt{\\sum_{j=1}^{1536} q_j^2} \\sqrt{\\sum_{j=1}^{1536} d_j^2}} \\ge \\alpha
    \\end{equation}
    where $\\alpha$ is the relevance threshold (set to $0.75$).
    
    \\item \\textbf{API Rate Limiting Bounds:} To protect the Google Gemini API and search endpoints from abuse, the system must enforce strict rate-limiting boundaries. The rate limit $R_u$ for a user ID $u$ over a window $W$ is defined as:
    \\begin{equation}
    R_u(W) = \\begin{cases}
    \\le 100\\text{ requests/min} & \\text{for general API routes} \\\\
    \\le 10\\text{ requests/min} & \\text{for authentication routes} \\\\
    \\le 5\\text{ requests/min} & \\text{for Gemini AI routes}
    \\end{cases}
    \\end{equation}
    
    \\item \\textbf{Storage Growth and Cost Optimization Models:} Over time, the volume of uploaded notes increases. Let the number of active student users be $U(t)$ at semester $t$, with an average note upload frequency $f$ notes/student/semester. The cumulative database row size $D(t)$ for relational metadata (excluding binary documents) is modeled by:
    \\begin{equation}
    D(t) = \\int_{0}^{t} U(\\tau) \\cdot f \\cdot S_{meta} \\, d\\tau + D_0
    \\end{equation}
    where $S_{meta}$ is the average database row size (1.5 KB including JSONB metadata reports) and $D_0$ is the initial database size. To guarantee that database operations remain within free tier limits, $D(t)$ must remain below 1 GB.
    
    \\item \\textbf{API Rate Limiting and Token Bucket Algorithm Constraints:} To model rate limiting for AI features, we utilize the Token Bucket mathematical abstraction. The bucket capacity is $B$ tokens (representing requests), refilled at a continuous rate of $r$ tokens/second. The number of available tokens $T_k(t)$ at time $t$ for a client $k$ is given by:
    \\begin{equation}
    T_k(t) = \\min(B, T_k(t_0) + r(t - t_0) - C_{consumed})
    \\end{equation}
    where $C_{consumed}$ is the integer number of requests consumed in the interval. If a request arrives when $T_k(t) < 1$, the request is immediately rejected with HTTP status code 429 (Too Many Requests), ensuring API key preservation.
\\end{enumerate}

\\section{SYSTEM OVERVIEW}
NoteHub is a multi-tier, cross-platform academic knowledge network structured around a central API. The web application (built with React.js, Vite, and TypeScript) and the mobile client (built with React Native and Expo) communicate with a Node.js/Express.js backend and a PostgreSQL database.

\\subsection{Three-Tier Architecture Model}
The system layout is structured around three independent tiers:
\\begin{enumerate}
    \\item \\textbf{Presentation Tier (Client Layer):} Comprises the React.js web client and the React Native/Expo mobile app. The web dashboard provides administrative controls, whitelisted views, and desktop-friendly note reading interfaces. The mobile client provides localized storage, real-time Socket notifications, camera image capture for SnapSolve, and lightweight note reading capabilities.
    \\item \\textbf{Logic Tier (Application Layer):} A Node.js and Express.js REST and WebSocket API. The backend processes requests, authorizes tokens, compiles PDF files into text, runs similarity math routines, and acts as the gatekeeper connecting clients to the PostgreSQL database, Socket namespaces, and third-party AI APIs (Google Gemini and Mistral).
    \\item \\textbf{Data Tier (Storage Layer):} Consists of three parts:
    \\begin{itemize}
        \\item \\textbf{PostgreSQL Database:} Stores all relational tables (users, notes metadata, points, badges, chat logs, study rooms). The \\texttt{pgvector} extension handles high-dimensional vector embeddings of notes.
        \\item \\textbf{Cloudinary:} Serves as the primary object store for PDF files and uploaded images.
        \\item \\textbf{Supabase Storage:} Acts as a secondary object store fallback when Cloudinary returns connection errors or capacity limits are reached.
    \\end{itemize}
\\end{enumerate}

\\subsection{Core Client-Server Lifecycles}
The interactions within NoteHub are governed by three core lifecycle pathways:
\\begin{itemize}
    \\item \\textbf{User Authentication Lifecycle:}
    The user logs in via Google Sign-In. The client app retrieves the Google identity token and transmits it to the backend route \\texttt{/api/auth/google}. The backend validates the token signatures via Google public keys, extracts user details (email, name, picture), queries the database to match records, generates a signed JWT token, and returns the token to the client. Subsequent requests include this token in the Authorization header.
    
    \\item \\textbf{Document Upload and Asynchronous Verification Lifecycle:}
    When a student uploads a note, the file is parsed by \\texttt{multer} and temporarily stored. The server extracts raw text and attempts file storage upload to Cloudinary. In case of timeouts, it falls back to Supabase. The note status is saved as \"pending\" in PostgreSQL, and the server returns HTTP 202 to the client. A background event runner initiates lexical checks (Winnowing), semantic checks (SimHash), web crawled crawling, and Gemini content checks. If the document passes all thresholds, the database updates the status to \"verified\", increments the user's score, and broadcasts a socket update to the client.
    
    \\item \\textbf{Real-Time Collaboration Lifecycle:}
    Upon entering a study room, the client establishes a Socket.io link. The server validates the user's JWT token, authorizes namespace access, joins the client to the socket channel matching the room ID, and retrieves past message logs. When a user transmits a message, the socket controller applies a profanity filter via \\texttt{leo-profanity} and broadcasts the sanitized message payload to all active clients joined to the room channel.
\\end{itemize}

\\begin{figure}[H]
    \\centering
    \\includegraphics[width=0.9\\linewidth]{notehub_system_architecture.png}
    \\caption{NoteHub High-Level System Architecture}
    \\label{fig:system_arch_ch3}
\\end{figure}

The system architecture diagram (Figure~\\ref{fig:system_arch_ch3}) outlines how the web and mobile clients connect to the Express server, which acts as the hub coordinating the PostgreSQL database, Socket.io, Gemini/Mistral APIs, and storage endpoints.

\\section{FUNCTIONAL REQUIREMENTS}
Functional requirements define the specific behaviors, data processing steps, and workflows that the system must perform.

\\subsection{Module F1: User Authentication and Profile Management}
\\begin{itemize}
    \\item \\textbf{F1.1 Google OAuth 2.0 Sign-In:} The system must allow users to register and log in using Google accounts. The client retrieves the OAuth credential token and posts it to the backend endpoint \\texttt{POST /api/auth/google}. The backend uses the \\texttt{google-auth-library} to verify the payload signature, matching email domains against college records before registering or authorizing the session.
    \\item \\textbf{F1.2 Admin Whitelist Validation:} The administrative portal must restrict dashboard logins. When an administrator signs in, the backend checks if the authenticated email exists in the whitelisted database table. If not, the request returns HTTP 403 Forbidden, blocking unauthorized dashboard entry.
    \\item \\textbf{F1.3 JWT Session Authorization:} Upon sign-in, the server signs a JWT payload (containing ID, email, and role) using a secure symmetric key with a 24-hour expiration window. The client stores this token (in AsyncStorage for mobile, or HTTP-Only cookies for web) and attaches it in the Authorization headers of all subsequent requests.
    \\item \\textbf{F1.4 Gamified Profile Dashboard:} The backend must maintain and serve user profile statistics via \\texttt{GET /api/users/profile}. The data returned must include the user's total upload count, completed quizzes, contribution points, and an array of unlocked badge icons (such as \"Top Contributor\", \"Quiz Champion\", \"Help Hero\").
\\end{itemize}

\\subsection{Module F2: Document Upload and Storage}
\\begin{itemize}
    \\item \\textbf{F2.1 File Ingestion:} The system must process PDF uploads via multipart/form-data. The endpoint \\texttt{POST /api/notes/upload} must validate that the file payload size is under 15MB, reject unsupported document extensions, and extract raw document streams.
    \\item \\textbf{F2.2 Asynchronous Storage Upload:} The backend must direct the binary stream to the Cloudinary API. If the server detects a Cloudinary connection failure or timeout (exceeding 8 seconds), the fallback handler must write the binary stream to Supabase Storage, saving the generated public URL in the note metadata.
    \\item \\textbf{F2.3 Metadata Curriculum Tagging:} The document creation form must require the user to choose tags matching the academic hierarchy. The parameters (Course, Branch, Year, Semester, Subject, Unit) are validated against defined lookup tables in the database to prevent arbitrary directory tagging.
\\end{itemize}

\\subsection{Module F3: Multi-Layer Plagiarism and AI Verification Pipeline}
\\begin{itemize}
    \\item \\textbf{F3.1 Lexical Winnowing Plagiarism Check:} The verification process must normalize the extracted document text by removing whitespace and punctuation, chunking it into $k$-grams ($k=20$), calculating hashes, and selecting min-hashes within a sliding window ($w=15$). These fingerprints are matched against database shingles, flagging notes with similarity score $S_{winnowing} \\ge 40\\%$.
    \\item \\textbf{F3.2 Semantic SimHash Near-Duplicate Check:} The system must calculate a 64-bit SimHash of word frequencies within the note. It computes the Hamming distance between the new SimHash and hashes of existing notes:
    \\begin{equation}
    \\text{HammingDistance}(H_1, H_2) = \\text{popcount}(H_1 \\oplus H_2)
    \\end{equation}
    If the Hamming distance is less than or equal to 3, the note is flagged as a near-duplicate upload.
    \\item \\textbf{F3.3 Live Web Search Crawling:} The pipeline must select the top 5 sentences with the highest information density, query web search APIs, scrape the top matching page contents, and calculate Jaccard distance against the uploaded text. If Jaccard similarity exceeds $0.5$, the web source URL is logged.
    \\item \\textbf{F3.4 Gemini AI Content Audit:} The system must transmit text samples to the Gemini 2.0 Flash API with a structured prompt. The model audits the document to verify that it represents readable study material, contains no garbage characters, aligns with the specified subject tags, and is not a syllabus copy. The API returns a JSON report containing a boolean pass/fail status and audit remarks.
\\end{itemize}

\\subsection{Module F4: Semantic Note Search and Discovery}
\\begin{itemize}
    \\item \\textbf{F4.1 Natural Language Search:} The endpoint \\texttt{GET /api/notes/search} must convert natural language queries into 1536-dimensional embedding vectors using Gemini's text-embedding engine. The backend executes a similarity search query on the PostgreSQL \\texttt{note\_chunks} table to return documents ordered by cosine similarity score.
    \\item \\textbf{F4.2 Structured Filters:} The database search query must support hard filters. Users can refine their search by combining semantic matching with parameters like Semester, Branch, and Unit, narrowing similarity searches to relevant database subsets.
\\end{itemize}

\\subsection{Module F5: AI Career Advisor Chat (RAG)}
\\begin{itemize}
    \\item \\textbf{F5.1 RAG Search Context:} The chat API \\texttt{POST /api/career/chat} must convert the user's career question into a vector embedding, query pgvector to retrieve the top 5 most similar notes, and concatenate the text chunks. This retrieved context is injected into the Gemini 2.0 Flash prompt to ensure responses are grounded in the user's specific course syllabus.
    \\item \\textbf{F5.2 Interactive Chat Interface:} The client must display a responsive chat screen with bubble interfaces, typing indicators, formatting markdown support for roadmaps, and buttons to copy or save advice.
    \\item \\textbf{F5.3 Persistent Chat History:} The system must save chat message history in the database, allowing users to load past chat sessions by session ID and resume conversations.
\\end{itemize}

\\subsection{Module F6: SnapSolve OCR Solver}
\\begin{itemize}
    \\item \\textbf{F6.1 Image Upload:} The mobile application must interface with the device camera using \\texttt{expo-image-picker}, allowing users to capture images of questions, crop the selection area, and upload the image buffer.
    \\item \\textbf{F6.2 Gemini OCR Parsing and Solver:} The backend uploads the image buffer to Gemini's vision endpoint. Gemini parses the math formulas, runs OCR to extract the question text, and returns a structured step-by-step LaTeX-formatted solution.
\\end{itemize}

\\subsection{Module F7: Assessment AI Quiz Generator}
\\begin{itemize}
    \\item \\textbf{F7.1 Automatic MCQ Generation:} The endpoint \\texttt{POST /api/quiz/generate} must parse the note's text, extract key technical concepts, and call the Gemini API to construct a 5-question multiple-choice quiz with four options per question and a verified answer key, returning it as structured JSON.
    \\item \\textbf{F7.2 Real-time Quiz Grading:} The client app must validate user answers, calculate the score, and post results to \\texttt{POST /api/quiz/submit}. If the score is $\\ge 80\\%$, the server awards 10 contribution points and updates the database records.
\\end{itemize}

\\subsection{Module F8: Collaborative Study Rooms}
\\begin{itemize}
    \\item \\textbf{F8.1 Socket Room Joins:} The Socket.io connection controller must listen for \\texttt{join\_room} events. It validates the user's authorization token, registers their socket ID to the room channel, and broadcasts a join notification.
    \\item \\textbf{F8.2 Real-time Messages Broadcast:} The server must broadcast \\texttt{send\_message} events. It receives the message payload, persists it to the database table \\texttt{messages}, and broadcasts it to all active sockets in the room channel in under 150ms.
    \\item \\textbf{F8.3 Peer Help Request Board:} Students can dispatch a \\texttt{help\_request} event, which publishes a question banner on the study room's board. Online classmates can click \"Accept\" to join their chat, earning 20 contribution points when marked as resolved.
    \\item \\textbf{F8.4 Profanity Chat Filtering:} The server socket middleware must pass incoming chat text strings to the \\texttt{leo-profanity} utility library. If any profane words match, they are replaced with asterisks before being broadcasted.
\\end{itemize}

\\subsection{Module F9: Gamification and Leaderboards}
\\begin{itemize}
    \\item \\textbf{F9.1 Automated Points Awarding:} The backend must execute transactions to increment student points. Point values are defined as: 50 points for verified note uploads, 20 points for resolving peer help requests, and 10 points for scoring over 80\\% on quizzes.
    \\item \\textbf{F9.2 Badge Milestones:} When a user's point total exceeds thresholds (e.g., 500, 1000, 2500 points), the backend awards badges and updates the profile, triggering a socket banner notification to the student.
    \\item \\textbf{F9.3 Real-Time Global Leaderboard:} The database view \\texttt{leaderboard\_view} must sort active users in descending order of points, exposing a fast cached API endpoint to display user ranks and profile links.
\\end{itemize}

\\section{NON-FUNCTIONAL REQUIREMENTS}
Non-functional requirements specify the performance, security, and quality constraints of the platform.

\\subsection{Performance}
\\begin{itemize}
    \\item \\textbf{Sub-Second Vector Search:} Similarity queries using the pgvector extension must return the top 5 nearest neighbors in under 200 milliseconds.
    \\item \\textbf{Low-Latency APIs:} Standard REST API endpoints (excluding document verification and AI calls) must return JSON responses in under 250 milliseconds under normal network conditions.
    \\item \\textbf{Fast Initial Render:} The web application's initial DOM rendering must complete in under 1.5 seconds, utilizing code splitting to load components only as needed.
    \\item \\textbf{Real-time WebSocket Broadcasts:} Socket.io messages must be delivered to all users in a room with a latency under 150 milliseconds.
\\end{itemize}

\\subsection{Reliability and Fault Tolerance}
\\begin{itemize}
    \\item \\textbf{Dual Storage Fallback:} If Cloudinary experiences a timeout or rate limit error, the file upload route must automatically fall back to Supabase Storage, preventing upload failures.
    \\item \\textbf{AI API Failover:} If the primary Gemini API endpoint is unavailable, the backend must redirect requests to the fallback Mistral API or a local Ollama service.
    \\item \\textbf{Connection Pooling:} The backend must use connection pooling (via \\texttt{pg.Pool}) to manage database connections, automatically reconnecting if the database server restarts.
    \\item \\textbf{Socket Auto-Reconnect:} The mobile and web clients must be configured to automatically attempt reconnection if the WebSocket link drops.
\\end{itemize}

\\subsection{Security}
\\begin{itemize}
    \\item \\textbf{Helmet HTTP Headers:} The Express backend must use the Helmet middleware to set security headers, protecting the system against clickjacking, cross-site scripting (XSS), and MIME sniffing.
    \\item \\textbf{JWT Token Verification:} All routes except authentication and public notes search must require a valid JWT token in the Authorization header. The token must expire in 24 hours.
    \\item \\textbf{Input Sanitization:} To prevent SQL injection and XSS attacks, all inputs must be sanitized using parameterized queries in PostgreSQL.
    \\item \\textbf{Bcrypt Hashing:} Passwords for custom student logins must be hashed with a salt round of 10 using bcrypt before storage.
\\end{itemize}

\\subsection{Usability}
\\begin{itemize}
    \\item \\textbf{Standardized Light Theme:} NoteHub implements a standardized light theme (\"NoteHub Light\") to ensure a consistent, clean, and professional interface.
    \\item \\textbf{Responsive Grid Layouts:} The web application must adapt to varying viewport widths (desktop, tablet, mobile) using CSS Grid and Flexbox.
    \\item \\textbf{Custom Sockets Navigation:} The mobile client must implement an animated custom navigation bar to switch between Notes, Collaborate, Snap AI, and Career Advisor screens.
\\end{itemize}

\\subsection{Scalability}
\\begin{itemize}
    \\item \\textbf{Docker Containerization:} The backend services must be packaged in Docker containers to ensure identical configurations across development, testing, and production.
    \\item \\textbf{Asynchronous Worker Processes:} The document verification pipeline must process files asynchronously, freeing backend thread resources to handle other incoming API requests.
\\end{itemize}

\\section{PERFORMANCE REQUIREMENTS}
Performance requirements define the numerical metrics the system must satisfy.

\\begin{table}[htbp]
\\centering
\\caption{NoteHub Target Performance Metrics}
\\label{tab:perf_metrics}
\\resizebox{\\textwidth}{!}{%
\\begin{tabular}{|l|p{6cm}|p{6.5cm}|}
\\hline
\\textbf{Parameter ID} & \\textbf{Metric Description} & \\textbf{Target Value / Threshold} \\\\
\\hline
PERF-01 & End-to-end PDF processing latency & $< 60$ seconds (including OCR and AI checks) \\\\
\\hline
PERF-02 & pgvector query execution time & $< 200$ milliseconds under $N \le 10,000$ rows \\\\
\\hline
PERF-03 & Socket.io broadcast latency & $< 150$ milliseconds (client-to-client loop) \\\\
\\hline
PERF-04 & Standard REST JSON response time & $< 250$ milliseconds under normal network load \\\\
\\hline
PERF-05 & Plagiarism model precision and recall & Precision $\ge 92\\%$, Recall $\ge 95\\%$ \\\\
\\hline
PERF-06 & SnapSolve Image OCR text extraction accuracy & $\ge 92\\%$ under standard library light settings \\\\
\\hline
PERF-07 & App memory consumption on mobile devices & $< 150$ MB RAM under note reading workflows \\\\
\\hline
PERF-08 & Database connection pool acquisition delay & $< 20$ milliseconds under peak usage thresholds \\\\
\\hline
\\end{tabular}%
}
\\end{table}

The numerical constraints defined in Table~\\ref{tab:perf_metrics} act as the performance boundary. Failing to stay within these limits triggers automatic system alerts on the server dashboards.

\\section{DESIGN CONSTRAINTS}
Design constraints represent the technological limitations, policies, and environment restrictions of the project.

\\subsection{Mobile Framework Restrictions}
NoteHub uses React Native with the Expo SDK. This restricts the mobile client to Expo-supported libraries and native modules. Any custom native Android or iOS libraries must be compatible with Expo's configuration system, preventing direct installation of unverified native packages. PDF rendering on the mobile client is constrained to webview integrations or basic document readers.

\\subsection{Database Indexing Restrictions}
PostgreSQL with pgvector supports IVFFlat and HNSW indexes. While HNSW offers high recall and search speeds, it requires significant server memory. NoteHub is deployed on Render's free tier, which restricts memory to 512MB. This memory limit prevents the use of large HNSW indexes, requiring the database to fall back to optimized B-Tree and IVFFlat indexes to avoid memory issues.

\\subsection{API Rate Limits and Quotas}
NoteHub relies on free-tier APIs for generative AI and search crawling:
\\begin{itemize}
    \\item \\textbf{Google Gemini 2.0 Flash API:} Restricts requests to 15 RPM (requests per minute) and 1,000 RPD (requests per day).
    \\item \\textbf{Google Custom Search API:} Restricts free search queries to 100 queries per day.
\\end{itemize}
To operate within these quotas, NoteHub must implement local caching of search results and limit AI calls per user to 5 requests per minute.

\\section{SYSTEM REQUIREMENTS}
This section outlines the hardware and software specifications for the development and deployment of NoteHub.

\\subsection{Hardware Requirements}
Table~\\ref{tab:hardware_specs} lists the hardware specifications for the development server and client devices.

\\begin{table}[htbp]
\\centering
\\caption{System Hardware Specifications}
\\label{tab:hardware_specs}
\\resizebox{\\textwidth}{!}{%
\\begin{tabular}{|l|p{7cm}|p{7cm}|}
\\hline
\\textbf{Component} & \\textbf{Development/Server Specifications} & \\textbf{Client Device Specifications} \\\\
\\hline
Processor          & Intel Core i5 / AMD Ryzen 5 (2.5 GHz quad-core) or above. & Quad-core processor (ARM-based for mobile, x86/ARM for web client). \\\\
\\hline
RAM                & 8 GB DDR4 (16 GB recommended for running Docker and DB locally). & 4 GB RAM (mobile devices), 4 GB RAM (desktop web clients). \\\\
\\hline
Storage            & 256 GB SSD (with 20 GB free space for database caching). & 500 MB free space (for caching PDFs and assets on mobile client). \\\\
\\hline
Network            & High-speed broadband connection (minimum 10 Mbps). & Active internet connection (4G/5G mobile data or Wi-Fi). \\\\
\\hline
Display            & 1080p monitor for development. & Minimum display resolution of 720x1280 (mobile), 1024x768 (desktop). \\\\
\\hline
\\end{tabular}%
}
\\end{table}

\\subsection{Software Requirements}
Table~\\ref{tab:software_specs} lists the software packages, frameworks, and tools used in NoteHub.

\\begin{table}[htbp]
\\centering
\\caption{System Software Specifications}
\\label{tab:software_specs}
\\resizebox{\\textwidth}{!}{%
\\begin{tabular}{|l|l|l|p{5.5cm}|}
\\hline
\\textbf{Software Type} & \\textbf{Technology / Library} & \\textbf{Version} & \\textbf{Purpose} \\\\
\\hline
Runtime Environment & Node.js & v20.x LTS & JavaScript runtime for backend services. \\\\
\\hline
Backend Framework   & Express.js & v4.19.x & REST API framework for routing. \\\\
\\hline
Database Engine     & PostgreSQL & v15.x & Persistent relational and vector storage. \\\\
\\hline
Vector Search       & pgvector & v0.5.x & High-dimensional embedding storage/search. \\\\
\\hline
Real-Time Sync      & Socket.io & v4.7.x & WebSocket connection management. \\\\
\\hline
Frontend Framework  & React.js & v18.x & Web user interface development. \\\\
\\hline
Web Bundler         & Vite & v5.x & Fast web client builds and hot reloading. \\\\
\\hline
Mobile Framework    & React Native / Expo & SDK 54 & Cross-platform native mobile development. \\\\
\\hline
Security Middleware & Helmet & v7.x & HTTP security headers configuration. \\\\
\\hline
Cryptography        & bcrypt & v5.x & Hashing password credentials. \\\\
\\hline
\\end{tabular}%
}
\\end{table}

This software configuration guarantees environment consistency and ensures that NoteHub compiles and runs reliably on cloud platforms.
`;

  const finalContent = before + newChapter3 + after;
  fs.writeFileSync(filePath, finalContent, 'utf8');
  console.log('Successfully replaced Chapter 3 with super-expanded version v2 in Project Stage II Report.tex');
} catch (err) {
  console.error('Error modifying file:', err);
  process.exit(1);
}
