import React, { useState, useEffect } from 'react';
import { X, FileText, Download, Star, Shield, ShieldAlert, Globe, Database, ExternalLink, ChevronDown, ChevronUp, BookOpen } from 'lucide-react/dist/esm/lucide-react';

// API Configuration
// @ts-ignore
const API_BASE_URL = (import.meta.env && import.meta.env.VITE_API_URL) || '/api';

// ─── Mini plagiarism sub-components (same as UploadModal) ───────────

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 28, c = 2 * Math.PI * r;
  return (
    <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 70 70">
        <circle cx="35" cy="35" r={r} className="stroke-gray-700" strokeWidth="6" fill="transparent" />
        <circle cx="35" cy="35" r={r} stroke={color} strokeWidth="6" fill="transparent"
          strokeDasharray={c} strokeDashoffset={c - (score / 100) * c}
          className="transition-all duration-1000 ease-out" strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black" style={{ color }}>{score}</span>
        <span className="text-[9px] text-gray-500 font-bold">/100</span>
      </div>
    </div>
  );
}

function SourcesExpand({ items, label, color }: { items: any[]; label: string; color: string }) {
  const [open, setOpen] = useState(false);
  if (!items?.length) return null;
  return (
    <div className="mt-3 border rounded-xl overflow-hidden" style={{ borderColor: color + '40' }}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition text-left">
        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color }}>{items.length} {label}</span>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
      </button>
      {open && (
        <div className="divide-y divide-gray-700/30">
          {items.map((item: any, i: number) => (
            <div key={i} className="p-3 space-y-1">
              {item.sentence && (
                <p className="text-[10px] text-gray-400 italic border-l-2 pl-2 leading-relaxed" style={{ borderColor: color + '70' }}>
                  "{item.sentence?.substring(0, 130)}…"
                </p>
              )}
              {item.title && (
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3 text-purple-400" />
                  <span className="text-[11px] font-semibold text-purple-300 line-clamp-1">{item.title}</span>
                  {item.similarity != null && (
                    <span className="ml-auto text-[10px] text-gray-400">{item.similarity}%</span>
                  )}
                </div>
              )}
              {item.sources?.map((src: any, j: number) => (
                <a key={j} href={src.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-1.5 group">
                  <ExternalLink className="w-3 h-3 text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] text-blue-400 group-hover:underline line-clamp-1">{src.title || src.url}</span>
                </a>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PlagiarismTab({ note }: { note: any }) {
  let plag: any = null;
  try {
    plag = note.plagiarism_details
      ? (typeof note.plagiarism_details === 'string' ? JSON.parse(note.plagiarism_details) : note.plagiarism_details)
      : null;
  } catch (e) {}

  if (!plag) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-stone-500 dark:text-stone-400 gap-3">
        <Shield className="w-10 h-10 opacity-30" />
        <p className="text-sm">No plagiarism report available for this note.</p>
      </div>
    );
  }

  const isOriginal = plag.verdict === 'original';
  const isSuspicious = plag.verdict === 'suspicious';
  const color = isOriginal ? '#34d399' : isSuspicious ? '#fbbf24' : '#f87171';
  const web = plag.web || null;

  return (
    <div className="p-6 overflow-y-auto h-full bg-gray-950">
      <div className="max-w-xl mx-auto space-y-4">
        {/* Score + Verdict */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-900 border border-gray-700/50">
          <ScoreRing score={plag.score} color={color} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {isOriginal ? <Shield className="w-5 h-5" style={{ color }} /> : <ShieldAlert className="w-5 h-5" style={{ color }} />}
              <span className="text-lg font-black uppercase tracking-wide" style={{ color }}>{plag.verdict}</span>
              <span className="text-[10px] text-gray-500 border border-gray-700 px-2 py-0.5 rounded-full font-mono">{plag.engine ? plag.engine.match(/v[\d.]+/)?.[0] || 'ENGINE v3.1' : 'ENGINE v3.1'}</span>
            </div>
            {plag.maxSimilarity > 0 && (
              <p className="text-xs text-gray-400 mt-1">Max overlap: {plag.maxSimilarity}%</p>
            )}
            {plag.matchedNoteTitle && (
              <p className="text-xs text-gray-500 mt-0.5 truncate">Closest: "{plag.matchedNoteTitle}"</p>
            )}
            <p className="text-[11px] text-gray-400 mt-1.5 italic leading-relaxed">{plag.reasoning}</p>
          </div>
        </div>

        {/* 3-Layer Breakdown */}
        {plag.layerScores && (
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Word', score: plag.layerScores.word, icon: '📝' },
              { label: 'Sentence', score: plag.layerScores.sentence, icon: '📄' },
              { label: 'Paragraph', score: plag.layerScores.paragraph, icon: '📑' },
            ].map(l => {
              const c = l.score >= 70 ? '#34d399' : l.score >= 40 ? '#fbbf24' : '#f87171';
              return (
                <div key={l.label} className="bg-gray-800 rounded-xl p-3 border border-gray-700/50">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{l.label}</p>
                    <span className="text-xs">{l.icon}</span>
                  </div>
                  <p className="text-lg font-black text-white">{l.score}%</p>
                  <div className="h-1 bg-gray-900 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${l.score}%`, backgroundColor: c }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Web Check */}
        {web?.enabled && (
          <div className="p-4 rounded-xl bg-gray-900 border border-gray-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Web Crawl ({web.engine?.toUpperCase() || 'SEARCH'})
              </span>
              <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
                web.verdict === 'plagiarized' ? 'bg-red-900/50 text-red-300' :
                web.verdict === 'suspicious' ? 'bg-amber-900/50 text-amber-300' :
                'bg-emerald-900/50 text-emerald-300'
              }`}>{web.verdict?.toUpperCase()}</span>
            </div>
            <p className="text-xs text-gray-400">{web.matchedSentences}/{web.totalChecked} sentences matched online</p>
            <p className="text-[11px] text-gray-500 mt-0.5 italic">{web.reasoning}</p>
            <SourcesExpand items={web.webSources || []} label="Web Sources" color="#fbbf24" />
          </div>
        )}

        {/* Internal matches */}
        {plag.details?.length > 0 && (
          <div className="p-4 rounded-xl bg-gray-900 border border-gray-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-purple-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">{plag.details.length} Database Matches</span>
            </div>
            <SourcesExpand items={plag.details || []} label="Note Matches" color="#a78bfa" />
          </div>
        )}
      </div>
    </div>
  );
}

function TextViewer({ url }: { url: string }) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${url}${url.includes('?') ? '&' : '?'}inline=true`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load file content');
        return res.text();
      })
      .then(text => {
        setContent(text);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [url]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full gap-3 animate-pulse">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-400">Loading document content...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-full text-red-500 p-8 text-center">
      <ShieldAlert className="w-12 h-12 mb-4 opacity-30" />
      <p className="text-sm font-bold">Error Loading Content</p>
      <p className="text-xs mt-1 text-gray-500">{error}</p>
    </div>
  );

  return (
    <div className="h-full overflow-auto p-6 bg-stone-50 dark:bg-stone-950 font-mono text-[13px] leading-relaxed text-stone-700 dark:text-stone-300">
      <pre className="whitespace-pre-wrap">{content}</pre>
    </div>
  );
}


function PdfViewer({ url }: { url: string }) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('notehub_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch(`${url}${url.includes('?') ? '&' : '?'}inline=true`, { headers })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load PDF');
        return res.blob();
      })
      .then(blob => {
        const objUrl = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
        setBlobUrl(objUrl);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [url]);

  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full gap-3 animate-pulse">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-400">Loading PDF document securely...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-full text-red-500 p-8 text-center">
      <ShieldAlert className="w-12 h-12 mb-4 opacity-30" />
      <p className="text-sm font-bold">Error Loading PDF</p>
      <p className="text-xs mt-1 text-gray-500">{error}</p>
    </div>
  );

  return (
    <iframe 
        src={`${blobUrl}#toolbar=1&view=FitH`} 
        className="w-full h-full border-none bg-stone-100 dark:bg-stone-900"
        title="PDF Preview"
    />
  );
}

function HtmlViewer({ noteId }: { noteId: string | number }) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/notes/${noteId}/html`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to convert document to HTML');
        return res.json();
      })
      .then(data => {
        setContent(data.html);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [noteId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full gap-3 animate-pulse">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-400">Converting document for preview...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-full text-red-500 p-8 text-center">
      <ShieldAlert className="w-12 h-12 mb-4 opacity-30" />
      <p className="text-sm font-bold">Preview Error</p>
      <p className="text-xs mt-1 text-gray-500">{error}</p>
    </div>
  );

  return (
    <div className="h-full overflow-auto p-8 bg-white dark:bg-stone-900 text-stone-900 dark:text-white prose dark:prose-invert max-w-none">
      <div dangerouslySetInnerHTML={{ __html: content || "" }} />
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────

export function NotePreviewModal({ isOpen, onClose, note, onDownload, userProfile, onRateUpdate }) {
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'plagiarism'>('preview');

  if (!isOpen || !note) return null;

  const isOwnerOrAdmin = userProfile?.id &&
    (String(userProfile.id) === String(note.uploader_id) || userProfile.role === 'admin');

  const hasPlagData = !!(note.plagiarism_details || note.plagiarism_score != null);

  const handleRate = async (ratingValue) => {
      if (!userProfile?.id) { alert("Please login to rate notes."); return; }
      try {
          setIsSubmitting(true);
          const token = sessionStorage.getItem('notehub_token');
          const rateHeaders: Record<string,string> = { 'Content-Type': 'application/json' };
          if (token) rateHeaders['Authorization'] = `Bearer ${token}`;
          const res = await fetch(`/api/notes/${note.id}/rating`, {
              method: 'POST',
              headers: rateHeaders,
              body: JSON.stringify({ userId: userProfile.id, rating: ratingValue })
          });
          if (res.ok) {
              const data = await res.json();
              if (onRateUpdate) onRateUpdate(note.id, data.newAverage);
          } else {
              const err = await res.json();
              alert(err.error || "Failed to submit rating.");
          }
      } catch (e) { console.error("Rating error:", e); }
      finally { setIsSubmitting(false); }
  };

  // Parse plagiarism score for badge
  let plagScore: number | null = null;
  if (note.plagiarism_score != null) plagScore = note.plagiarism_score;
  else if (note.plagiarism_details) {
    try {
      const pd = typeof note.plagiarism_details === 'string' ? JSON.parse(note.plagiarism_details) : note.plagiarism_details;
      if (pd?.score != null) plagScore = pd.score;
    } catch(e) {}
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center bg-stone-50/50 dark:bg-stone-900/50 shrink-0">
          <div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-white line-clamp-1 flex items-center gap-3">
                  {note.title}
                  <span className="flex items-center gap-0.5 text-sm bg-stone-200 dark:bg-stone-800 px-2 py-1 rounded-full text-stone-600 dark:text-stone-300">
                 {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                        key={star} 
                        className={`w-4 h-4 ${star <= Math.round(note.rating || 0) ? 'fill-amber-500 text-amber-500' : 'text-stone-400 dark:text-stone-600'}`} 
                    />
                 ))}
              </span>
              {/* Originality badge */}
              {plagScore != null && (
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold flex items-center gap-1 ${
                  plagScore >= 70 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' :
                  plagScore >= 40 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                  'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                }`}>
                  <Shield className="w-3 h-3" />
                  {plagScore}% original
                </span>
              )}
              </h2>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                  {note.subject} • Uploaded by {note.uploader_name || "Anonymous"}
              </p>
          </div>
          
          <div className="flex items-center gap-6">
             {/* Interactive Stars */}
             <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold text-stone-400 mb-1 tracking-wider">Rate Note</span>
                <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            disabled={isSubmitting}
                            onMouseEnter={() => setHoverRating(star)}
                            onClick={() => handleRate(star)}
                            className="p-1 transition-all transform hover:scale-125 disabled:opacity-50"
                        >
                            <Star 
                                className={`w-6 h-6 ${
                                    (hoverRating || note.rating) >= star 
                                        ? "text-amber-500 fill-amber-500" 
                                        : "text-stone-300 dark:text-stone-700"
                                }`} 
                            />
                        </button>
                    ))}
                </div>
             </div>

             <div className="h-10 w-px bg-stone-200 dark:bg-stone-800 mx-2" />

             <button 
               onClick={onClose}
               className="p-2 text-stone-500 hover:bg-red-50 hover:text-red-500 rounded-lg transition"
             >
               <X className="w-6 h-6" />
             </button>
          </div>
        </div>

        {/* Tab bar (only shown to owner/admin when plag data exists) */}
        {/* ✅ FIX #20: Plagiarism tab visible to ALL authenticated users (not just owner/admin) */}
        {hasPlagData && (
          <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 shrink-0">
            {[
              { key: 'preview', label: 'Preview', icon: FileText },
              { key: 'plagiarism', label: 'Plagiarism Report', icon: Shield },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition ${
                  activeTab === tab.key
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-stone-900'
                    : 'border-transparent text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.key === 'plagiarism' && plagScore != null && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1 ${
                    plagScore >= 70 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' :
                    plagScore >= 40 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
                    'bg-red-100 dark:bg-red-900/30 text-red-600'
                  }`}>{plagScore}%</span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden relative bg-stone-50 dark:bg-stone-950">
            {activeTab === 'preview' ? (
              (note.file_url || note.file_name) ? (
                  (() => {
                    const url = note.file_name 
                        ? `${API_BASE_URL}/notes/file/${note.file_name}` 
                        : note.file_url;
                    const type = (note.file_type || "").toUpperCase();
                    
                    // PDF Preview
                    if (type === 'PDF') {
                      return <PdfViewer url={url} />;
                    }
                    
                    // Office Documents (DOCX, PPTX)
                    if (type === 'DOCX' || type === 'PPTX') {
                      const isPublic = url.startsWith('http') && !url.includes('localhost');
                      if (isPublic) {
                        return (
                          <iframe 
                              src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`} 
                              className="w-full h-full border-none"
                              title="Office Preview"
                          />
                        );
                      } else {
                        // Use Local HTML Converter for localhost
                        return <HtmlViewer noteId={note.id} />;
                      }
                    }

                    // Text-based files (TXT, CSV, XML)
                    if (type === 'TXT' || type === 'CSV' || type === 'XML') {
                        return <TextViewer url={url} />;
                    }

                    // Image Preview
                    const imageTypes = ['PNG', 'JPG', 'JPEG', 'GIF', 'WEBP'];
                    if (imageTypes.includes(type)) {
                        return (
                            <div className="w-full h-full flex items-center justify-center p-4 bg-stone-100 dark:bg-stone-900">
                                <img 
                                    src={`${url}${url.includes('?') ? '&' : '?'}inline=true`} 
                                    alt="Note preview" 
                                    className="max-w-full max-h-full object-contain shadow-lg rounded-sm"
                                    onError={(e) => {
                                        e.currentTarget.src = "/placeholder-image.png";
                                        e.currentTarget.parentElement?.classList.add("animate-pulse");
                                    }}
                                />
                            </div>
                        );
                    }

                    return (
                        <div className="flex flex-col items-center justify-center h-full text-stone-500 p-8 text-center">
                            <FileText className="w-12 h-12 mb-4 opacity-20" />
                            <h3 className="text-lg font-bold text-stone-700 dark:text-stone-300">{type} Document</h3>
                            <p className="max-w-md mt-2 text-sm">
                              Direct preview for {type} files is currently limited. 
                              You can check the **Plagiarism Report** for a text-based analysis or download the file.
                            </p>
                             <button 
                                onClick={() => onDownload(note)}
                                className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition"
                            >
                                Download {type}
                            </button>
                        </div>
                    );
                  })()
              ) : (
                  <div className="flex items-center justify-center h-full text-stone-500">
                      Document preview unavailable
                  </div>
              )
            ) : (
              <PlagiarismTab note={note} />
            )}
        </div>
        
      </div>
    </div>
  );
}
