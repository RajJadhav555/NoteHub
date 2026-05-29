import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';

import {
  Shield,
  ShieldAlert,
  ShieldOff,
  Download,
  Star,
  Search,
  Sparkles,
  X,
  Upload,
  Filter,
  BookOpen,
  FileText,
  Trash2,
} from "lucide-react/dist/esm/lucide-react";
import { UploadModal } from "../components/UploadModal";
import { NotePreviewModal } from "../components/NotePreviewModal";

export function NotesAIChatModal({ onClose }) {
    const [messages, setMessages] = useState([
    {
      text: "Hello! I've read all the verified notes. Ask me anything about them!",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { text: userMsg, isUser: true }]);
    setInput("");
    setIsLoading(true);

    try {
      const token = sessionStorage.getItem('notehub_token');
      const headers = { "Content-Type": "application/json" };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const response = await fetch(`/api/notes-ai/chat`, {
        method: "POST",
        headers,
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Failed to process request");

      setMessages((prev) => [
        ...prev,
        {
          text: data.reply || "Sorry, I couldn't process that.",
          isUser: false,
        },
      ]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: error.message || "Connection error. Please try again.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col h-[600px] border border-stone-200 dark:border-stone-800 animate-fade-in-up">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center bg-white/80 dark:bg-stone-900/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h3 className="font-bold text-lg font-heading text-stone-900 dark:text-white">Notes AI Assistant</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                Powered by Mistral AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50 dark:bg-stone-950/50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                  msg.isUser
                    ? "bg-indigo-600 text-white rounded-tr-none"
                    : "bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 rounded-tl-none"
                }`}
              >
                <div className="text-sm leading-relaxed prose dark:prose-invert max-w-none">
                  {msg.isUser ? (
                    <p>{msg.text}</p>
                  ) : (
                    <ReactMarkdown 
                      components={{
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-base font-bold mb-2 mt-1 text-indigo-600 dark:text-indigo-400" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                        li: ({node, ...props}) => <li className="mb-0.5" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold text-stone-900 dark:text-white" {...props} />,
                        hr: () => <hr className="my-3 border-stone-200 dark:border-stone-700" />,
                        code: ({node, inline, ...props}) => (
                          inline 
                          ? <code className="bg-stone-100 dark:bg-stone-900 px-1 rounded text-xs font-mono" {...props} />
                          : <code className="block bg-stone-100 dark:bg-stone-900 p-2 rounded text-xs font-mono my-2 overflow-x-auto" {...props} />
                        )
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-stone-800 rounded-2xl rounded-tl-none p-4 shadow-sm border border-stone-200 dark:border-stone-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 shrink-0 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your notes..."
            className="flex-1 px-4 py-3 bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-stone-900 dark:text-white"
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 active:scale-95 transform"
          >
            <Upload className="w-5 h-5 rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function VerifiedNotesPage({ notes, onVerify, onDownload, userProfile, onAddNote, onDeleteNote, onRateUpdate, initialNote, onClearInitialNote, refreshUserProfile }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVerified, setFilterVerified] = useState("all");
  const [showAIModal, setShowAIModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewNote, setPreviewNote] = useState(null);

  // Handle auto-open of note from Dashboard redirect
  useEffect(() => {
    if (initialNote) {
        setPreviewNote(initialNote);
        if (onClearInitialNote) onClearInitialNote();
    }
  }, [initialNote, onClearInitialNote]);
  
  // Category Filters
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedSemester, setSelectedSemester] = useState("All");

  const handleUploadClick = () => {
    setShowUploadModal(true);
  };

  const handleUploadComplete = (newNote) => {
    onAddNote(newNote);
    if (refreshUserProfile) refreshUserProfile();
  };

  
  const handleDelete = async (note) => {
      if (!confirm("Are you sure you want to delete this note?")) return;
      
      try {
          const token = sessionStorage.getItem('notehub_token');
          const headers = { 'Content-Type': 'application/json' };
          if (token) headers['Authorization'] = `Bearer ${token}`;
          const response = await fetch(`/api/notes/${note.id}`, {
              method: 'DELETE',
              headers,
              body: JSON.stringify({ userId: userProfile?.id })
          });
          
          if (response.ok) {
              onDeleteNote(note.id);
          } else {
              const err = await response.json();
              alert(err.error || "Failed to delete note");
          }
      } catch (e) {
          console.error(e);
          alert("Error deleting note");
      }
  };

  const handleDownloadClick = async (note) => {
      try {
          // 1. Increment Count Backend
          const token = sessionStorage.getItem('notehub_token');
          const dlHeaders = {};
          if (token) dlHeaders['Authorization'] = `Bearer ${token}`;
          await fetch(`/api/notes/${note.id}/download`, { method: 'POST', headers: dlHeaders });
          if (onDownload) onDownload(note);

          // 2. Trigger Browser Download (Save As)
          const downloadUrl = `${note.file_url}${note.file_url.includes('?') ? '&' : '?'}download=true`;
          
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.setAttribute('download', note.title || 'Notehub_Document'); 
          link.target = "_blank"; 
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
      } catch (e) {
          console.error("Download error:", e);
      }
  };
  
  const isVisitor = !userProfile || !userProfile.email;

  // Enforce visitor restrictions: Default to all for everyone to ensure universal visibility
  const currentVerificationFilter = filterVerified;

  const filteredNotes = notes.filter((note) => {
    const titleMatch = (note.title || "").toLowerCase().includes(searchTerm.toLowerCase());
    const subjectMatch = (note.subject || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = titleMatch || subjectMatch;
    
    // Allow all users to see all notes (verified, pending, and rejected)
    const matchesVerification =
      currentVerificationFilter === "all" ||
      (currentVerificationFilter === "verified" && note.verified) ||
      (currentVerificationFilter === "unverified" && !note.verified && note.verification_status !== 'rejected') ||
      (currentVerificationFilter === "rejected" && note.verification_status === 'rejected');

    // Sidebar Filters (simplified matching)
    const matchesCourse = selectedCourse === "All" || note.course === selectedCourse; 
    const matchesYear = selectedYear === "All" || note.year === selectedYear;
    const matchesSemester = selectedSemester === "All" || note.semester === selectedSemester;


    return matchesSearch && matchesVerification && matchesCourse && matchesYear && matchesSemester;
  });

  // Helper to get color for subject (Fallback if no thumbnail)
  const getSubjectColor = (subject) => {
      const colors = [
          "from-indigo-500 to-purple-600",
          "from-emerald-500 to-teal-600",
          "from-rose-500 to-pink-600",
          "from-amber-500 to-orange-600",
          "from-blue-500 to-cyan-600"
      ];
      let hash = 0;
      for (let i = 0; i < (subject || "").length; i++) hash = subject.charCodeAt(i) + ((hash << 5) - hash);
      return colors[Math.abs(hash) % colors.length];
  };

  const courses = ["Computer Engineering", "AIML Engineering", "AIDS", "E&TC Engineering", "Civil Engineering"];
  const years = ["First Year", "Second Year", "Third Year", "Final Year"];

  return (
    <div className="pt-20 min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-heading text-stone-900 dark:text-white">Verified Content</h1>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Access premium academic resources
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              {!isVisitor && (
                <>
                  <button
                    onClick={handleUploadClick}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition font-medium flex items-center space-x-2 shadow-sm"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Note</span>
                  </button>

                </>
              )}
              
              <button
                onClick={() => isVisitor ? alert("Please log in to use the Notes AI Assistant.") : setShowAIModal(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-medium flex items-center space-x-2 shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask AI</span>
              </button>
              

            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="lg:w-64 space-y-6">
          <div className="bg-white dark:bg-stone-900 p-4 rounded-xl shadow-sm border border-stone-200 dark:border-stone-800">
            <div className="flex items-center space-x-2 mb-4 text-stone-900 dark:text-white font-bold">
              <Filter className="w-4 h-4 text-indigo-600" />
              <span>Filters</span>
            </div>
             <div className="space-y-4">
               <div>
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2 block">Course</label>
                  <select 
                    value={selectedCourse} 
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>All</option>
                    {courses.map(c => <option key={c}>{c}</option>)}
                  </select>
               </div>
               
               <div>
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2 block">Year</label>
                  <select 
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>All</option>
                    {years.map(y => <option key={y}>{y}</option>)}
                  </select>
               </div>

                <div>
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2 block">Semester</label>
                   <select 
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>All</option>
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s}>Semester {s}</option>)}
                  </select>
               </div>
             </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white dark:bg-stone-900 p-4 rounded-xl shadow-sm border border-stone-200 dark:border-stone-800 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
             <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                />
             </div>
             
             {!isVisitor && (
               <select
                 value={filterVerified}
                 onChange={(e) => setFilterVerified(e.target.value)}
                 className="px-4 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
               >
                 <option value="all">All Notes</option>
                 <option value="verified">Verified Only</option>
                 <option value="unverified">Pending Verification</option>
                 <option value="rejected">Rejected Notes</option>
               </select>
             )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div key={note.id} className="bg-white dark:bg-stone-900 rounded-xl shadow-sm border border-stone-200 dark:border-stone-800 hover:shadow-xl transition-all duration-300 group flex flex-col overflow-hidden h-full">
                
                {/* Visual Thumbnail Header - Click to View */}
                <div 
                   onClick={() => setPreviewNote(note)}
                   className={`h-40 relative flex flex-col justify-between cursor-pointer overflow-hidden group-hover:opacity-95 transition-opacity bg-stone-100 dark:bg-stone-800`}
                >
                   {note.thumbnail_url ? (
                       <img 
                           src={`${note.thumbnail_url}${note.thumbnail_url?.includes('?') ? '&' : '?'}inline=true`} 
                           alt={note.title} 
                           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                           onError={(e) => {
                               // Fallback to gradient if image fails
                               e.currentTarget.style.display = 'none';
                               e.currentTarget.parentElement.classList.add(`bg-gradient-to-br`, getSubjectColor(note.subject));
                           }}
                       />
                   ) : (
                       <div className={`w-full h-full bg-gradient-to-br ${getSubjectColor(note.subject)}`} />
                   )}
                   
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                   
                   <div className="absolute top-2 left-2 z-10 flex gap-2">
                      <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg text-white">
                         <FileText className="w-5 h-5" />
                      </div>
                   </div>
                   
                   <div className="absolute top-2 right-2 z-10">
                      {note.verification_status === 'rejected' ? (
                         <div className="bg-red-500/90 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-sm backdrop-blur-sm">Rejected</div>
                      ) : note.verified ? (
                         <div className="bg-emerald-500/90 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-sm backdrop-blur-sm">Verified</div>
                      ) : (
                         <div className="bg-amber-500/90 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-sm backdrop-blur-sm">Pending</div>
                      )}
                   </div>
                   
                   <div className="absolute bottom-0 p-4 w-full z-10">
                      <h3 className="font-bold text-white text-lg leading-tight line-clamp-2 drop-shadow-md">{note.title}</h3>
                      <p className="text-xs text-white/80 mt-1 font-medium truncate">{note.subject}</p>
                      {note.verification_status === 'rejected' && (
                         <div className="mt-2 text-xs text-red-200 bg-red-900/50 p-2 rounded backdrop-blur-sm border border-red-500/30 line-clamp-2">
                             Reason: {(() => {
                                 try {
                                     const details = typeof note.verification_details === 'string' 
                                         ? JSON.parse(note.verification_details) 
                                         : note.verification_details;
                                     if (details?.error) return details.error;
                                     if (details?.redundancy_score === 0) return `Duplicate Content`;
                                     if (details?.quality_score < 40) return `Low Quality`;
                                     if (details?.appropriateness_score < 80) return "Inappropriate Content";
                                     return "Verification failed";
                                 } catch(e) { return "Verification failed"; }
                             })()}
                         </div>
                      )}
                   </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                    {/* Originality Badge */}
                    {(() => {
                      let score = null;
                      if (note.plagiarism_score != null) score = note.plagiarism_score;
                      else if (note.plagiarism_details) {
                        try {
                          const pd = typeof note.plagiarism_details === 'string' ? JSON.parse(note.plagiarism_details) : note.plagiarism_details;
                          if (pd && pd.score != null) score = pd.score;
                        } catch(e) {}
                      }
                      if (score === null) return null;
                      const plagScore = Number((100 - score).toFixed(1));
                      const isGood = plagScore <= 30, isMid = plagScore <= 60;
                      return (
                        <div className={`mb-2 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit border ${isGood ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30' : isMid ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/30' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30'}`}>
                          {isGood ? <Shield className="w-3 h-3" /> : isMid ? <ShieldAlert className="w-3 h-3" /> : <ShieldOff className="w-3 h-3" />}
                          {plagScore}% copied
                        </div>
                      );
                    })()}
                   <div className="flex items-center gap-2 mb-4 text-xs text-stone-500 dark:text-stone-400">
                      <img 
                         src={`https://ui-avatars.com/api/?name=${note.uploader_name || "User"}&background=random`} 
                         className="w-6 h-6 rounded-full" 
                         alt="avatar" 
                      />
                      <span className="font-medium truncate max-w-[100px]">{note.uploader_name || "Anonymous"}</span>
                      <span>•</span>
                      <span>{new Date(note.upload_date || Date.now()).toLocaleDateString()}</span>
                   </div>
                   
                   <div className="mt-auto pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-between items-center">
                      <div className="flex items-center gap-4 text-sm text-stone-500">
                         <span className="flex items-center gap-1 hover:text-indigo-600 transition" title="Downloads">
                            <Download className="w-4 h-4" /> {note.downloads || 0}
                         </span>
                         <span className="flex items-center gap-0.5 transition">
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star 
                                    key={star} 
                                    className={`w-3.5 h-3.5 ${star <= Math.round(note.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-stone-300 dark:text-stone-600'}`} 
                                />
                            ))}
                         </span>
                      </div>
                      <div className="flex gap-2">
                          {/* Delete Button (Owner Only) */}
                          {userProfile?.id && (String(userProfile.id) === String(note.uploader_id) || userProfile.role === 'admin') && (
                             <button 
                                onClick={(e) => { e.stopPropagation(); handleDelete(note); }}
                                className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                title="Delete Note"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                          )}
                          
                          <button
                            onClick={() => handleDownloadClick(note)}
                            className="p-1.5 text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredNotes.length === 0 && (
              <div className="text-center py-20 text-stone-500">
                  <p className="text-lg">No notes found matching your filters.</p>
              </div>
          )}
        </div>
      </div>
      
      {showAIModal && (
        <NotesAIChatModal onClose={() => setShowAIModal(false)} />
      )}
      {showUploadModal && (
        <UploadModal 
          isOpen={showUploadModal} 
          onClose={() => setShowUploadModal(false)}
          onUploadComplete={handleUploadComplete}
          userProfile={userProfile}
        />
      )}
      {previewNote && (
          <NotePreviewModal 
             isOpen={!!previewNote}
             onClose={() => setPreviewNote(null)}
             note={previewNote}
             onDownload={handleDownloadClick}
             userProfile={userProfile}
             onRateUpdate={(noteId, newRating) => {
                 if (onRateUpdate) onRateUpdate(noteId, newRating);
                 setPreviewNote(prev => prev ? {...prev, rating: newRating} : prev);
             }}
          />
      )}
    </div>
  );
}
