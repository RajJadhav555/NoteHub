const fs = require('fs');
const path = require('path');

const filePath = 'd:\\Notehub1\\Notehub\\Notehub Report\\Project Stage II Report.tex';

try {
  let content = fs.readFileSync(filePath, 'utf8');

  const startMarker = '\\chapter{SYSTEM PLANNING}';
  const endMarker = '\\chapter{SYSTEM DESIGN}';

  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker);

  if (startIndex === -1) {
    console.error('Could not find start marker: \\chapter{SYSTEM PLANNING}');
    process.exit(1);
  }
  if (endIndex === -1) {
    console.error('Could not find end marker: \\chapter{SYSTEM DESIGN}');
    process.exit(1);
  }

  const before = content.substring(0, startIndex);
  const after = content.substring(endIndex);

  const newChapter4 = `\\chapter{SYSTEM PLANNING}
\\rule{\\textwidth}{1pt}

\\section{INTRODUCTION}
Software project planning is the foundation of successful software engineering. It involves coordinating human resources, scheduling development phases, assessing technical risks, and establishing quality standards to deliver a product on time and within budget. For NoteHub, proper planning is especially critical due to the complex integration of cross-platform frontend interfaces (React.js web and React Native mobile), real-time WebSocket communication, and generative AI services (Google Gemini 2.0 Flash). 

The strategy for NoteHub was built around three planning principles:
\\begin{itemize}
    \\item \\textbf{Incremental Integration:} Rather than building all components in isolation and attempting a single \"big bang\" integration, the system was planned to build and test features incrementally. Each core backend route and corresponding database table was verified before developing frontend clients.
    \\item \\textbf{Continuous Risk Mitigation:} Technical risks, such as generative AI API rate limits and vector database query latencies, were identified early. The project schedule included dedicated slots to build fallback mechanisms and query optimizations.
    \\item \\textbf{Rigor in Quality Assurance:} Testing was integrated into the development cycle. Sprints included time to write unit tests for the plagiarism and vector pipelines, ensuring that issues were caught and debugged early.
\\end{itemize}

By establishing a structured software development life cycle (SDLC) model, defining a detailed timeline, and outlining monitoring and control procedures, the development team ensured that NoteHub was developed, tested, and deployed within a single academic semester.

\\section{SDLC MODEL}
To manage the complexity of NoteHub, the team adopted the \\textbf{Agile Scrum} Software Development Life Cycle (SDLC) model. 

\\subsection{Why Agile Scrum was Chosen Over Waterfall}
Traditional software development models, such as the Waterfall model, operate sequentially. Each phase (requirements, design, implementation, verification, and maintenance) must be completed before the next begins. While Waterfall works well for systems with static requirements, it is poorly suited for modern AI-integrated applications. 

NoteHub relied on third-party generative AI and web crawling APIs. During development, these external APIs frequently updated their endpoints, rate limits, and pricing structures. A sequential Waterfall model would be too rigid to accommodate these changes. If the API rate limits shifted during the implementation phase, modifying the system architecture would require repeating requirements and design phases, causing major delays.

Agile Scrum resolves these issues by breaking development into short, iterative cycles called \\textbf{sprints}. This iterative approach provided several advantages for NoteHub:
\\begin{itemize}
    \\item \\textbf{Flexibility:} If a rate limit threshold changed or an external API went offline, the team adapted the architecture in the next sprint (e.g., implementing the Supabase storage fallback and local caching).
    \\item \\textbf{Incremental Testing:} Each sprint produced a working component that was immediately tested. This allowed the team to find performance bottlenecks in the plagiarism checker and vector database queries early, rather than waiting until the end of the project.
    \\item \\textbf{Improved Collaboration:} Daily stand-ups and sprint retrospectives kept team members aligned, helping coordinate frontend web and mobile development with the backend API.
\\end{itemize}

\\subsection{Agile Scrum Phases and Activities}
The development of NoteHub followed standard Scrum practices, utilizing 2-week sprints. Each sprint followed a rigid sequence of agile ceremonies:
\\begin{enumerate}
    \\item \\textbf{Product Backlog Grooming:} The team compiled all features (authentication, upload, plagiarism checks, career advisor, leaderboard) into a prioritized list of user stories.
    \\item \\textbf{Sprint Planning:} At the beginning of each sprint, the team selected high-priority user stories, estimated their complexity using story points, and committed to a sprint backlog.
    \\item \\textbf{Daily Stand-ups:} The team held 15-minute daily meetings to discuss progress, plan daily tasks, and identify blockers.
    \\item \\textbf{Sprint Reviews:} At the end of each sprint, the team demonstrated working features (e.g., a functioning Socket.io study room or a successful pgvector query) to obtain feedback.
    \\item \\textbf{Sprint Retrospectives:} The team reflected on the sprint process, identifying improvements to make the next sprint more efficient.
\\end{enumerate}

\\subsection{Detailed Sprint Narrative and User Stories}
The 14-week project timeline was divided into 7 distinct development sprints:
\\begin{itemize}
    \\item \\textbf{Sprint 1 (Weeks 1--2) --- Requirement Analysis and Schema Setup:} Focus on requirement elicitation, system overview design, and database planning. The team drafted the database schema, including notes, users, and messaging tables, and configured a local PostgreSQL server with the pgvector extension.
    \\begin{itemize}
        \\item \\textit{User Story US1.1:} As a developer, I want to establish a database schema with relational and vector capabilities so that student records and high-dimensional document chunks can be stored in the same database.
        \\item \\textit{Acceptance Criteria:} PostgreSQL database must initialize successfully; pgvector extension must compile and execute test cosine similarity queries.
        \\item \\textit{Story Points:} 5 SP.
        \\item \\textit{Sprint Review Outcome:} Initial relational tables mapped; pgvector test queries returned results in under 5ms.
    \\end{itemize}
    \\begin{itemize}
        \\item \\textit{User Story US1.2:} As a system analyst, I want to document the functional specifications so that the developers have a clear understanding of the project modules.
        \\item \\textit{Acceptance Criteria:} System specs document created; verified and signed off by the project guide.
        \\item \\textit{Story Points:} 3 SP.
        \\item \\textit{Sprint Review Outcome:} System Analysis and Specifications document finalized.
    \\end{itemize}
    
    \\item \\textbf{Sprint 2 (Weeks 3--4) --- Core Backend Setup and Auth:} Set up the Node.js/Express.js backend structure. Developed user authentication APIs, integrated Google OAuth 2.0, and implemented JWT token creation. Set up the admin whitelist portal, restricting administrative dashboard access.
    \\begin{itemize}
        \\item \\textit{User Story US2.1:} As a student, I want to log in using my Google account so that I can access my notes and study rooms securely without creating a new password.
        \\item \\textit{Acceptance Criteria:} Token validation must be processed on the backend using the \\texttt{google-auth-library}; successful verification must return a signed JWT token.
        \\item \\textit{Story Points:} 5 SP.
        \\item \\textit{Sprint Review Outcome:} Authentication middleware verified; whitelisted admin accounts successfully bypassed standard student routing.
    \\end{itemize}
    \\begin{itemize}
        \\item \\textit{User Story US2.2:} As an administrator, I want to view a whitelist portal so that only approved accounts can access the admin dashboard.
        \\item \\textit{Acceptance Criteria:} Whitelist validation query on database; API blocks unauthorized administrative logins.
        \\item \\textit{Story Points:} 3 SP.
        \\item \\textit{Sprint Review Outcome:} Admin portal whitelist interface established and tested with invalid credentials.
    \\end{itemize}
    
    \\item \\textbf{Sprint 3 (Weeks 5--6) --- Document Ingestion Pipeline:} Built document upload APIs, integrating text extraction and storage. Configured the Express backend to upload files to Cloudinary, and developed the Supabase Storage fallback mechanism to handle Cloudinary failures.
    \\begin{itemize}
        \\item \\textit{User Story US3.1:} As a student, I want to upload a PDF note and have the system save it securely so that other students can discover it.
        \\item \\textit{Acceptance Criteria:} The uploader must accept PDF files under 15MB; it must upload them to Cloudinary and fall back to Supabase Storage if Cloudinary is offline.
        \\item \\textit{Story Points:} 8 SP.
        \\item \\textit{Sprint Review Outcome:} File upload pipeline integrated; fallback trigger successfully redirected uploads to Supabase during simulated Cloudinary timeouts.
    \\end{itemize}
    \\begin{itemize}
        \\item \\textit{User Story US3.2:} As a system components integrator, I want to parse uploaded PDF documents and extract raw text on the server.
        \\item \\textit{Acceptance Criteria:} Use \\texttt{pdf-parse} to extract text, validate that non-empty text strings are returned, and return a clean JSON payload.
        \\item \\textit{Story Points:} 5 SP.
        \\item \\textit{Sprint Review Outcome:} PDF parsing verified with multi-column text formats and diagrams.
    \\end{itemize}
    
    \\item \\textbf{Sprint 4 (Weeks 7--8) --- Plagiarism Algorithms:} Implemented core plagiarism detection check. Coded the Winnowing fingerprinting algorithm and the 64-bit SimHash near-duplicate check. Developed the sentence-level web crawler to scrape search engines for online plagiarized matches.
    \\begin{itemize}
        \\item \\textit{User Story US4.1:} As an administrator, I want the system to check uploaded notes for plagiarism so that duplicate or copy-pasted content is flagged automatically.
        \\item \\textit{Acceptance Criteria:} Winnowing algorithm must extract k-grams and select min-hashes; SimHash must calculate bitwise distance; copied files must be flagged.
        \\item \\textit{Story Points:} 8 SP.
        \\item \\textit{Sprint Review Outcome:} Plagiarism utility modules verified; near-duplicate notes were detected and flagged within a 25-second processing window.
    \\end{itemize}
    \\begin{itemize}
        \\item \\textit{User Story US4.2:} As a student, I want the system to search the public web for plagiarized text in my notes so that I know if my content matches online sources.
        \\item \\textit{Acceptance Criteria:} Parse document into sentences, query search engine API, analyze and aggregate similarity scores.
        \\item \\textit{Story Points:} 8 SP.
        \\item \\textit{Sprint Review Outcome:} Web crawler script completed and integrated with custom search engines, returning exact URL matches.
    \\end{itemize}
    
    \\item \\textbf{Sprint 5 (Weeks 9--10) --- AI Integration and RAG:} Integrated Google Gemini 2.0 Flash APIs. Set up document text chunking and embedding generation, storing vectors in pgvector. Developed the RAG pipeline to retrieve relevant notes context for the AI Career Advisor. Coded SnapSolve and Assessment AI.
    \\begin{itemize}
        \\item \\textit{User Story US5.1:} As a student, I want to ask career questions and receive advice based on my study notes so that I can prepare for my future role.
        \\item \\textit{Acceptance Criteria:} The RAG query must run a cosine similarity search on pgvector; retrieved context must be sent to Gemini to generate the response.
        \\item \\textit{Story Points:} 8 SP.
        \\item \\textit{Sprint Review Outcome:} RAG career chat operational; response generation times averaged 2.8 seconds, returning syllabus-aligned roadmaps.
    \\end{itemize}
    \\begin{itemize}
        \\item \\textit{User Story US5.2:} As a student, I want to capture a picture of a question and get a step-by-step solution immediately.
        \\item \\textit{Acceptance Criteria:} Send image buffer to Gemini 2.0 Flash vision endpoints; parse the returned explanation payload; render on the mobile client.
        \\item \\textit{Story Points:} 8 SP.
        \\item \\textit{Sprint Review Outcome:} SnapSolve visual solver implemented; OCR and math formula rendering validated on mobile screens.
    \\end{itemize}
    
    \\item \\textbf{Sprint 6 (Weeks 11--12) --- Sockets and Collaboration:} Developed real-time features using Socket.io 4. Configured namespace rooms for study groups, coded the live peer help board, and integrated chat profanity filters.
    \\begin{itemize}
        \\item \\textit{User Story US6.1:} As a student, I want to join a study room and chat in real-time with my classmates so that we can collaborate on notes.
        \\item \\textit{Acceptance Criteria:} Socket.io must establish namespace channels; messages must broadcast instantly; profane words must be filtered.
        \\item \\textit{Story Points:} 5 SP.
        \\item \\textit{Sprint Review Outcome:} WebSocket channels verified; chat messages broadcasted in under 100ms; \\texttt{leo-profanity} replaced flagged words with asterisks.
    \\end{itemize}
    \\begin{itemize}
        \\item \\textit{User Story US6.2:} As a student in need of help, I want to post on the live peer help board so that online classmates can join my room.
        \\item \\textit{Acceptance Criteria:} Dispatch global event when help request is posted; real-time notifications sent to active socket clients.
        \\item \\textit{Story Points:} 5 SP.
        \\item \\textit{Sprint Review Outcome:} Live help board system synchronized and real-time banner notifications working on both web and mobile.
    \\end{itemize}
    
    \\item \\textbf{Sprint 7 (Weeks 13--14) --- Testing and Deployment:} Conducted unit, integration, and system testing. Configured Docker containers for the backend, deployed frontend clients on Vercel, and deployed backend APIs on Render.
    \\begin{itemize}
        \\item \\textit{User Story US7.1:} As a developer, I want to containerize the backend services so that the system runs identically in development and production environments.
        \\item \\textit{Acceptance Criteria:} Dockerfile must build the backend image successfully; Vercel and Render deployments must connect to the live PostgreSQL database.
        \\item \\textit{Story Points:} 5 SP.
        \\item \\textit{Sprint Review Outcome:} System successfully deployed; REST APIs and Socket.io endpoints verified on production servers.
    \\end{itemize}
    \\begin{itemize}
        \\item \\textit{User Story US7.2:} As a QA engineer, I want to test the entire system for regression issues and load spikes before release.
        \\item \\textit{Acceptance Criteria:} Run full regression suite; simulate up to 100 concurrent socket connections; ensure database connection pooling works.
        \\item \\textit{Story Points:} 5 SP.
        \\item \\textit{Sprint Review Outcome:} System verification and load tests executed successfully; database connection limits stabilized using pool tuning.
    \\end{itemize}
\\end{itemize}

\\section{TIMELINE AND MILESTONES}
The project schedule was planned to complete all phases within a 14-week academic semester. Table~\\ref{tab:milestones_ch4} summarizes the major milestones and deliverables of the project.

\\begin{table}[htbp]
\\centering
\\caption{Project Milestones and Deliverables}
\\label{tab:milestones_ch4}
\\resizebox{\\textwidth}{!}{%
\\begin{tabular}{|p{3cm}|p{3.5cm}|p{7.5cm}|}
\\hline
\\textbf{Milestone} & \\textbf{Target Week} & \\textbf{Expected Deliverable} \\\\
\\hline
M1: Requirements & Week 2 & Complete System Specification Document and normalized DB schema. \\\\
\\hline
M2: Backend Auth & Week 4 & Express.js REST API with working Google OAuth and JWT sessions. \\\\
\\hline
M3: Ingestion    & Week 6 & File upload pipeline with Cloudinary/Supabase fallback storage. \\\\
\\hline
M4: Plagiarism   & Week 8 & Document similarity checking running Winnowing and SimHash checks. \\\\
\\hline
M5: AI \\& RAG    & Week 10 & pgvector storage indexing and Gemini-pro Career Advisor chat. \\\\
\\hline
M6: Sockets      & Week 12 & WebSocket chat rooms with profanity filtering and help boards. \\\\
\\hline
M7: Deployment   & Week 14 & Docker containers deployed on Vercel and Render with Swagger docs. \\\\
\\hline
\\end{tabular}%
}
\\end{table}

\\subsection{Detailed Work Breakdown Structure}
To ensure all tasks were executed systematically, the team structured a detailed Work Breakdown Structure (WBS) mapping dependencies, durations, assignees, and technical deliverables. Table~\\ref{tab:wbs} lists the complete breakdown of the project.

\\begin{table}[htbp]
\\centering
\\caption{Project Work Breakdown Structure (WBS)}
\\label{tab:wbs}
\\resizebox{\\textwidth}{!}{%
\\begin{tabular}{|c|l|c|c|l|p{4.5cm}|}
\\hline
\\textbf{WBS ID} & \\textbf{Task Name} & \\textbf{Start} & \\textbf{End} & \\textbf{Assignee} & \\textbf{Deliverable} \\\\
\\hline
1.1 & Requirement Gathering \\& Specs & W1 & W2 & Analyst & Complete System Specifications Document. \\\\
\\hline
1.2 & Database Schema Design \\& Setup & W2 & W2 & DB Eng. & normalized SQL schema with pgvector. \\\\
\\hline
2.1 & Node.js/Express API foundation & W3 & W3 & Backend Dev. & Express boilerplate with standard structure. \\\\
\\hline
2.2 & Google OAuth \\& JWT Token Auth & W4 & W4 & Security Eng. & Secure passport token validation routes. \\\\
\\hline
2.3 & Admin Whitelist Portal Middleware & W4 & W4 & Backend Dev. & Route protection based on whitelist table. \\\\
\\hline
3.1 & Ingestion PDF Parser Controller & W5 & W5 & Backend Dev. & File upload endpoint with PDF text extractor. \\\\
\\hline
3.2 & Cloudinary \\& Supabase Storage API & W6 & W6 & Cloud Eng. & Fallback storage logic inside file controller. \\\\
\\hline
4.1 & Winnowing Fingerprinting Utility & W7 & W7 & Algorithm Dev. & K-gram hashing and sliding window selector. \\\\
\\hline
4.2 & SimHash Duplicate checker Utility & W8 & W8 & Algorithm Dev. & Bitwise frequency hashing and Hamming distance. \\\\
\\hline
4.3 & Sentence Web Search Crawler API & W8 & W8 & Backend Dev. & Google Custom Search crawler integration. \\\\
\\hline
5.1 & Vector Embeddings Generator & W9 & W9 & AI Eng. & text chunking and embedding logic. \\\\
\\hline
5.2 & Gemini-pro Advisor \\& pgvector RAG & W9 & W10 & AI Eng. & Similarity matches controller using Gemini. \\\\
\\hline
5.3 & SnapSolve camera OCR \\& quiz AI & W10 & W10 & Mobile Dev. & OCR solver and MCQ generator modules. \\\\
\\hline
6.1 & Socket.io 4 connection structure & W11 & W11 & Network Eng. & Event-driven socket namespaces. \\\\
\\hline
6.2 & Messaging Rooms \\& Help board & W12 & W12 & Frontend Dev. & Collaboration chat screens with board triggers. \\\\
\\hline
6.3 & Profanity Replacement Filters & W12 & W12 & Backend Dev. & Sockets middleware filtering using \\texttt{leo-profanity}. \\\\
\\hline
7.1 & Docker container config & W13 & W13 & DevOps Eng. & Multi-stage Dockerfiles. \\\\
\\hline
7.2 & Testing, Debug \\& Cloud Deploy & W13 & W14 & QA Eng. & System verification and production deployment. \\\\
\\hline
\\end{tabular}%
}
\\end{table}

To visualize the project timeline and the overlap between sprints, a Gantt chart was constructed. 

\\begin{figure}[H]
\\centering
\\begin{ganttchart}[
    vgrid={*2{dotted}, *1{black}},
    hgrid,
    x unit=0.7cm,
    y unit chart=0.7cm,
    time slot format=simple,
    title height=1,
    bar/.style={fill=blue!30, draw=blue!70, line width=1pt},
    bar height=0.6,
    group right shift=0,
    group top shift=0.1,
    group height=0.3
]{1}{14}
    \\gantttitle{Project Development Timeline (Weeks)}{14} \\\\
    \\gantttitlelist{1,...,14}{1} \\\\
    \\ganttbar{Planning \\& DB Schema}{1}{2} \\\\
    \\ganttbar{Backend Auth \\& API}{3}{4} \\\\
    \\ganttbar{Ingestion \\& Storage}{5}{6} \\\\
    \\ganttbar{Plagiarism Checking}{7}{8} \\\\
    \\ganttbar{AI \\& RAG Integration}{9}{10} \\\\
    \\ganttbar{Real-Time Sockets}{11}{12} \\\\
    \\ganttbar{Testing \\& Cloud Deploy}{13}{14}
\\end{ganttchart}
\\caption{Project Gantt Chart Timeline}
\\label{fig:gantt_chart}
\\end{figure}

Figure~\\ref{fig:gantt_chart} illustrates the 14-week timeline, detailing the sequential flow of backend development and the integration of real-time communication and AI services in later weeks.

\\section{RISK ANALYSIS AND MITIGATION}
Identifying and mitigating risks early was critical to avoiding project delays. We categorized risks into technical, operational, and schedule-related challenges. Table~\\ref{tab:risk_matrix} maps each risk to its category, probability, impact, and mitigation strategy.

\\begin{table}[htbp]
\\centering
\\caption{Project Risk Matrix}
\\label{tab:risk_matrix}
\\resizebox{\\textwidth}{!}{%
\\begin{tabular}{|c|p{4.5cm}|c|c|c|p{6.5cm}|}
\\hline
\\textbf{Risk ID} & \\textbf{Risk Description} & \\textbf{Likelihood} & \\textbf{Impact} & \\textbf{Risk Score} & \\textbf{Mitigation Strategy} \\\\
\\hline
R1 & AI API Rate Limits \\& Exhaustion & 4 & 5 & 20 & Implement local caching for search results and developer-grade fallbacks (Gemini to Mistral/Ollama). \\\\
\\hline
R2 & High Document Ingestion Latency & 3 & 3 & 9 & Process document verification asynchronously, displaying a processing status to the user. \\\\
\\hline
R3 & Vector Database Memory Limits  & 3 & 4 & 12 & Optimize database indexes, falling back to IVFFlat or standard indexes to respect Render RAM limits. \\\\
\\hline
R4 & WebSocket Sockets Event Drop    & 2 & 3 & 6 & Implement heartbeat intervals and client-side auto-reconnection logic. \\\\
\\hline
R5 & Plagiarism Checks False Positives & 3 & 4 & 12 & Fine-tune Winnowing window sizes ($w$) and combine it with semantic SimHash checks. \\\\
\\hline
R6 & Cloud Container Deploy Crashes  & 2 & 4 & 8 & Package services in Docker containers to match development and production environments. \\\\
\\hline
R7 & Client Storage Limits on Mobile & 4 & 3 & 12 & Implement local cache cleanups and limits on cached PDF files on mobile. \\\\
\\hline
R8 & Sockets Room Info Leakage       & 2 & 5 & 10 & Enforce strict token checks on room connections and isolate socket namespaces. \\\\
\\hline
R9 & Supabase API Retrieval Timeouts & 2 & 4 & 8 & Implement automatic connection retries and dual storage status checks. \\\\
\\hline
R10 & Web Crawler Rate Limiting      & 3 & 3 & 9 & Implement proxy rotation, custom API limits, and fallback internal search indexes. \\\\
\\hline
R11 & Leaderboard Sync Race Conditions & 2 & 4 & 8 & Use transaction levels (Serializable) in PostgreSQL for leaderboard point updates. \\\\
\\hline
R12 & JWT Expiration in Active Sockets & 2 & 3 & 6 & Implement socket refresh tokens and client hooks to validate token lifespan. \\\\
\\hline
\\end{tabular}%
}
\\end{table}

\\subsection{Detailed Risk Analysis and Mitigation}
\\begin{itemize}
    \\item \\textbf{AI API Rate Limits (R1):} NoteHub's free tier is subject to strict rate limits. To prevent API exhaustion, the system caches vector embeddings locally. If a user asks a career question that matches a previous query, the backend returns the cached response, saving API tokens. The system is also configured to automatically fall back from Gemini to Mistral if limits are hit.
    
    \\item \\textbf{High Ingestion Latency (R2):} Running SimHash, Winnowing, and Gemini verification sequentially can take up to 60 seconds per file. To prevent client timeouts, the backend handles verification asynchronously. When a student uploads a file, the API immediately saves the record as \"pending\" and returns a 202 response. A background queue processes the file, and Sockets broadcast the updated status when complete.
    
    \\item \\textbf{Database Memory Constraints (R3):} High-dimensional vector indexes (HNSW) require significant RAM. To prevent database crashes on Render's 512MB RAM free tier, the system is configured to use B-Tree indexes for relational data and optimized IVFFlat indexes for vectors, limiting memory usage.
    
    \\item \\textbf{WebSocket Connection Drop (R4):} WebSocket channels can fail due to erratic mobile data. NoteHub mitigates this by running heartbeat ping-pong intervals between the backend and mobile client. If the connection fails, the client uses an auto-reconnection loop with exponential backoff.
    
    \\item \\textbf{Plagiarism Checker False Positives (R5):} If the Winnowing algorithm parameters are too sensitive, it may flag standard citations or syllabus templates as plagiarized. To mitigate this, NoteHub uses a multi-layered check. A lexical match must exceed a 40\\% threshold, and a SimHash check must verify a near-duplicate Hamming distance before a document is flagged, reducing false positive rejections.
    
    \\item \\textbf{Cloud Container Deploy Crashes (R6):} Differences between local operating systems and host environments (Render, Vercel) can cause compile issues. The team containerized all services using multi-stage Docker builds, isolating the execution environment and matching all NPM versions.
    
    \\item \\textbf{Client Storage Limits on Mobile (R7):} Storing large volumes of PDF files on mobile cache directories can consume significant storage. The React Native mobile client implements cache monitoring. If the local storage allocated to NoteHub exceeds 100MB, the application triggers a cleanup routine that purges older PDFs.
    
    \\item \\textbf{Sockets Room Information Leakage (R8):} Sockets are vulnerable to room hijacking if security checks are missing. NoteHub mitigates this by running JWT token checks on the initial socket handshake (implemented in \\texttt{socket.js}). The server validates the user's ID and checks that they belong to the room before joining, preventing unauthorized message eavesdropping.
    
    \\item \\textbf{Supabase API Retrieval Timeouts (R9):} If Supabase storage experiences latencies, note loading on clients will fail. To address this, the client checks the availability of both Cloudinary and Supabase and caches the files locally in the phone storage (AsyncStorage) after the first retrieval.
    
    \\item \\textbf{Web Crawler Rate Limiting (R10):} Sending excessive web requests during plagiarism verification will cause search engines to block the server IP. NoteHub resolves this by batching web crawl queries, running queries with delays, and utilizing search engine API options with developer rate-limiting boundaries.
    
    \\item \\textbf{Leaderboard Sync Race Conditions (R11):} When multiple users upload notes and gain points simultaneously, concurrent updates to the user score table can fail due to database locking. NoteHub utilizes atomic operations in PostgreSQL (e.g., \\texttt{UPDATE users SET points = points + X WHERE id = Y}) under serialized transaction scopes to guarantee consistent point increments.
    
    \\item \\textbf{JWT Expiration in Active Sockets (R12):} When a user is in a long chat session, their JWT token might expire, causing Socket events to reject subsequent transmissions. To solve this, NoteHub implements a token refresh handshake that updates the socket instance session details before authorization expires.
\\end{itemize}

\\section{QUALITY ASSURANCE}
Quality Assurance (QA) was integrated into the development process, using a multi-tiered testing strategy and coding standards to verify that NoteHub is secure, scalable, and bug-free.

\\subsection{Testing Strategy}
The QA pipeline followed a structured testing hierarchy:
\\begin{enumerate}
    \\item \\textbf{Unit Testing:} Backend utility functions (such as SimHash fingerprinting, Winnowing k-gram generation, Jaccard distance calculation, and profanity text replacement) were tested independently using the \\textbf{Jest} testing framework.
    \\item \\textbf{Integration Testing:} Checked the data flow across multiple modules. The notes upload route was tested using \\textbf{Supertest} to ensure that text extraction, fingerprint checks, web query crawling, and Gemini audits executed in the correct sequence.
    \\item \\textbf{System Testing:} Evaluated the entire platform under simulated production conditions. Sockets were tested using mock client scripts (\\texttt{socket.io-client} test loops) under concurrent user connections to check for message drops, and RAG query times were monitored.
    \\item \\textbf{User Acceptance Testing (UAT):} The development team ran standard user scenarios to check that student registrations, note search, chat assistance, and quiz evaluations worked correctly.
    \\item \\textbf{Performance and Stress Testing:} The system was tested under heavy load. The file ingestion pipeline was tested with 50 concurrent PDF uploads to check for memory leaks, and pgvector indexes were analyzed for query times under high concurrent volumes.
    \\item \\textbf{Security Validation:} Input fields were tested for SQL Injection and Cross-Site Scripting (XSS). Parameterized database queries and API input sanitization routines (using \\texttt{express-validator}) were verified.
\\end{enumerate}

\\subsection{Test Case Template and Sample Results}
To maintain QA standards, the team documented all test cases in structured templates. Table~\\ref{tab:test_cases} lists sample test case scenarios.

\\begin{table}[htbp]
\\centering
\\caption{QA Test Case Scenarios and Results}
\\label{tab:test_cases}
\\resizebox{\\textwidth}{!}{%
\\begin{tabular}{|c|p{4cm}|p{3.5cm}|p{3.5cm}|p{3.5cm}|c|}
\\hline
\\textbf{Test ID} & \\textbf{Description} & \\textbf{Inputs} & \\textbf{Expected Output} & \\textbf{Actual Output} & \\textbf{Status} \\\\
\\hline
TC-01 & Google OAuth Token Verification & Valid Google API credential token. & Signed JWT token and user profile record. & Signed JWT returned, profile created in DB. & Passed \\\\
\\hline
TC-02 & Duplicate File Upload Check & Identical PDF note uploaded twice. & Plagiarism flag triggered; document upload blocked. & Error 400 returned: \"Duplicate content detected.\" & Passed \\\\
\\hline
TC-03 & Web Search Scraper Plagiarism & PDF notes copied directly from Wikipedia. & Scraper identifies matching Wikipedia URL. & Document flagged, similarity score 85\\% reported. & Passed \\\\
\\hline
TC-04 & Sockets Chat Message Broadcast & WebSocket message payload sent to Room 12. & Message broadcasted to all users in Room 12. & Received by active clients in 95ms. & Passed \\\\
\\hline
TC-05 & Chat Message Profanity Filtering & Message containing profane words. & Sockets replace profane words with asterisks. & Broadcasted message received as: \"**** you\". & Passed \\\\
\\hline
TC-06 & AI Career Advisor Retrieval & User query: \"Computer Networking roadmap\". & Cosine search finds networking notes, Gemini generates response. & Detailed roadmap returned in 2.5s. & Passed \\\\
\\hline
TC-07 & File Upload Cloudinary Fallover & Upload request with Cloudinary server blocked. & File successfully uploads to Supabase. & Retries run, file uploaded to Supabase, 201 response. & Passed \\\\
\\hline
TC-08 & SQL Injection Authentication Guard & Input: \\texttt{' OR 1=1; --} in email field. & Token auth rejection, login fails. & HTTP 401 Unauthorized returned, DB query safe. & Passed \\\\
\\hline
TC-09 & Leaderboard Concurrent Updates & 15 concurrent point increments on same user. & All 15 updates complete, final point value updated. & Final point value exact, no transaction locks. & Passed \\\\
\\hline
TC-10 & SnapSolve Image Question OCR & Math equation PNG upload. & OCR extracts equation, Gemini returns step solution. & LaTeX math solution text generated in 3.1s. & Passed \\\\
\\hline
\\end{tabular}%
}
\\end{table}

\\subsection{Coding Standards and Reviews}
To maintain code readability and simplify debugging, the team followed structured guidelines:
\\begin{itemize}
    \\item \\textbf{Type Safety:} The React.js web and React Native mobile clients used TypeScript, ensuring type checking at compile-time and reducing runtime errors.
    \\item \\textbf{Database Security:} All database queries were written using parameterized values in Node-Postgres, preventing SQL injection vulnerabilities.
    \\item \\textbf{Linting and Formatting:} ESLint and Prettier rules were configured. Code styles were validated before commit hooks were completed, ensuring consistency across all files.
    \\item \\textbf{Git Branching Strategy:} The project followed the GitFlow methodology. Developers created features in \\texttt{feature/*} branches, which were merged into \\texttt{develop} after testing. The \\texttt{main} branch was reserved for stable, production-ready releases.
    \\item \\textbf{Code Reviews:} Every pull request required review by another developer. Code was checked for correct variable scope, error handling, and memory leaks (e.g., ensuring WebSocket connections were closed when components unmounted).
\\end{itemize}

\\section{MONITORING AND CONTROL}
Monitoring and control procedures were established to track development progress and monitor the health of the deployed system.

\\subsection{Project Progress Tracking}
To monitor tasks and maintain development velocity, the team used the following tools:
\\begin{itemize}
    \\item \\textbf{GitHub Issue Board:} Every user story was translated into a GitHub issue, assigned a story point estimation, and tracked through \"To Do,\" \"In Progress,\" and \"Completed\" boards.
    \\item \\textbf{Sprint Burndown Charts:} Tracked completed story points against the sprint timeline, helping the team calculate velocity. Velocity is calculated as the sum of all story points completed in a sprint:
    \\begin{equation}
    \\text{Velocity} = \\sum_{s \\in \\text{Sprint}} \\text{StoryPoints}(s)
    \\end{equation}
    The team maintained an average velocity of 32 story points per sprint, which verified that the project was on track.
    \\item \\textbf{Schedule Variance Tracking:} The team monitored Schedule Variance (SV) based on planned value (PV) and earned value (EV) of completed tasks:
    \\begin{equation}
    \\text{SV} = \\text{EV} - \\text{PV}
    \\end{equation}
    A positive SV value throughout key milestones indicated that development was running ahead of schedule.
\\end{itemize}

\\subsection{Production System Monitoring}
Once deployed, NoteHub implemented monitoring tools to track performance:
\\begin{itemize}
    \\item \\textbf{API Request Logging:} Morgan middleware logged backend HTTP requests, tracking response statuses and endpoint latencies.
    \\item \\textbf{Winston Logging Framework:} Error levels (error, warn, info, verbose, debug) were configured in backend controllers, routing system events to log files.
    \\item \\textbf{Vector Search Latency Logs:} Database query times for pgvector searches were logged. If career advisor search times exceeded 200ms, database connection pool sizing was adjusted.
    \\item \\textbf{WebSocket Connection Tracing:} Socket.io logs monitored socket connections, disconnections, and heartbeat errors, helping optimize message delivery over weak mobile networks.
\\end{itemize}

\\subsection{Change Control Procedure}
To prevent scope creep, any request to add new features (e.g., adding Assessment AI or SnapSolve) had to follow a structured change process:
\\begin{enumerate}
    \\item \\textbf{Feature Proposal:} The proposed feature was documented, outlining the database migrations and external APIs required.
    \\item \\textbf{Feasibility Assessment:} The team evaluated the impact of the feature on the project timeline, API rate limits, and database memory constraints.
    \\item \\textbf{Migration Planning:} Database migrations (such as adding chat history tables) were scripted and tested on a local database before being run on the production PostgreSQL database.
\\end{enumerate}
This structured process ensured that new features were integrated without compromising the stability of existing systems.
`;

  const finalContent = before + newChapter4 + after;
  fs.writeFileSync(filePath, finalContent, 'utf8');
  console.log('Successfully replaced Chapter 4 with super-expanded version v3 in Project Stage II Report.tex');
} catch (err) {
  console.error('Error modifying file:', err);
  process.exit(1);
}
