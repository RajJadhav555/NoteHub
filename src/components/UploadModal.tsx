import React, { useState, useEffect } from "react";
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Shield,
  ShieldAlert,
  Search,
  Sparkles,
  Loader2,
  Globe,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Database,
  BookOpen,
  Clock,
  ShieldOff,
} from 'lucide-react/dist/esm/lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

// Define Subjects Data
const SUBJECTS_DATA: Record<string, Record<string, string[]>> = {
  "Computer Engineering": {
    "Semester 1": ["Engineering Mathematics I", "Engineering Physics", "Systems in Mechanical Engineering", "Basic Electrical Engineering", "Programming and Problem Solving"],
    "Semester 2": ["Engineering Mathematics II", "Engineering Chemistry", "Basic Electronics Engineering", "Engineering Mechanics", "Graphics"],
    "Semester 3": ["Discrete Mathematics", "Fundamentals of Data Structures", "Object Oriented Programming (OOP)", "Computer Graphics", "Digital Electronics and Logic Design"],
    "Semester 4": ["Engineering Mathematics III", "Data Structures and Algorithms", "Software Engineering", "Microprocessor", "Principles of Programming Languages"],
    "Semester 5": ["Database Management Systems", "Theory of Computation", "Systems Programming and Operating System", "Computer Networks", "Human Computer Interaction"],
    "Semester 6": ["Data Science and Big Data Analytics", "Web Technology", "Artificial Intelligence", "Cloud Computing", "Software Modeling and Design"],
    "Semester 7": ["Information Security", "Machine Learning", "Design and Analysis of Algorithms", "High Performance Computing", "Elective I"],
    "Semester 8": ["Distributed Systems", "Deep Learning", "Elective III", "Elective IV", "Project Phase II"],
  },
  "AIML Engineering": {
    "Semester 1": ["Engineering Mathematics I", "Physics", "Chemistry", "Basic Computations", "Introduction to AI"],
    "Semester 3": ["Linear Algebra", "Data Structures", "Python for Data Science", "OOP in C++", "Computer Organization"],
  },
  "AIDS": {
    "Semester 1": ["Calculus", "Probability", "Intro to DS", "Basic Programming", "Communication Skills"],
  },
  "E&TC Engineering": {
    "Semester 1": ["Mathematics I", "Physics", "Electronic Circuits", "Signals and Systems", "Network Theory"],
  },
  "Civil Engineering": {
    "Semester 1": ["Mathematics I", "Mechanics", "Surveying", "Building Construction", "Fluid Mechanics"],
  },
};

// ─────────────────────────────────────────────────────────────────────
// Sub-components for the Plagiarism Report
// ─────────────────────────────────────────────────────────────────────

function ScoreRing({ score, color }: { score: number; color: string }) {
  const plagScore = Number((100 - score).toFixed(1));
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (plagScore / 100) * circumference;
  return (
    <div className="relative flex items-center justify-center w-24 h-24 shrink-0">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={radius} className="stroke-gray-700" strokeWidth="7" fill="transparent" />
        <circle cx="40" cy="40" r={radius} stroke={color} strokeWidth="7" fill="transparent"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out drop-shadow-[0_0_6px_rgba(255,255,255,0.2)]"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black" style={{ color }}>{plagScore}%</span>
        <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Copied</span>
      </div>
    </div>
  );
}

function WebSourcesPanel({ webSources }: { webSources: any[] }) {
  const [expanded, setExpanded] = useState(false);
  if (!webSources || webSources.length === 0) return null;

  return (
    <div className="mt-3 border border-amber-500/30 rounded-xl overflow-hidden bg-gray-800/60">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-700/40 transition"
      >
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            {webSources.length} Web Source{webSources.length !== 1 ? 's' : ''} Found
          </span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {expanded && (
        <div className="divide-y divide-gray-700/50">
          {webSources.map((item, i) => (
            <div key={i} className="p-3 space-y-1.5">
              <p className="text-[11px] text-gray-300 italic leading-relaxed border-l-2 border-amber-500/50 pl-2">
                "{item.sentence?.substring(0, 150)}{item.sentence?.length > 150 ? '…' : ''}"
              </p>
              <div className="space-y-1 mt-1.5">
                {item.sources?.map((src: any, j: number) => (
                  <a
                    key={j}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-1.5 group"
                  >
                    <ExternalLink className="w-3 h-3 text-blue-400 shrink-0 mt-0.5 group-hover:text-blue-300 transition" />
                    <span className="text-[11px] text-blue-400 group-hover:text-blue-300 group-hover:underline transition line-clamp-1">
                      {src.title || src.url}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InternalMatchesPanel({ details }: { details: any[] }) {
  const [expanded, setExpanded] = useState(false);
  if (!details || details.length === 0) return null;

  return (
    <div className="mt-3 border border-purple-500/30 rounded-xl overflow-hidden bg-gray-800/60">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-700/40 transition"
      >
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
            {details.length} Internal Note Match{details.length !== 1 ? 'es' : ''}
          </span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {expanded && (
        <div className="divide-y divide-gray-700/50">
          {details.slice(0, 5).map((match: any, i: number) => (
            <div key={i} className="p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3 text-purple-400" />
                  <span className="text-[11px] font-semibold text-purple-300 line-clamp-1">{match.title}</span>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  match.similarity >= 60 ? 'bg-red-900/50 text-red-300' :
                  match.similarity >= 30 ? 'bg-amber-900/50 text-amber-300' :
                  'bg-gray-700 text-gray-300'
                }`}>{match.similarity}% match</span>
              </div>
              <div className="grid grid-cols-3 gap-1 mt-1.5">
                {[
                  { label: 'Word', val: match.wordSim },
                  { label: 'Sentence', val: match.sentenceSim },
                  { label: 'Paragraph', val: match.paragraphSim },
                ].map(l => (
                  <div key={l.label} className="text-center">
                    <div className="text-[9px] text-gray-500 uppercase">{l.label}</div>
                    <div className="text-[11px] font-bold text-gray-300">{l.val}%</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PlagiarismReportCard({ plagData }: { plagData: any }) {
  if (!plagData || !plagData.verdict) return null;

  const isOriginal = plagData.verdict === 'original';
  const isSuspicious = plagData.verdict === 'suspicious';
  const theme = isOriginal
    ? { color: '#34d399', textClass: 'text-emerald-400', border: 'border-emerald-500/30', bgClass: 'bg-emerald-900/10' }
    : isSuspicious
    ? { color: '#fbbf24', textClass: 'text-amber-400', border: 'border-amber-500/30', bgClass: 'bg-amber-900/10' }
    : { color: '#f87171', textClass: 'text-red-400', border: 'border-red-500/30', bgClass: 'bg-red-900/10' };

  const webData = plagData.web || null;

  return (
    <div className={`rounded-2xl border ${theme.border} bg-gray-900 relative overflow-hidden shadow-2xl`}>
      {/* Animated scan line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent animate-scan-line pointer-events-none" />

      <div className="p-5 relative z-10">
        {/* Header row: Score + Verdict */}
        <div className="flex items-start gap-4 mb-5">
          <ScoreRing score={plagData.score} color={theme.color} />
          <div className="flex-1 pt-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className={`text-lg font-black tracking-wide uppercase ${theme.textClass} flex items-center gap-2`}>
                {isOriginal ? <Shield className="w-5 h-5 shrink-0" /> : <ShieldAlert className="w-5 h-5 shrink-0" />}
                {plagData.verdict}
              </h4>
              <span className="text-[10px] text-gray-400 font-mono border border-gray-700 px-2 py-0.5 rounded-full bg-gray-800/50">
                {plagData.engine ? plagData.engine.match(/v[\d.]+/)?.[0] || 'ENGINE v3.1' : 'ENGINE v3.1'}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Similarity Analysis{plagData.maxSimilarity > 0 ? ` • Max overlap: ${Number(plagData.maxSimilarity).toFixed(1)}%` : ''}
            </p>
            {plagData.matchedNoteTitle && (
              <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                Closest match: <span className="text-gray-300">"{plagData.matchedNoteTitle}"</span>
              </p>
            )}
          </div>
        </div>

        {/* Layer breakdown */}
        {plagData.layerScores && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: 'Word Match', score: Number((100 - (plagData.layerScores.word || 100)).toFixed(1)), icon: '📝' },
              { label: 'Sentence Match', score: Number((100 - (plagData.layerScores.sentence || 100)).toFixed(1)), icon: '📄' },
              { label: 'Paragraph Match', score: Number((100 - (plagData.layerScores.paragraph || 100)).toFixed(1)), icon: '📑' },
            ].map((layer) => {
              const c = layer.score <= 30 ? '#34d399' : layer.score <= 60 ? '#fbbf24' : '#f87171';
              return (
                <div key={layer.label} className="bg-gray-800/80 rounded-xl p-2.5 border border-gray-700/50">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{layer.label}</p>
                    <span className="text-xs">{layer.icon}</span>
                  </div>
                  <p className="text-lg font-black text-white mb-1.5">{layer.score}%</p>
                  <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${layer.score}%`, backgroundColor: c, boxShadow: `0 0 6px ${c}` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Reasoning */}
        <p className="text-[11px] text-gray-400 italic leading-relaxed mb-3">{plagData.reasoning}</p>

        {/* Web Check Section */}
        {webData && webData.enabled && (
          <div className={`rounded-xl border p-3 mb-3 ${
            webData.verdict === 'plagiarized' ? 'border-red-500/30 bg-red-900/10' :
            webData.verdict === 'suspicious' ? 'border-amber-500/30 bg-amber-900/10' :
            'border-emerald-500/30 bg-emerald-900/10'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Web Crawl ({webData.engine?.toUpperCase() || 'SEARCH'})
              </span>
              <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                webData.verdict === 'plagiarized' ? 'bg-red-900/50 text-red-300' :
                webData.verdict === 'suspicious' ? 'bg-amber-900/50 text-amber-300' :
                'bg-emerald-900/50 text-emerald-300'
              }`}>{webData.verdict?.toUpperCase()}</span>
            </div>
            {webData.reasoning?.includes('[AI Zero-Shot Analysis]') ? (
                <p className="text-[11px] text-gray-400">
                  Exact Web Matches: {webData.matchedSentences}/{webData.totalChecked} • <strong>AI Paraphrasing Estimate: {Number((100 - (webData.score || 100)).toFixed(1))}%</strong>
                </p>
            ) : (
                <p className="text-[11px] text-gray-400">
                  {webData.matchedSentences}/{webData.totalChecked} sentences found online • Copied: {Number((100 - (webData.score || 100)).toFixed(1))}%
                </p>
            )}
            <p className="text-[10px] text-gray-500 mt-0.5 italic">{webData.reasoning}</p>
            {/* Web sources expand panel */}
            <WebSourcesPanel webSources={webData.webSources || []} />
          </div>
        )}

        {/* Not configured notice */}
        {webData && !webData.enabled && webData.verdict !== 'skipped' && (
          <div className="rounded-xl border border-gray-700/50 bg-gray-800/40 p-3 mb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-[10px] text-gray-500">Web check: {webData.reasoning}</span>
            </div>
          </div>
        )}

        {/* Internal matches panel */}
        {plagData.details && plagData.details.length > 0 && (
          <InternalMatchesPanel details={plagData.details} />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Main Upload Modal
// ─────────────────────────────────────────────────────────────────────

export function UploadModal({ isOpen, onClose, onUploadComplete, userProfile }) {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [thumbnailBlob, setThumbnailBlob] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [status, setStatus] = useState("idle"); 
  const [uploadProgress, setUploadProgress] = useState(0);
  const [aiResult, setAiResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [scanPhase, setScanPhase] = useState(0); 
  const [viewMode, setViewMode] = useState<'form' | 'scanning' | 'report'>('form');
  const [plagReport, setPlagReport] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    course: "Computer Engineering",
    year: "First Year",
    semester: "Semester 1",
    subject: "",
  });

  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setFiles([]);
      setPreviewUrls([]);
      setThumbnailBlob(null);
      setStatus("idle");
      setUploadProgress(0);
      setAiResult(null);
      setErrorMsg("");
      setFormData({
        title: "",
        course: "Computer Engineering",
        year: "First Year",
        semester: "Semester 1",
        subject: "",
      });
      setScanPhase(0);
      setViewMode('form');
      setPlagReport(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const subjects = SUBJECTS_DATA[formData.course]?.[formData.semester] || [];
    setAvailableSubjects(subjects);
    if (!subjects.includes(formData.subject)) {
      setFormData(prev => ({ 
        ...prev, 
        subject: subjects.length > 0 ? subjects[0] : "" 
      }));
    }
  }, [formData.course, formData.semester]);

  const generateThumbnail = async (file) => {
      try {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 1.0 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({ canvasContext: context, viewport: viewport } as any).promise;
          return new Promise((resolve) => {
              canvas.toBlob((blob) => resolve(blob), 'image/png');
          });
      } catch (e) {
          console.error("Thumbnail generation failed:", e);
          return null;
      }
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(Array.from(e.dataTransfer.files));
  };

  const handleFileSelect = async (selectedFiles: FileList | File[]) => {
    // Check supported types
    const validFiles = Array.from(selectedFiles).filter((f: File) => {
        const ext = f.name.split('.').pop()?.toLowerCase();
        return ext && ['pdf', 'docx', 'pptx', 'csv', 'xml', 'txt'].includes(ext);
    });

    if (validFiles.length > 0) {
        setFiles(prev => [...prev, ...validFiles]);
        setErrorMsg("");
        
        const newPreviewUrls = validFiles.map(f => URL.createObjectURL(f));
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
        
        // Generate thumbnail for the first PDF if available
        const pdfFile = validFiles.find((f: File) => f.type === "application/pdf" || f.name.endsWith(".pdf"));
        if (!thumbnailBlob && pdfFile) {
            const thumb = await generateThumbnail(pdfFile);
            if (thumb) setThumbnailBlob(thumb);
        }
        
        if (!formData.title) {
            setFormData(prev => ({ ...prev, title: validFiles[0].name.replace(/\.[^/.]+$/, "") }));
        }
    } else {
        setErrorMsg("Please upload valid files (.pdf, .docx, .pptx, .csv, .xml, .txt).");
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    if (!formData.title.trim()) { alert("Please enter a title."); return; }

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    try {
        setViewMode('scanning');
        setStatus("uploading");
        setPlagReport(null);
        
        // Phase 1: Uploading
        setScanPhase(1); 
        setUploadProgress(15);
        await wait(1200);

        const data = new FormData();
        files.forEach(f => data.append("files", f));
        if (thumbnailBlob) data.append("thumbnail", thumbnailBlob, "thumbnail.png");
        data.append("title", formData.title);
        data.append("subject", formData.subject);
        data.append("semester", formData.semester);
        data.append("course", formData.course);
        data.append("year", formData.year);
        const finalName = userProfile?.name || (userProfile?.email ? userProfile.email.split('@')[0] : "Anonymous");
        data.append("uploaderName", finalName);
        data.append("uploaderId", userProfile?.id || "");

        // Phase 2: Internal Plagiarism
        setScanPhase(2);
        setUploadProgress(35);
        await wait(1800);

        const token = sessionStorage.getItem('notehub_token');
        const uploadHeaders: Record<string,string> = {};
        if (token) uploadHeaders['Authorization'] = `Bearer ${token}`;
        const apiPromise = fetch(`/api/notes/upload`, {
            method: "POST",
            headers: uploadHeaders,
            body: data
        });

        // Phase 3: Web-Source Deep Crawl
        setScanPhase(3);
        setUploadProgress(55);
        await wait(3000);

        // Phase 4: AI Context Verification
        setScanPhase(4);
        setUploadProgress(75);
        await wait(1800);

        const response = await apiPromise;
        setScanPhase(5);

        if (!response.ok) {
            let errorText = "Upload failed";
            let plagiarismData = null;
            try {
                const errData = await response.json();
                errorText = errData.error || errData.message || "Upload failed";
                if (errData.plagiarism) plagiarismData = errData.plagiarism;
            } catch (e) {
                const text = await response.text();
                if (text) errorText = text;
            }
            if (plagiarismData) setPlagReport(plagiarismData);
            setUploadProgress(100);
            setStatus("error");
            setErrorMsg(errorText);
            setViewMode('report');
            return;
        }

        const result = await response.json();
        setUploadProgress(100);
        const uploadedNote = result.notes[0];
        setAiResult(uploadedNote);

        // Extract plagiarism report from the note
        if (uploadedNote.plagiarism_details) {
            try {
                const pd = typeof uploadedNote.plagiarism_details === 'string'
                    ? JSON.parse(uploadedNote.plagiarism_details)
                    : uploadedNote.plagiarism_details;
                setPlagReport(pd);
            } catch(e) {}
        }

        if (uploadedNote.verification_status === 'rejected') {
            setScanPhase(5);
            setUploadProgress(100);
            setStatus("error");
            let reason = "Context quality requirements not met.";
            try {
                const details = typeof uploadedNote.verification_details === 'string' 
                    ? JSON.parse(uploadedNote.verification_details) 
                    : uploadedNote.verification_details;
                if (details) {
                    if (details.error) reason = details.error;
                    else if (details.plagiarism) reason = `Plagiarism: ${details.plagiarism}`;
                    else if (details.redundancy_score === 0) reason = `Duplicate Content: ${details.reasoning?.redundancy || "This file already exists."}`;
                    else if (details.quality_score < 40) reason = `Low Quality: ${details.reasoning?.quality || "File deemed unusable/low effort."}`;
                    else if (details.appropriateness_score < 80) reason = "Inappropriate Content Detected.";
                }
            } catch(e) {}
            setErrorMsg(`Upload Rejected: ${reason}`);
            setViewMode('report');
        } else if (uploadedNote.verification_status === 'manual_review') {
            setScanPhase(5);
            setUploadProgress(100);
            setStatus("pending");
            let reason = "Authenticity verification required.";
            try {
                const details = typeof uploadedNote.verification_details === 'string' 
                    ? JSON.parse(uploadedNote.verification_details) 
                    : uploadedNote.verification_details;
                if (details && (details.error || details.reason)) reason = details.error || details.reason;
            } catch(e) {}
            setErrorMsg(reason);
            setViewMode('report');
            setTimeout(() => { onUploadComplete(uploadedNote); }, 3000);
        } else {
            setScanPhase(5);
            setUploadProgress(100);
            setStatus("success");
            setViewMode('report');
            setTimeout(() => { onUploadComplete(uploadedNote); }, 5000);
        }
    } catch (error) {
        setScanPhase(5);
        setUploadProgress(100);
        setStatus("error");
        setErrorMsg(error.message || "Failed to upload note.");
        setViewMode('report');
    }
  };

  if (!isOpen) return null;

  if (viewMode === 'scanning' || viewMode === 'report') {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col animate-fade-in overflow-hidden font-sans bg-stone-50 dark:bg-stone-950 transition-colors duration-500">
        
        {/* Soft Animated Background Orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

        {/* Clean Top Navbar */}
        <div className="relative z-10 w-full px-6 md:px-12 py-6 flex justify-between items-center bg-white/40 dark:bg-black/20 backdrop-blur-xl border-b border-stone-200/50 dark:border-stone-800/50">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white dark:bg-stone-900 rounded-2xl flex items-center justify-center shadow-sm border border-stone-200 dark:border-stone-800">
                 <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                 <h2 className="text-xl lg:text-3xl font-black text-stone-900 dark:text-white tracking-tight">NoteHub Originality Engine</h2>
                 <div className="flex items-center gap-2 mt-1">
                   <div className="relative flex h-2.5 w-2.5">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                   </div>
                   <p className="text-xs lg:text-sm text-stone-500 dark:text-stone-400 font-medium tracking-wide border-l border-stone-300 dark:border-stone-700 pl-2">System Active</p>
                 </div>
              </div>
           </div>
           {(status === 'success' || status === 'error' || status === 'pending') && (
              <button onClick={() => { 
                setViewMode('form'); 
                setStatus('idle'); 
                setPlagReport(null); 
                if ((status === 'success' || status === 'pending') && aiResult) {
                  onUploadComplete?.(aiResult);
                }
                onClose(); 
              }} className="px-6 py-2.5 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-xl text-sm font-semibold shadow-sm border border-stone-200 dark:border-stone-700 transition-all active:scale-95 flex items-center gap-2">
                <X className="w-4 h-4" /> Close
              </button>
           )}
        </div>

        {/* Main Content Area */}
        <div className="relative z-10 flex-1 w-full max-w-7xl mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-8 lg:gap-16 items-center justify-center overflow-y-auto">
            
            {/* Left Side: Scan Progress Card */}
            <div className={`w-full lg:w-5/12 flex flex-col gap-6 transition-all duration-1000 ${viewMode === 'report' ? 'opacity-40 lg:opacity-70 scale-95 blur-sm hover:blur-none hover:opacity-100' : 'opacity-100 scale-100'}`}>
               <div className="bg-white/70 dark:bg-stone-900/70 border border-stone-200/50 dark:border-stone-800/50 rounded-3xl p-8 shadow-xl backdrop-blur-2xl">
                   <div className="flex items-center justify-between mb-8">
                       <h3 className="text-stone-800 dark:text-stone-200 text-lg font-bold tracking-tight">Verification Progress</h3>
                       <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-full">
                           {uploadProgress}%
                       </div>
                   </div>

                   {/* Progress Track */}
                   <div className="relative space-y-6">
                       {/* Connecting line */}
                       <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-stone-100 dark:bg-stone-800 -z-10 rounded-full" />
                       <div className="absolute left-6 top-6 w-[2px] bg-indigo-500 -z-10 rounded-full transition-all duration-700 ease-out" style={{ height: `${Math.max(0, (scanPhase - 1) * 25)}%` }} />

                       {[
                           { label: 'Initializing Upload', desc: 'Securely transferring document', icon: Upload, phase: 1 },
                           { label: 'Database Verification', desc: 'Checking against millions of notes', icon: Database, phase: 2 },
                           { label: 'Web Originality Crawl', desc: 'Scanning global internet sources', icon: Globe, phase: 3 },
                           { label: 'AI Contextual Analysis', desc: 'Analyzing legitimacy & authenticity', icon: Sparkles, phase: 4 },
                           { label: status === 'error' ? 'Analysis Failed' : 'Report Generated', desc: status === 'error' ? 'Validation error occurred' : 'Successfully compiled results', icon: status === 'error' ? AlertCircle : CheckCircle, phase: 5 },
                       ].map((step, idx) => {
                           const isDone = scanPhase > step.phase || (scanPhase >= step.phase && (status === 'success' || status === 'error' || status === 'pending'));
                           const isActive = scanPhase === step.phase && status !== 'success' && status !== 'error' && status !== 'pending';
                           const isError = isDone && status === 'error' && step.phase === 5;
                           const isPending = isDone && status === 'pending' && step.phase === 5;
                           
                           return (
                               <div key={step.phase} className={`flex items-start gap-5 transition-all duration-500 ${isActive ? 'opacity-100 translate-x-1' : isDone ? 'opacity-80' : 'opacity-40 grayscale'}`}>
                                   <div className={`relative shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300 ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : isDone ? (isError ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : isPending ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600') : 'bg-stone-100 dark:bg-stone-800 text-stone-400'}`}>
                                       {isActive ? <Loader2 className="w-5 h-5 animate-spin" /> : isPending ? <Clock className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                                       {isActive && <div className="absolute inset-0 border-2 border-indigo-400 rounded-2xl animate-ping opacity-20" />}
                                   </div>
                                   <div className="flex-1 pt-1.5">
                                       <div className={`text-base font-bold tracking-tight ${isActive ? 'text-stone-900 dark:text-white' : isDone ? (isError ? 'text-red-700 dark:text-red-400' : isPending ? 'text-amber-700 dark:text-amber-400' : 'text-stone-700 dark:text-stone-300') : 'text-stone-500'}`}>
                                           {step.label}
                                       </div>
                                       <div className="text-sm font-medium text-stone-500 dark:text-stone-400 mt-0.5">
                                            {isDone ? (isError ? 'Halted' : 'Completed seamlessly') : isActive ? 'Processing...' : step.desc}
                                       </div>
                                   </div>
                               </div>
                           )
                       })}
                   </div>
               </div>
            </div>

            {/* Right Side: Results / Report */}
            <div className={`w-full lg:w-7/12 flex flex-col items-center justify-center transition-all duration-1000 ${viewMode === 'report' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95 pointer-events-none absolute lg:relative'}`}>
               {status === 'error' && errorMsg && (
                    <div className="w-full max-w-2xl p-6 bg-white/70 dark:bg-stone-900/70 border border-red-200 dark:border-red-900/30 rounded-3xl flex items-start gap-5 backdrop-blur-2xl shadow-xl mb-6">
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 shrink-0">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div className="pt-1">
                            <h3 className="text-lg font-bold text-stone-900 dark:text-white tracking-tight mb-1">Upload Declined</h3>
                            <p className="text-sm text-stone-600 dark:text-stone-300 font-medium leading-relaxed">{errorMsg}</p>
                        </div>
                    </div>
               )}

               {status === 'pending' && errorMsg && (
                    <div className="w-full max-w-2xl p-6 bg-white/70 dark:bg-stone-900/70 border border-amber-200 dark:border-amber-900/30 rounded-3xl flex items-start gap-5 backdrop-blur-2xl shadow-xl mb-6">
                        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-600 shrink-0">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div className="pt-1">
                            <h3 className="text-lg font-bold text-stone-900 dark:text-white tracking-tight mb-1">Under AI Review</h3>
                            <p className="text-sm text-stone-600 dark:text-stone-300 font-medium leading-relaxed">{errorMsg}</p>
                            <div className="mt-3 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Handwritten/Scanned documents are being verified for academic legitimacy.
                            </div>
                        </div>
                    </div>
               )}
               
               {plagReport ? (
                   <div className="w-full transform transition-all duration-700 lg:scale-[1.05] max-w-2xl mx-auto shadow-2xl rounded-3xl overflow-hidden ring-1 ring-stone-200/50 dark:ring-stone-800/50">
                       <PlagiarismReportCard plagData={plagReport} />
                   </div>
               ) : (status === 'success' && viewMode === 'report' && !plagReport) ? (
                    <div className="w-full max-w-2xl p-12 rounded-3xl border border-stone-200/50 dark:border-stone-800/50 bg-white/70 dark:bg-stone-900/70 backdrop-blur-2xl relative overflow-hidden shadow-2xl mx-auto">
                         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-400" />
                         <div className="relative z-10 flex flex-col items-center text-center gap-6">
                            <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-full border border-emerald-100 dark:border-emerald-900/40 text-emerald-500 ring-8 ring-emerald-50 dark:ring-emerald-900/10 mb-2">
                                <ShieldCheck className="w-12 h-12" />
                            </div>
                            <div>
                                <h4 className="text-3xl font-black text-stone-900 dark:text-white tracking-tight">Verified Original Content</h4>
                                <p className="text-lg text-stone-500 dark:text-stone-400 mt-3 font-medium leading-relaxed max-w-md mx-auto">
                                    Our semantic engines found no significant matches online or in our internal database.
                                </p>
                            </div>
                         </div>
                    </div>
               ) : null}
            </div>

        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-2xl w-full max-w-2xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50/50 dark:bg-stone-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${status === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
               {status === 'success' ? <CheckCircle className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
            </div>
            <div>
                <h3 className="font-bold text-lg text-stone-900 dark:text-white">
                  {status === 'success' ? 'Submitted for Review' : 'Upload Note'}
                </h3>
                <p className="text-xs text-stone-500">
                  {status === 'uploading' ? 'Running plagiarism detection…' : 'Share knowledge with peers'}
                </p>
            </div>
          </div>
          {status !== 'uploading' && (
             <button onClick={onClose} className="p-2 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-full transition">
               <X className="w-5 h-5 text-stone-500" />
             </button>
          )}
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
            {status === 'error' && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm">{errorMsg}</p>
                </div>
            )}

            {/* ── FORM VIEW ── */}
            {viewMode === 'form' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="block text-sm font-bold text-stone-700 dark:text-stone-300">Documents</label>
                        <span className="text-xs text-stone-500">{files.length > 0 ? `${files.length} file(s) selected` : ''}</span>
                    </div>
                    {files.length === 0 ? (
                        <div onClick={() => fileInputRef.current?.click()} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all ${isDragOver ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" : "border-stone-300 dark:border-stone-700 hover:border-indigo-400 hover:bg-stone-50 dark:hover:bg-stone-800/50" }`}>
                            <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mb-4">
                               <Upload className="w-8 h-8 text-indigo-500" />
                            </div>
                            <p className="font-medium text-stone-700 dark:text-stone-300">Click to upload or drag & drop</p>
                            <p className="text-xs text-stone-500 mt-2 text-center text-balance max-w-xs">PDF, DOCX, PPTX, CSV, TXT, XML (Max 10MB/file)</p>
                            <input type="file" multiple ref={fileInputRef as any} className="hidden" accept=".pdf,.docx,.doc,.pptx,.ppt,.csv,.xml,.txt" onChange={(e) => handleFileSelect(e.target.files)} />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 max-h-64 overflow-y-auto custom-scrollbar p-1">
                            {files.map((f, i) => (
                                <div key={i} className="relative bg-stone-100 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-3 flex items-center gap-3 group">
                                    <div className="p-2 bg-white dark:bg-stone-800 rounded-lg shadow-sm">
                                        <FileText className="w-6 h-6 text-indigo-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-stone-800 dark:text-stone-200 truncate">{f.name}</p>
                                        <p className="text-xs text-stone-500">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <button onClick={() => {
                                        setFiles(prev => prev.filter((_, idx) => idx !== i));
                                        setPreviewUrls(prev => prev.filter((_, idx) => idx !== i));
                                        if (files.length === 1) setThumbnailBlob(null);
                                    }} className="p-1.5 hover:bg-red-100 hover:text-red-500 text-stone-400 rounded-full transition opacity-0 group-hover:opacity-100">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <button onClick={() => fileInputRef.current?.click()} className="mt-2 py-3 border-2 border-dashed border-stone-200 dark:border-stone-700 rounded-xl text-stone-500 hover:text-indigo-500 hover:border-indigo-300 dark:hover:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition flex items-center justify-center gap-2 text-sm font-medium">
                                <Upload className="w-4 h-4" /> Add More Files
                            </button>
                            <input type="file" multiple ref={fileInputRef as any} className="hidden" accept=".pdf,.docx,.doc,.pptx,.ppt,.csv,.xml,.txt" onChange={(e) => handleFileSelect(e.target.files)} />
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-1">Title</label>
                        <input type="text" className="w-full px-4 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition" placeholder="e.g. Data Structures Notes unit 1" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} onKeyDown={(e) => { if (e.key === "Enter" && files.length > 0 && formData.title.trim()) handleUpload(); }} />
                     </div>
                     <div>
                        <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-1">Course / Branch</label>
                        <select className="w-full px-4 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none" value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})}>
                            <option>Computer Engineering</option>
                            <option>AIML Engineering</option>
                            <option>AIDS</option>
                            <option>E&TC Engineering</option>
                            <option>Civil Engineering</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-1">Year</label>
                        <select className="w-full px-4 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})}>
                            <option>First Year</option><option>Second Year</option><option>Third Year</option><option>Final Year</option>
                        </select>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-1">Semester</label>
                            <select className="w-full px-4 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none" value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})}>
                                <option>Semester 1</option><option>Semester 2</option><option>Semester 3</option><option>Semester 4</option>
                                <option>Semester 5</option><option>Semester 6</option><option>Semester 7</option><option>Semester 8</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-1">Subject</label>
                            <select className="w-full px-4 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none disabled:opacity-50 disabled:cursor-not-allowed" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} disabled={availableSubjects.length === 0}>
                                {availableSubjects.length > 0 ? availableSubjects.map(sub => <option key={sub} value={sub}>{sub}</option>) : <option value="">No subjects found</option>}
                            </select>
                         </div>
                     </div>
                     <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                <Search className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300">Plagiarism Scanner Active</h4>
                                <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-0.5 text-balance">
                                  Checks against our note database <strong>+</strong> web crawl (Google/DuckDuckGo) for internet sources.
                                </p>
                            </div>
                        </div>
                     </div>
                </div>
            </div>
            )}

            {/* ── SCANNING / REPORT VIEW ── */}
            {/* Handled by Full-Screen Overlay above */}
        </div>

        {/* Footer buttons */}
        <div className="p-4 border-t border-stone-100 dark:border-stone-800 flex justify-end gap-3 bg-stone-50/50 dark:bg-stone-900/50 shrink-0">
             <button onClick={onClose} disabled={status === 'uploading'} className="px-6 py-2.5 rounded-xl text-stone-600 font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition disabled:opacity-50">Cancel</button>
             <button onClick={handleUpload} disabled={files.length === 0 || status === 'uploading' || status === 'success'} className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition disabled:opacity-50 flex items-center gap-2">
               <Search className="w-4 h-4" />
               Scan & Upload
             </button>
        </div>
      </div>
    </div>
  );
}
