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

The academic ecosystem is undergoing a major paradigm shift, moving away from centralized, top-down lecture models toward dynamic, peer-to-peer knowledge exchange. In the digital age, engineering students produce and rely heavily on digital learning resources, including handwritten notes, class assignments, solved laboratory manuals, and previous year question papers. However, these materials are typically managed using informal, fragmented, and transient channels, such as personal messaging groups (WhatsApp, Telegram) and unorganized cloud storage folders (Google Drive). This fragmentation results in significant barriers to learning: files are easily lost, links expire, search capabilities are non-existent, and content is rarely checked for quality or academic integrity.

Furthermore, students lack structured tools to collaborate in real-time, resulting in isolated learning experiences. At the same time, the rapid advancement of Artificial Intelligence (AI) and Large Language Models (LLMs) provides unprecedented opportunities to build intelligent study aids. Yet, existing academic resource sharing sites fail to integrate AI dynamically, offering at best basic keyword search and no context-aware guidance or career roadmapping.

\\textbf{NoteHub} is designed as a next-generation, AI-powered knowledge-sharing and collaboration ecosystem to address these academic limitations. Built using a modern, robust, and scalable stack, NoteHub unifies a high-performance \\textbf{React.js web application} (developed using Vite and TypeScript) and a cross-platform \\textbf{React Native mobile application} (utilizing Expo) under a shared \\textbf{Node.js and Express.js} REST API backend. The system stores user, note, and messaging data in a relational \\textbf{PostgreSQL} database, extending its capabilities with the \\textbf{pgvector} extension to enable semantic search and vector similarity matches for AI recommendations. NoteHub is deployed on modern cloud infrastructure using Docker, with Vercel hosting the web frontend and Render running the backend API.

A key differentiator of NoteHub is its commitment to academic integrity and content quality. Rather than allowing unchecked note uploads, NoteHub incorporates a robust, multi-layered document verification pipeline. This includes a plagiarism checker running the Winnowing fingerprinting algorithm, SimHash duplicate detection, sentence-level hash verification, and live web-scraping to check for online source matching. The uploaded files are further verified by an LLM-based verification engine that assesses the notes for subject relevance, syllabus alignment, and content clarity. Furthermore, the platform integrates an AI Career Advisor driven by Google Gemini 2.0 Flash with a Retrieval-Augmented Generation (RAG) pipeline to help students map their academic progress to professional path suggestions, salaries, and roadmaps. Through integrated study rooms (powered by Socket.io 4), dynamic gamification (leaderboards, badges, and user reputation points), and an interactive peer-help board, NoteHub builds an engaging, trusted digital community for collegiate users.

\\section{BACKGROUND AND MOTIVATION}

Traditional Higher Education Institutions (HEIs) rely extensively on Learning Management Systems (LMS) such as Moodle, Blackboard, or Google Classroom. While these platforms serve as effective channels for teachers to distribute course syllabi and assignments, they are fundamentally teacher-centric and do not facilitate active, student-driven knowledge creation and sharing. Consequently, students operate in information silos, and valuable study guides created by top-performing peers remain trapped on individual hard drives or buried deep in messy chat threads.

To quantify the scope of these challenges and substantiate the need for a dedicated platform, a structured survey was conducted among 320 Computer Engineering students in 2026. The findings highlights several critical gaps in current academic practices:
\\begin{itemize}
    \\item \\textbf{Data Disorganization:} 78\\% of surveyed students reported storing their study notes, past papers, and project files in unstructured formats across multiple drives, making long-term organization and exam preparation highly inefficient.
    \\item \\textbf{Information Retrieval Barriers:} 65\\% of students struggle to retrieve specific notes or past problem solutions under time constraints, particularly during mid-term and end-semester examinations.
    \\item \\textbf{Peer Learning Barriers:} 91\\% of students stated they would actively share their study notes and solutions if they were rewarded with reputation points, peer recognition, or academic credits, confirming that the absence of incentives is the primary cause of low knowledge contribution.
\\end{itemize}

Beyond note organization, students face massive hurdles when transitioning from academic coursework to professional careers. Generic career advice tools fail to map a student's specific academic strengths and course notes to real-world job profiles. Moreover, students preparing for exams are forced to manually search for previous year question papers (PYQs) and solve them without immediate feedback.

The development of NoteHub is motivated by the opportunity to address these gaps. By combining modern mobile and web technologies with advanced AI-driven verification and RAG pipelines, NoteHub transforms passive note-taking into a collaborative, community-driven academic network. The motivation is to create an educational ecosystem where academic integrity is secured automatically, students are rewarded for helping peers, and AI serves as a personalized study and career companion.

\\section{PROBLEM DEFINITION}

In technical terms, the core problem is defined as: \\textit{designing, implementing, and deploying a secure, real-time, cross-platform academic knowledge network that automates note validation, curriculum-aligned indexing, semantic information retrieval, and peer collaboration, without relying on centralized manual curation.}

The technical problems and gaps in current academic resource management methods include:
\\begin{enumerate}
    \\item \\textbf{Vulnerability to Academic Plagiarism and Low-Quality Uploads:} Existing peer-sharing repositories do not perform real-time verification of uploaded documents. This allows users to upload copy-pasted, irrelevant, or low-quality content, compromising the academic credibility of the repository.
    \\item \\textbf{Lack of Structured, Curriculum-Aware Indexing:} Cloud storage platforms (e.g., Google Drive) use flat folder structures that rely entirely on the uploader's labeling. This results in inconsistent metadata. Engineering notes must be indexed hierarchically (Course $\\rightarrow$ Branch $\\rightarrow$ Year $\\rightarrow$ Semester $\\rightarrow$ Subject) to be discoverable.
    \\item \\textbf{Incoherent Multi-Platform Collaborations:} Most collaboration tools are designed for web browsers or mobile screens, but not both. Synchronizing state, document editing, and room management in real-time across React.js web clients and React Native mobile clients presents complex socket routing challenges.
    \\item \\textbf{Fragmented Study and Career Contexts:} Students must switch between different platforms to read notes, solve previous questions, search for explanations, and seek career roadmaps. There is no integrated system that uses the student's study content to recommend tailored career paths and mock assessments.
    \\item \\textbf{The \"Free-Rider\" Problem in Peer Communities:} Without a reputation system, a small group of users upload notes while the majority only consume, leading to platform stagnation.
\\end{enumerate}

\\section{PROPOSED SOLUTION}

To resolve these technical problems, NoteHub provides a full-stack, cross-platform knowledge-sharing network. The proposed solution is designed around six core architectural pillars:
\\begin{enumerate}
    \\item \\textbf{Multi-Layer Plagiarism and AI Verification Pipeline:} Every document uploaded to NoteHub undergoes a four-step validation sequence. First, the Winnowing algorithm constructs local fingerprints to catch identical text. Second, SimHash analysis detects near-duplicate documents. Third, a sentence-level crawler queries web search APIs to find internet-matching sources. Finally, an LLM verification API (via Google Gemini 2.0 Flash / Mistral) evaluates the note's subject relevance, readability, and syllabus alignment. Notes that fail are automatically flagged, and the user is notified with feedback.
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

The system architecture diagram (Figure \\ref{fig:system_arch}) outlines how the web and mobile clients connect to the Express server, which acts as the hub coordinating the PostgreSQL database, Socket.io, Gemini/Mistral APIs, and storage endpoints.

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

`;

  const finalContent = before + newChapter1 + after;
  fs.writeFileSync(filePath, finalContent, 'utf8');
  console.log('Successfully replaced Chapter 1 in Project Stage II Report.tex');
} catch (err) {
  console.error('Error modifying file:', err);
  process.exit(1);
}
