const fs = require('fs');
const path = require('path');

const filePath = 'd:\\Notehub1\\Notehub\\Notehub Report\\Project Stage II Report.tex';

try {
  let content = fs.readFileSync(filePath, 'utf8');

  const startMarker = '\\chapter{INTRODUCTION}';
  const endMarker = '\\chapter{LITERATURE REVIEW}';

  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker);

  if (startIndex === -1) {
    console.error('Could not find start marker: \\chapter{INTRODUCTION}');
    process.exit(1);
  }
  if (endIndex === -1) {
    console.error('Could not find end marker: \\chapter{LITERATURE REVIEW}');
    process.exit(1);
  }

  const before = content.substring(0, startIndex);
  const after = content.substring(endIndex);

  const newChapter1 = `\\chapter{INTRODUCTION}
\\rule{\\textwidth}{1pt}
\\paragraph{}
\\section{INTRODUCTION}

The higher education system is currently undergoing a massive paradigm shift, driven by the rapid digitization of academic environments and a major transition from traditional, top-down models of knowledge delivery to active, peer-to-peer collaborative learning models. Historically, educational institutions relied on physical libraries and centralized, teacher-managed frameworks to distribute study materials. In modern engineering curricula, however, students produce and consume vast amounts of digital study resources daily, including handwritten notes, programming assignments, solved laboratory guides, project reports, and solutions to previous years' question papers. This peer-generated content represents a rich source of collective academic intelligence that, when organized, verified, and distributed effectively, can significantly improve student learning speed and performance. 

Despite this potential, most academic notes are managed through informal, fragmented, and transient channels, such as WhatsApp chats, Telegram channels, and unorganized personal cloud folders (e.g., Google Drive, Dropbox). This fragmentation creates major barriers to academic success. First, files shared through chat applications are highly transient; download links expire, attachments get deleted to free up device space, and searching through months of conversational messages to find a specific diagram or code snippet is highly inefficient. Second, generic cloud storage solutions lack curriculum-aware metadata. A folder of notes shared by a student does not specify the academic course, branch, year, semester, or the specific subject unit, resulting in poor searchability. Third, content shared through these channels undergoes no quality control or verification. Students frequently download plagiarized notes, obsolete study guides, or incorrect solutions, which can lead to academic setbacks. Finally, there is no centralized tool that integrates note sharing with real-time peer collaboration, nor is there a way to leverage these notes to provide personalized career suggestions or study assistance.

To address these limitations, the technology under research integrates several modern software engineering domains: cross-platform application development, real-time web socket communication, database query optimization, and generative Artificial Intelligence (AI). Developing a system that solves these challenges requires a robust architecture that provides a seamless, high-performance experience across both desktop screens and mobile touch interfaces. 

To achieve this, the proposed system, \\textbf{NoteHub}, is designed as an AI-powered, cross-platform academic knowledge-sharing ecosystem. NoteHub consists of a high-performance \\textbf{React.js web application} built using Vite and TypeScript for fast rendering and type safety, alongside a \\textbf{React Native mobile application} built with Expo that features custom animated floating navigation bars and native performance controls. The frontend clients connect to a robust, scalable backend built with \\textbf{Node.js and Express.js}. Relational data, user profiles, and note metadata are structured and stored in a relational \\textbf{PostgreSQL} database, which is enhanced with the \\textbf{pgvector} extension to support high-dimensional vector similarity operations. NoteHub is containerized using Docker to ensure environment consistency across development and production, and is deployed on modern cloud infrastructure with Vercel hosting the web frontend and Render executing the backend REST API services.

Rather than operating as a simple file repository, the system integrates \\textbf{Google Gemini 2.0 Flash} as its primary AI engine, with Mistral and local Ollama models configured as automated fallback pathways. The system parses uploaded PDF documents using advanced text extraction APIs and evaluates them through a multi-layered verification sequence. This pipeline includes the Winnowing algorithm for lexical fingerprinting, SimHash for near-duplicate document detection, sentence-level web search crawling for internet copy checking, and LLM-driven parsing to evaluate the note's quality and relevance to the curriculum syllabus. Additionally, a Retrieval-Augmented Generation (RAG) pipeline is built on top of the vector database, matching students' study contexts with career roadmaps, job expectations, salary metrics, and mock assessments. By integrating Socket.io 4 for live, collaborative study rooms, NoteHub establishes a secure, validated, and engaging learning network.

\\section{BACKGROUND AND MOTIVATION}

Higher education institutions have invested heavily in Learning Management Systems (LMS) such as Moodle, Canvas, and Blackboard. While these systems are useful for administrative tasks, class enrollment, and teacher-led assignments, they are fundamentally teacher-centric. The upload and distribution of learning materials are controlled entirely by the instructor, leaving little room for student contribution. Peer-led learning, which is a powerful pedagogical method, cannot thrive in these closed loops. When students wish to share their study notes, they are forced to use general-purpose social networks and chat platforms. While these informal systems are highly accessible, they lack the organization and search capabilities required for academic study.

To understand these academic resource management challenges and support the development of a dedicated platform, a structured survey was conducted among 320 Computer Engineering students in 2026. The questionnaire was designed to investigate student habits regarding note-taking, document sharing, exam preparation, and collaboration. The results of this survey revealed three critical statistics that motivated this project:
\\begin{itemize}
    \\item \\textbf{Unorganized Formats and Data Loss (78\\%):} 78\\% of surveyed students reported storing their study notes, past papers, and code snippets in unorganized formats across multiple platforms (e.g., local hard drives, cloud storage links, chat history). This disorganization leads to data loss, corrupted files, and highly inefficient retrieval when preparing for exams.
    \\item \\textbf{Search and Retrieval Delays (65\\%):} 65\\% of students stated they frequently struggle to find relevant study materials or solutions to past exam questions under time constraints, especially during study leave or right before examinations.
    \\item \\textbf{Motivation for Sharing (91\\%):} 91\\% of students expressed a strong willingness to upload their notes and help peers if they were rewarded with contribution points, digital badges, or peer recognition. This confirms that the lack of engagement and rewards in existing tools is the primary reason for low user contribution.
\\end{itemize}

Beyond the logistical difficulties of note sharing, students face a significant challenge when transitioning from undergraduate studies to the professional software industry. Generic career search engines provide broad advice that is disconnected from the student's actual college courses. Furthermore, when preparing for semester exams, students spend hours collecting previous year question papers (PYQs) and syllabus guides, and they often lack instant feedback on their solved answers.

This project is motivated by the opportunity to resolve these challenges. By combining cross-platform mobile and web application architectures with advanced document analysis and generative AI, NoteHub aims to bridge the gap between active student communities and enterprise-grade knowledge management. The system is designed to automate plagiarism checks, syllabus verification, and real-time socket communication, providing students with a safe, validated, and engaging space for learning. The integration of a RAG-based career advisor and automated assessments turns NoteHub into an active learning companion, rather than a passive file cabinet.

The psychological foundation of NoteHub's motivators is rooted in the Self-Determination Theory (SDT), which outlines that human motivation is driven by three basic psychological needs: competence, autonomy, and relatedness. Traditional files and drives act as cold, clinical archives that fail to satisfy these needs. By integrating gamified features, NoteHub builds competence through ranks and badges (e.g., \"Curriculum Expert\", \"Top Helper\"), supports autonomy by allowing students to upload and tag their own notes, and fosters relatedness by establishing interactive collaboration rooms. This ensures that sharing notes is no longer a chore, but an engaging social activity.

\\section{PROBLEM DEFINITION}

In technical terms, the core problem is: \\textit{designing, building, and deploying a secure, real-time, cross-platform knowledge network that automates note validation, curriculum-aligned indexing, semantic information retrieval, and peer collaboration, without relying on centralized manual curation.}

The technical problems and gaps in current academic resource management methods include:
\\begin{enumerate}
    \\item \\textbf{Vulnerability to Academic Plagiarism and Low-Quality Uploads:} Existing public repositories do not verify uploaded documents in real-time. This allows users to upload plagiarized, low-resolution, or irrelevant files. This compromises the academic credibility of the repository and discourages genuine contributors from sharing their work.
    \\item \\textbf{Lack of Structured, Curriculum-Aware Indexing:} Cloud storage platforms (e.g., Google Drive) use flat folder structures that rely entirely on the uploader's labeling. This results in inconsistent metadata. Engineering notes must be indexed hierarchically (Course $\\rightarrow$ Branch $\\rightarrow$ Year $\\rightarrow$ Semester $\\rightarrow$ Subject) to be discoverable.
    \\item \\textbf{Incoherent Multi-Platform Collaborations:} Most collaboration tools are designed for web browsers or mobile screens, but not both. Synchronizing state, document editing, and room management in real-time across React.js web clients and React Native mobile clients presents complex socket routing challenges.
    \\item \\textbf{Fragmented Study and Career Contexts:} Students must switch between different platforms to read notes, solve previous questions, search for explanations, and seek career roadmaps. There is no integrated system that uses the student's study content to recommend tailored career paths and mock assessments.
    \\item \\textbf{The \"Free-Rider\" Problem in Peer Communities:} Without a reputation system, a small group of users upload notes while the majority only consume, leading to platform stagnation.
\\end{enumerate}

Developing a system that handles these requirements under low-latency constraints presents several architectural challenges:
\\begin{itemize}
    \\item \\textbf{Computational Latency of Document Analysis:} Running multi-layered similarity checks (Winnowing fingerprinting, SimHash near-duplicate check, and live web crawling) on large PDF documents can cause server delays, requiring efficient asynchronous job processing.
    \\item \\textbf{Vector Search Optimization:} Generating, storing, and querying high-dimensional vector embeddings for RAG-based career recommendations requires optimal indexing in PostgreSQL via pgvector.
    \\item \\textbf{Socket Synchronization:} Ensuring reliable, real-time state synchronization across mobile and web clients using Socket.io 4 requires carefully managed connection lifecycles, structured event types, and secure error handling.
\\end{itemize}

To formalize these challenges, we can represent them as distinct system design constraints:
\\begin{enumerate}
    \\item \\textbf{The Lexical Similarity Constraint (Winnowing):} Let $D$ be the set of documents in the database. When a new document $d_{new}$ is uploaded, the system must compute the set of hashes $H(d_{new})$ using a sliding window of size $w$ and k-gram length $k$. It must verify that $|H(d_{new}) \\cap H(d_i)| / |H(d_{new}) \\cup H(d_i)| < \\theta$ for all $d_i \\in D$, where $\\theta$ is the similarity threshold. The challenge lies in executing this check in $O(1)$ or $O(\\log |D|)$ using optimized database indexes.
    \\item \\textbf{The Semantic Vector Constraint (SimHash):} For near-duplicate detection, each document is converted into a 64-bit fingerprint vector. The Hamming distance $d_H(F(d_{new}), F(d_i))$ must be checked to ensure it is greater than a threshold $k$. Executing bitwise calculations across thousands of documents requires native database execution or structured indexing.
    \\item \\textbf{The Real-Time Event Sync Constraint:} Sockets must broadcast state changes with a latency $t < 150\\text{ms}$ to ensure real-time collaboration. The backend must handle socket reconnects, connection pooling, and namespace separation for study rooms.
\\end{enumerate}

\\section{PROPOSED SOLUTION}

To address the defined problems and technical gaps, NoteHub provides a full-stack, cross-platform knowledge-sharing network. The proposed solution is designed around six core architectural pillars:
\\begin{enumerate}
    \\item \\textbf{Multi-Layer Plagiarism and AI Verification Pipeline:} Every document uploaded to NoteHub undergoes a four-step validation sequence. First, the Winnowing algorithm constructs local fingerprints to catch identical text. Second, SimHash analysis detects near-duplicate documents. Third, a sentence-level crawler queries web search APIs to find internet-matching sources. Finally, an LLM verification API (via Google Gemini 2.0 Flash / Mistral) evaluates the note's subject relevance, readability, and syllabus alignment. Notes that fail are automatically flagged, and the uploader is notified with feedback.
    \\item \\textbf{Curriculum-Aligned Digital Repository:} Notes are indexed using a strict five-level hierarchy (Branch, Year, Semester, Subject, and Unit). The web client uses PDF.js to display documents inline with responsive page controls, while the mobile client handles rendering through a native PDF webview.
    \\item \\textbf{RAG-Powered Career Advisor:} A Retrieval-Augmented Generation (RAG) system is built on top of PostgreSQL using the pgvector extension. When a student asks a career question, the system searches the vector database for matching career pathways, job requirements, and average salary metrics, combining this data with the Google Gemini API to construct accurate, curriculum-aware responses.
    \\item \\textbf{Interactive AI Study Suite:} The system provides three AI-driven modules:
    \\begin{itemize}
        \\item \\textbf{SnapSolve (Snap AI):} Students scan a math problem or question using their mobile camera. The image is processed via OCR, and Gemini generates a step-by-step mathematical explanation.
        \\item \\textbf{PYQ Analyzer:} Automatically parses past papers, groups questions by syllabus units, and suggests key topics to focus on.
        \\item \\textbf{Assessment AI:} Dynamically creates custom multiple-choice quizzes based on the notes a student is reading, tracking performance.
    \\end{itemize}
    \\item \\textbf{Real-Time Collaboration Rooms:} Multi-user study rooms are established using Socket.io 4. Features include a live help request board, instant peer messaging, and collaborative document sharing. The chat incorporates profanity filters (using \`leo-profanity\` and \`obscenity\` packages) to maintain a respectful learning environment.
    \\item \\textbf{Gamified Engagement Framework:} An automated script rewards users with contribution points for verified uploads, positive peer reviews, and resolving help requests. These points determine their tier and rank on a global, real-time leaderboard.
\\end{enumerate}

\\begin{figure}[H]
    \\centering
    \\includegraphics[width=0.9\\linewidth]{notehub_system_architecture.png}
    \\caption{NoteHub High-Level System Architecture}
    \\label{fig:system_arch}
\\end{figure}

The system architecture (Figure \\ref{fig:system_arch}) outlines how the web and mobile clients connect to the Express server, which acts as the hub coordinating the PostgreSQL database, Socket.io, Gemini/Mistral APIs, and storage endpoints.

The high-level workflow of NoteHub is as follows:
\\begin{enumerate}
    \\item \\textbf{Authentication and Profile Setup:} Users authenticate using Google OAuth 2.0. The system verifies their credentials, assigns them a student or administrator role, and retrieves their profile details.
    \\item \\textbf{Ingestion and Verification:} A student uploads a note under a specific subject and semester. The backend extracts the text, runs plagiarism check algorithms, and passes it to the AI validator. If verified, the note is stored in Cloudinary/Supabase and indexed in the database.
    \\item \\textbf{Discovery and Interactive Study:} Users search for notes using semantic search. When reading a note, they can launch the Assessment AI to test their understanding, or use SnapSolve to scan and solve specific math formulas.
    \\item \\textbf{Collaboration:} Students join real-time study rooms to discuss notes, share files, and create peer help requests.
\\end{enumerate}

This four-stage process is executed in an asynchronous, event-driven manner. When a file is uploaded, the user interface immediately shows a \"Processing Document\" indicator, freeing the user to continue using the application while backend worker queues execute the CPU-heavy Winnowing and SimHash checks. Once processing is complete, the client UI updates the document state in real-time using Socket.io notifications.

\\section{OBJECTIVES}

The general objective of this project is to develop and deploy a secure, real-time, cross-platform knowledge-sharing ecosystem (NoteHub) that uses multi-layered plagiarism checks and generative AI models to help engineering students share resources, collaborate, and prepare for exams and careers.

The specific, measurable objectives are:
\\begin{enumerate}
    \\item \\textbf{Design and implement frontend clients:} Develop a React.js web client (Vite + TypeScript) and a React Native mobile client (Expo) with consistent styling, smooth transitions, and animated tab navigation.
    \\item \\textbf{Develop an Express backend and PostgreSQL database:} Set up a Node.js REST API server and a PostgreSQL database with a pgvector extension to store relational application data and vector embeddings.
    \\item \\textbf{Implement a multi-layered verification pipeline:} Integrate SimHash duplicate detection, Winnowing fingerprinting, web search scraping, and LLM content validation to ensure document quality and originality.
    \\item \\textbf{Build a RAG career advisor:} Create a Retrieval-Augmented Generation pipeline using Google Gemini 2.0 Flash to provide curriculum-aware career advice, salary estimates, and study roadmaps.
    \\item \\textbf{Incorporate real-time collaboration features:} Implement Socket.io 4 room channels, help board queues, and instant messaging with profanity filtering.
    \\item \\textbf{Build a secure dual Google OAuth system:} Implement Google Sign-In with separate entry pathways for students and whitelisted administrators.
    \\item \\textbf{Build interactive AI tools:} Develop a PYQ Analyzer, SnapSolve mobile camera problem solver, and Assessment AI quiz generator using Gemini APIs.
    \\item \\textbf{Implement a gamification engine:} Develop database trigger scripts to calculate contribution points, award badges, and update leaderboard rankings.
    \\item \\textbf{Apply security best practices:} Implement Helmet security headers, password hashing via bcrypt, inputs validation, and global/auth/AI rate limits.
    \\item \\textbf{Package and deploy using Docker:} Containerize backend services and deploy frontend clients on Vercel and backend APIs on Render.
\\end{enumerate}

Each of these objectives is verified through specific testing criteria: the frontend clients are evaluated for loading speeds and responsive layouts; the verification pipeline is tested against sample copied documents; vector search latencies are monitored to ensure sub-second search times; and the socket server is checked for performance under simulated concurrent user loads.

\\section{SIGNIFICANCE}

The NoteHub platform offers significant value across multiple academic and career domains:

\\subsection{Significance to Students}
NoteHub unifies note-taking, problem-solving, collaboration, and career planning into a single platform. The gamified points system rewards students for their contributions, motivating them to share high-quality notes. Additionally, the RAG-based career advisor translates their course progress into actionable career roadmaps and salary expectations, directly preparing them for the industry.

\\subsection{Significance to Academic Institutions}
For colleges, NoteHub organizes academic materials, prevents duplicate notes, and ensures academic integrity through automated plagiarism scanning. It also provides faculty and administrators with analytics on what topics students find most difficult, enabling data-driven curriculum updates.

\\subsection{Significance to Educational Software Research}
This project demonstrates the practical integration of hybrid plagiarism detection (SimHash + Winnowing) with generative AI models in a single application. It provides a reference implementation for optimizing database vector searches (pgvector) and managing real-time socket sessions across mobile and web clients, showing how to balance processing depth with system speed.

\\subsection{Significance to Society}
NoteHub democratizes access to quality educational resources by offering verified study materials at no cost. This helps students from resource-constrained collegiate environments access high-quality notes compiled by peers in top-tier institutions, bridging the gap in educational quality.

\\section{SCOPE}

The operational boundary of NoteHub is defined to ensure project feasibility and high performance. Table \\ref{tab:scope} outlines the key inclusions and exclusions of the system.

\\begin{table}[H]
\\centering
\\caption{System Scope: Inclusions and Exclusions}
\\label{tab:scope}
\\resizebox{\\textwidth}{!}{%
\\begin{tabular}{|p{3.5cm}|p{7cm}|p{7cm}|}
\\hline
\\textbf{Feature Domain} & \\textbf{Included (In-Scope)} & \\textbf{Excluded (Out-of-Scope)} \\\\
\\hline
\\textbf{Resource Sharing} & Notes, PYQs, solved manuals in PDF and image format; branch/semester indexing. & Commercial document sales; copyrighted textbook distributions. \\\\
\\hline
\\textbf{Collaboration} & Socket.io study rooms, help board, chat messaging, and profanity filtering. & Live video or audio group calls. \\\\
\\hline
\\textbf{AI Guidance} & Gemini 2.0 Flash RAG career advisor, salary estimation, roadmap generator. & Non-academic life counseling; automated resume writing tools. \\\\
\\hline
\\textbf{Verification} & Winnowing check, SimHash, live sentence web search, LLM syllabus validator. & Manual, human-in-the-loop admin validation for every file. \\\\
\\hline
\\textbf{Interactive Tools} & SnapSolve mobile camera OCR solver, PYQ analyzer, Assessment AI quiz generation. & Offline AI processing (requires internet connection for APIs). \\\\
\\hline
\\textbf{User Management} & Google OAuth 2.0, dual-login (admin whitelist), role-based access, JWT. & Third-party integration with institutional college databases. \\\\
\\hline
\\textbf{Gamification} & Points system, contribution badges, real-time leaderboard. & Financial rewards or direct academic grading credits. \\\\
\\hline
\\end{tabular}%
}
\\end{table}

\\subsection{Limitations and Exclusions}
To prevent scope creep, the following parameters are explicitly excluded from the current system release:
\\begin{itemize}
    \\item \\textbf{Network Dependency:} AI modules, database queries, and real-time chat require active internet connectivity; the platform does not support offline write synchronization.
    \\item \\textbf{Document Formats:} The ingestion pipeline is optimized for PDF documents and standard image uploads (JPEG/PNG); audio and video files are not supported.
    \\item \\textbf{Hardware and Capture:} Users are responsible for scanning notes using their mobile cameras; the system does not integrate with stylus hardware or native tablet drawing apps.
    \\item \\textbf{Faculty Integration:} System access is open to students and whitelisted administrators; direct LMS integrations for assigning grades are not supported.
    \\item \\textbf{Automated Content Sourcing:} The platform relies entirely on student uploads and web scraping for plagiarism checks; it does not automatically aggregate textbook publisher content.
\\end{itemize}

\\subsection{Future Scope (Phase II)}
Future developments for NoteHub will expand the platform's capabilities to include:
\\begin{itemize}
    \\item \\textbf{Offline Study Mode:} Local cache synchronization to allow students to read notes and messages offline.
    \\item \\textbf{Video and Audio lecture analysis:} Integrating voice-to-text models to automatically transcribe and summarize video lectures.
    \\item \\textbf{Institutional API Integrations:} Connecting NoteHub to university college servers to verify students' enrollment and course schedules automatically.
\\end{itemize}
`;

  const finalContent = before + newChapter1 + after;
  fs.writeFileSync(filePath, finalContent, 'utf8');
  console.log('Successfully replaced Chapter 1 with super-expanded content in Project Stage II Report.tex');
} catch (err) {
  console.error('Error modifying file:', err);
  process.exit(1);
}
