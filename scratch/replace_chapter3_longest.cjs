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

To address this problem, NoteHub must operate within four mathematical and system design constraints:
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
\\end{enumerate}

\\section{SYSTEM OVERVIEW}
NoteHub is a multi-tier, cross-platform academic knowledge network structured around a central API. The web application (built with React.js, Vite, and TypeScript) and the mobile client (built with React Native and Expo) communicate with a Node.js/Express.js backend and a PostgreSQL database.

The system is divided into four primary modules:
\\begin{enumerate}
    \\item \\textbf{User Authentication and Session Module:} Manages user registration, profiles, and permissions. It implements Google OAuth 2.0 to verify identities. Students log in using Google accounts, and whitelisted administrators use a dedicated portal protected by an authorized admin list. Upon verification, the backend issues a JSON Web Token (JWT) to authorize subsequent API requests.
    
    \\item \\textbf{Document Ingestion and Verification Module:} Coordinates file uploads, metadata tagging, and plagiarism checks. When a student uploads a PDF, the backend extracts the text, saves the file to Cloudinary/Supabase, and passes the text to the verification pipeline. The pipeline runs lexical Winnowing fingerprinting, semantic SimHash near-duplicate checks, sentence-level web crawling, and Gemini content relevancy checks to ensure quality and originality.
    
    \\item \\textbf{AI Services and RAG Career Advisor Module:} Houses the intelligent study aids. Text notes are parsed, divided into chunks, converted into 1536-dimensional vector embeddings, and indexed in PostgreSQL via pgvector. When a student asks a career question, the system runs a similarity search to find matching curriculum notes, salaries, and roadmaps, using Google Gemini to construct a response. This module also provides SnapSolve (OCR math problem solver) and Assessment AI (auto-quiz generator).
    
    \\item \\textbf{Socket-Based Collaborative Module:} Enables real-time communication. Using Socket.io 4, it establishes namespaces and rooms for study groups, peer messaging, and help boards, using profanity filters to moderate chats.
\\end{enumerate}

\\begin{figure}[H]
    \\centering
    \\includegraphics[width=0.9\\linewidth]{notehub_system_architecture.png}
    \\caption{NoteHub High-Level System Architecture}
    \\label{fig:system_arch_ch3}
\\end{figure}

The system architecture diagram (Figure~\\ref{fig:system_arch_ch3}) outlines how the web and mobile clients connect to the Express server, which acts as the hub coordinating the PostgreSQL database, Socket.io, Gemini/Mistral APIs, and storage endpoints.

The high-level user workflow is as follows:
\\begin{enumerate}
    \\item \\textbf{Login:} A user logs in using Google OAuth on either the web portal or the mobile application.
    \\item \\textbf{Registration:} The system checks if the user is a new student. If so, it creates a profile in the PostgreSQL database, initialises their contribution points to zero, and logs them in.
    \\item \\textbf{Upload:} The student selects a note (PDF format), assigns it a branch, year, semester, and subject, and uploads it.
    \\item \\textbf{Verification:} The document is checked for plagiarism and curriculum relevance. If it passes, it is published, and the uploader earns contribution points. If it fails, the uploader is notified with feedback.
    \\item \\textbf{Interactive Study:} Other students can search for the note, read it, launch Assessment AI to generate a quiz, use SnapSolve to scan and solve equations, or join a real-time study room to discuss the note with classmates.
\\end{enumerate}

\\section{FUNCTIONAL REQUIREMENTS}
Functional requirements define the specific behaviors, data processing steps, and workflows that the system must perform.

\\subsection{Module F1: User Authentication and Profile Management}
\\begin{itemize}
    \\item \\textbf{F1.1 Google OAuth 2.0 Sign-In:} The system must allow users to register and log in using Google accounts. The frontend sends the Google credential token to the backend, which verifies the token via the \\texttt{google-auth-library}.
    \\item \\textbf{F1.2 Admin Whitelist Validation:} The backend must check if an administrator's email is on the whitelisted emails database before granting access to the admin dashboard.
    \\item \\textbf{F1.3 JWT Session Authorization:} Upon verification, the backend generates a JWT token containing the user's ID, role, and email. The client stores this token securely and includes it in the Authorization header of all API calls.
    \\item \\textbf{F1.4 Gamified Profile Dashboard:} The system must maintain a user profile that tracks contribution points, badges earned (e.g., \"Note Guru\", \"Top Helper\"), total uploads, and completed quizzes, displaying these details on the user dashboard.
\\end{itemize}

\\subsection{Module F2: Document Upload and Storage}
\\begin{itemize}
    \\item \\textbf{F2.1 File Ingestion:} The web uploader and mobile client must support PDF and image (JPEG, PNG) uploads, verifying that the file size is under 15MB.
    \\item \\textbf{F2.2 Asynchronous Storage Upload:} The backend must upload document binaries to Cloudinary and return the resource URL. If Cloudinary fails, the backend must upload the file to Supabase Storage as a fallback.
    \\item \\textbf{F2.3 Metadata Curriculum Tagging:} The uploader must tag the document with a Course, Branch, Year, Semester, Subject, and Unit. The backend validates these tags before saving the note metadata to the database.
\\end{itemize}

\\subsection{Module F3: Multi-Layer Plagiarism and AI Verification Pipeline}
\\begin{itemize}
    \\item \\textbf{F3.1 Lexical Winnowing Plagiarism Check:} The system must run the Winnowing algorithm to check the note against existing database notes, flagging files that exceed a 40\\% similarity threshold.
    \\item \\textbf{F3.2 Semantic SimHash Near-Duplicate Check:} The system must generate a 64-bit SimHash of the notes' word frequencies and compare it against the database using Hamming distance, flagging near-duplicate files.
    \\item \\textbf{F3.3 Live Web Search Crawling:} The system must extract the top sentences of the document, query search engines, and evaluate results using Jaccard distance to detect online plagiarism.
    \\item \\textbf{F3.4 Gemini AI Content Audit:} The system must parse the extracted text and use Google Gemini to verify that the note is grammatically readable, matches the curriculum syllabus, and contains high-quality content. Notes that fail this audit are flagged.
\\end{itemize}

\\subsection{Module F4: Semantic Note Search and Discovery}
\\begin{itemize}
    \\item \\textbf{F4.1 Natural Language Search:} The system must support semantic note search. It converts user queries into vector embeddings and queries the database using pgvector cosine similarity.
    \\item \\textbf{F4.2 Structured Filters:} Users must be able to filter search results by Branch, Semester, and Subject.
\\end{itemize}

\\subsection{Module F5: AI Career Advisor Chat (RAG)}
\\begin{itemize}
    \\item \\textbf{F5.1 RAG Search Context:} When a user asks a career question, the backend must query pgvector for matching curriculum notes, salary data, and job descriptions, using this retrieved context to ground the Gemini response.
    \\item \\textbf{F5.2 Interactive Chat Interface:} The system must provide a real-time chat interface to discuss career paths, salary ranges, and job roadmaps.
    \\item \\textbf{F5.3 Persistent Chat History:} The system must save chat logs per user, allowing students to access their career advisor chat history across sessions.
\\end{itemize}

\\subsection{Module F6: SnapSolve OCR Solver}
\\begin{itemize}
    \\item \\textbf{F6.1 Image Upload:} Users must be able to upload or take a picture of a question using their mobile camera.
    \\item \\textbf{F6.2 Gemini OCR Parsing and Solver:} The system must run OCR on the image to extract text and mathematical formulas, using Gemini to generate a step-by-step mathematical solution.
\\end{itemize}

\\subsection{Module F7: Assessment AI Quiz Generator}
\\begin{itemize}
    \\item \\textbf{F7.1 Automatic MCQ Generation:} While reading a note, users must be able to trigger the Assessment AI. The system parses the notes' text and uses Gemini to generate a 5-question multiple-choice quiz.
    \\item \\textbf{F7.2 Real-time Quiz Grading:} The client grades the quiz responses and sends the score to the backend, which updates the student's quiz history and awards contribution points.
\\end{itemize}

\\subsection{Module F8: Collaborative Study Rooms}
\\begin{itemize}
    \\item \\textbf{F8.1 Socket Room Joins:} Students must be able to create or join subject-specific study rooms. Sockets must manage room subscription channels.
    \\item \\textbf{F8.2 Real-time Messages Broadcast:} The Socket.io server must broadcast messages and file attachments to all users in the study room instantly.
    \\item \\textbf{F8.3 Peer Help Request Board:} Users must be able to post help requests to the room's board. Other students in the room can claim and resolve the requests, earning contribution points.
    \\item \\textbf{F8.4 Profanity Chat Filtering:} Sockets must parse message content and replace profane words with asterisk characters before broadcasting.
\\end{itemize}

\\subsection{Module F9: Gamification and Leaderboards}
\\begin{itemize}
    \\item \\textbf{F9.1 Automated Points Awarding:} The backend must dynamically award points to users: 50 points for verified note uploads, 20 points for resolving peer help requests, and 10 points for scoring over 80\\% on AI quizzes.
    \\item \\textbf{F9.2 Badge Milestones:} The system must monitor point totals and automatically award badges (e.g., \"Helper Badge\", \"Verified Contributor\") when users reach specific point thresholds.
    \\item \\textbf{F9.3 Real-Time Global Leaderboard:} The system must maintain a public leaderboard showing user ranks, names, and total contribution points.
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

\\begin{itemize}
    \\item \\textbf{Upload Pipeline Execution Boundary:} The full upload pipeline --- text extraction, Winnowing, SimHash, web scraping, and Gemini AI verification --- must complete in under 60 seconds.
    \\item \\textbf{Plagiarism Pipeline Precision Target:} The combined Winnowing and SimHash checks must achieve a precision rate above 92\\% and a recall rate above 95\\% in identifying copied documents.
    \\item \\textbf{Vector Search Recall Target:} The pgvector similarity query must return relevant curriculum notes with a precision rate above 90\\% under database scales of up to 10,000 document records.
    \\item \\textbf{SnapSolve Math OCR Precision:} The OCR engine must parse written mathematical equations from user-uploaded images with an accuracy rate above 92\\% under average lighting.
\\end{itemize}

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
  console.log('Successfully replaced Chapter 3 in Project Stage II Report.tex');
} catch (err) {
  console.error('Error modifying file:', err);
  process.exit(1);
}
