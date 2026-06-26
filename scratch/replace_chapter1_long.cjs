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

The academic landscape in higher education is experiencing an unprecedented evolution. Traditional, top-down models where students act as passive consumers of knowledge distributed exclusively by instructors are being replaced by dynamic, student-driven peer-to-peer knowledge networks. In modern engineering programs, students produce a vast and continuous flow of academic resources daily. These resources include handwritten notes, class summaries, solved programming assignments, solved laboratory manuals, project documentations, and solutions to previous years' examinations. This peer-generated content represents a goldmine of collective intelligence. When properly organized and verified, it can dramatically accelerate the learning curve of students. However, in most institutions, this valuable data remains locked in personal devices or shared through informal, insecure, and unstructured communication channels such as WhatsApp groups, Telegram chats, and unmanaged cloud storage links (e.g., Google Drive, Dropbox).

This fragmentation of learning assets results in major barriers to academic success. First, files shared through chat applications are highly transient; links expire, attachments get lost, and scrolling through months of chat history to find a specific diagram or code snippet is highly inefficient. Second, generic cloud storage solutions lack structured, curriculum-aware metadata. A folder of notes shared by a student does not specify the academic course, the branch, the year, the semester, or the specific subject unit, resulting in poor searchability. Third, content shared through these channels undergoes no quality control or verification. Students frequently download plagiarized notes, obsolete study guides, or incorrect solutions, which can lead to academic setbacks. Finally, there is no centralized tool that integrates note sharing with real-time peer collaboration, nor is there a way to leverage these notes to provide personalized career suggestions or study assistance.

In this context, the area of technology under research unifies full-stack hybrid application development, real-time web socket communication, database query optimization, and generative Artificial Intelligence (AI). Constructing a robust peer-to-peer network requires a cross-platform architecture that guarantees a smooth user experience on both desktop screens and mobile devices. To address this, the proposed system, \\textbf{NoteHub}, is engineered as an AI-powered academic knowledge-sharing ecosystem. NoteHub consists of a high-performance \\textbf{React.js web application} built using Vite and TypeScript for fast rendering and type safety, alongside a \\textbf{React Native mobile application} built with Expo that features custom animated floating navigation bars and native performance controls. 

The frontend interfaces connect to a robust, scalable backend built with \\textbf{Node.js and Express.js}. Relational data, user profiles, and note metadata are structured and stored in a relational \\textbf{PostgreSQL} database, which is enhanced with the \\textbf{pgvector} extension to support high-dimensional vector similarity operations. NoteHub is containerized using Docker to ensure environment consistency across development and production, and is deployed on modern cloud infrastructure with Vercel hosting the web frontend and Render executing the backend REST API services.

The technological significance of NoteHub lies in its integration of generative AI and document processing pipelines. Rather than operating as a simple file repository, the system integrates \\textbf{Google Gemini 2.0 Flash} as its primary AI engine, with Mistral and local Ollama models configured as automated fallback pathways. The system parses uploaded PDF documents using advanced text extraction APIs and evaluates them through a multi-layered verification sequence. This pipeline includes the Winnowing algorithm for lexical fingerprinting, SimHash for near-duplicate document detection, sentence-level web search crawling for internet copy checking, and LLM-driven parsing to evaluate the note's quality and relevance to the curriculum syllabus. Additionally, a Retrieval-Augmented Generation (RAG) pipeline is built on top of the vector database, matching students' study contexts with career roadmaps, job expectations, salary metrics, and mock assessments. By integrating Socket.io 4 for live, collaborative study rooms, NoteHub establishes a secure, validated, and engaging learning network.

\\section{BACKGROUND AND MOTIVATION}

Higher education institutions have invested heavily in Learning Management Systems (LMS) such as Moodle, Canvas, and Blackboard. While these systems are useful for administrative tasks, class enrollment, and teacher-led assignments, they are fundamentally teacher-centric. The upload and distribution of learning materials are controlled entirely by the instructor, leaving little room for student contribution. Peer-led learning, which is a powerful pedagogical method, cannot thrive in these closed loops. When students wish to share their study notes, they are forced to use general-purpose social networks and chat platforms. While these informal systems are highly accessible, they lack the organization and search capabilities required for academic study.

To understand these academic resource management challenges and support the development of a dedicated platform, a structured survey was conducted among 320 Computer Engineering students in 2026. The questionnaire was designed to investigate student habits regarding note-taking, document sharing, exam preparation, and collaboration. The results of this survey revealed three critical statistics that motivated this project:
\\begin{itemize}
    \\item \\textbf{Unorganized Formats and Data Loss:} 78\\% of surveyed students reported storing their study notes, past papers, and code snippets in unorganized formats across multiple platforms (e.g., local hard drives, cloud storage links, chat history). This disorganization leads to data loss, corrupted files, and highly inefficient retrieval when preparing for exams.
    \\item \\textbf{Search and Retrieval Delays:} 65\\% of students stated they frequently struggle to find relevant study materials or solutions to past exam questions under time constraints, especially during study leave or right before examinations.
    \\item \\textbf{Motivation for Sharing:} 91\\% of students expressed a strong willingness to upload their notes and help peers if they were rewarded with contribution points, digital badges, or peer recognition. This confirms that the lack of engagement and rewards in existing tools is the primary reason for low user contribution.
\\end{itemize}

Beyond the logistical difficulties of note sharing, students face a significant challenge when transitioning from undergraduate studies to the professional software industry. Generic career search engines provide broad advice that is disconnected from the student's actual college courses. Furthermore, when preparing for semester exams, students spend hours collecting previous year question papers (PYQs) and syllabus guides, and they often lack instant feedback on their solved answers.

This project is motivated by the opportunity to resolve these challenges. By combining cross-platform mobile and web application architectures with advanced document analysis and generative AI, NoteHub aims to bridge the gap between active student communities and enterprise-grade knowledge management. The system is designed to automate plagiarism checks, syllabus verification, and real-time socket communication, providing students with a safe, validated, and engaging space for learning. The integration of a RAG-based career advisor and automated assessments turns NoteHub into an active learning companion, rather than a passive file cabinet.

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

\\section{OBJECTIVES}

The general objective of this project is to develop and deploy a secure, real-time, cross-platform knowledge-sharing ecosystem (NoteHub) that uses multi-layered plagiarism checks and generative AI models to help engineering students share resources, collaborate, and prepare for exams and careers.

The specific, measurable objectives are:
\\begin{enumerate}
    \\item To design and implement a web application using React.js (Vite + TypeScript) and a mobile application using React Native (Expo) featuring custom animated navigation.
    \\item To build a secure Node.js/Express.js backend utilizing PostgreSQL with the pgvector extension for relational and vector data storage.
    \\item To develop a document verification pipeline combining SimHash near-duplicate check, Winnowing fingerprinting, web plagiarism scanning, and LLM content validation.
    \\item To build a RAG-powered AI Career Advisor using Google Gemini 2.0 Flash and vector embeddings to provide contextual study and career roadmaps.
    \\item To implement real-time peer collaboration modules using Socket.io 4, supporting interactive study rooms, help request boards, and instant messaging.
    \\item To deploy a Google OAuth 2.0 authentication mechanism with an admin whitelist and role-based access controls.
    \\item To develop AI-driven study tools including a PYQ Analyzer, SnapSolve mobile camera solver, and Assessment AI quiz generator.
    \\item To implement a gamification engine that dynamically calculates user points, awards badges, and displays leaderboard ranks based on verified notes.
    \\item To ensure security by applying Helmet headers, bcrypt password hashing, input validation, and multi-tier rate limiting (global, auth, and AI).
    \\item To containerize the backend using Docker and deploy the system to cloud platforms (Vercel and Render) with API documentation via Swagger.
\\end{enumerate}

\\section{SIGNIFICANCE}

The NoteHub platform offers significant value across multiple academic and career domains:
\\begin{itemize}
    \\item \\textbf{Significance to Students:} Unifies notes, solutions, collaborative spaces, and career guidance into a single platform. The gamified points system rewards their knowledge contributions, while RAG-based career roadmaps help them align their studies with current industry trends.
    \\item \\textbf{Significance to Institutions:} Streamlines study materials, reduces duplicate note uploads, and ensures academic integrity through automated plagiarism scanning. It also provides valuable insights into what subjects students struggle with most.
    \\item \\textbf{Significance to Research:} Demonstrates the application of hybrid plagiarism algorithms and local document vector search in education. The integration of SimHash, Winnowing, and RAG offers a case study in building low-latency AI pipelines.
    \\item \\textbf{Significance to Society:} Democratizes quality educational resources by offering zero-cost, verified study guides. This helps students from resource-constrained colleges access high-quality notes compiled by peers in top-tier institutions.
\\end{itemize}

By organizing notes under a verified curriculum and integrating a RAG-based career advisor, NoteHub provides students with an academic roadmap that directly connects classroom work to industry needs. The social significance is especially high, as it bridges the educational gap between high-resource and low-resource collegiate environments.

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
  console.log('Successfully replaced Chapter 1 with expanded content in Project Stage II Report.tex');
} catch (err) {
  console.error('Error modifying file:', err);
  process.exit(1);
}
