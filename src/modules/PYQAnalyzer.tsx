import React, { useState, useRef } from 'react';
import { Upload, FileText, Brain, AlertCircle, CheckCircle } from 'lucide-react';

export function PYQAnalyzer() {
    const [files, setFiles] = useState<File[]>([]);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const resultRef = useRef<HTMLDivElement>(null);

    const handleFileChange = (e: any) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files) as File[];
            setFiles(prev => [...prev, ...newFiles]);
            setResult(null);
            setError(null);
        }
    };

    const handleDragOver = (e: any) => { e.preventDefault(); e.stopPropagation(); };
    const handleDragLeave = (e: any) => { e.preventDefault(); e.stopPropagation(); };

    const handleDrop = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files).filter((file: any) =>
                file.type === "application/pdf" ||
                file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ) as File[];
            if (newFiles.length > 0) {
                setFiles((prev: File[]) => [...prev, ...newFiles]);
                setResult(null);
                setError(null);
            } else {
                setError("Please upload only PDF or DOCX files.");
            }
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleReset = () => {
        setFiles([]);
        setResult(null);
        setError(null);
    };

    const handleAnalyze = async () => {
        if (files.length === 0) return;
        setAnalyzing(true);
        setResult(null);
        setError(null);

        try {
            const formData = new FormData();
            files.forEach(file => formData.append('files', file));

            // @ts-ignore
            const API_BASE = import.meta.env?.VITE_API_BASE_URL || '/api';
            const response = await fetch(`${API_BASE}/pyq/analyze`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Analysis failed. Please try again.');
            }

            setResult(data);
            setTimeout(() => {
                resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);

        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="pt-20 min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white">
            {/* Header */}
            <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-lg border-b border-stone-200 dark:border-stone-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                            <Brain className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold font-heading text-stone-900 dark:text-white">PYQ Analyzer</h1>
                            <p className="text-sm text-stone-500 dark:text-stone-400">
                                Algorithmic insights from previous year question papers
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">

                {/* ---- LOADING STATE ---- */}
                {analyzing && (
                    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-12 mb-8 text-center shadow-sm">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            <h3 className="text-xl font-bold text-stone-900 dark:text-white">Analyzing Documents...</h3>
                            <p className="text-stone-500 dark:text-stone-400 text-sm max-w-md">
                                Extracting text, identifying recurring questions, and analyzing topic frequency. This should take just a few seconds.
                            </p>
                            <div className="mt-2 flex gap-2 items-center text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 px-4 py-2 rounded-full">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                                Running Offline Algorithmic Analysis
                            </div>
                        </div>
                    </div>
                )}

                {/* ---- UPLOAD SECTION ---- */}
                {!analyzing && !result && (
                    <div
                        className="bg-white dark:bg-stone-900 border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-2xl p-8 mb-8 text-center transition-colors cursor-pointer"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            accept=".pdf,.docx"
                            id="pyq-upload"
                            className="hidden"
                            multiple
                            onChange={handleFileChange}
                        />

                        {files.length === 0 ? (
                            <label htmlFor="pyq-upload" className="cursor-pointer flex flex-col items-center">
                                <div className="w-20 h-20 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mb-4 group hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition">
                                    <Upload className="w-8 h-8 text-stone-400 dark:text-stone-500 group-hover:text-indigo-500 transition" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-stone-800 dark:text-white">Upload Question Papers</h3>
                                <p className="text-stone-500 dark:text-stone-400 mb-6">Drag & drop or click to select PDF/DOCX files</p>
                                <span className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition shadow-sm">
                                    Select Files
                                </span>
                            </label>
                        ) : (
                            <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
                                <h3 className="text-lg font-semibold mb-4 text-left w-full pl-2 text-stone-800 dark:text-white">Selected Files ({files.length})</h3>

                                <div className="w-full space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
                                    {files.map((file, index) => (
                                        <div key={index} className="flex items-center bg-stone-50 dark:bg-stone-800 rounded-xl p-3 border border-stone-200 dark:border-stone-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition">
                                            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                                                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <div className="flex-1 text-left min-w-0">
                                                <h4 className="font-medium truncate text-sm text-stone-800 dark:text-stone-200">{file.name}</h4>
                                                <p className="text-xs text-stone-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                            <button
                                                onClick={() => removeFile(index)}
                                                className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition"
                                            >
                                                <AlertCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-4">
                                    <label htmlFor="pyq-upload" className="px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-sm transition cursor-pointer flex items-center border border-stone-200 dark:border-stone-700">
                                        <Upload className="w-4 h-4 mr-2" />
                                        Add More
                                    </label>
                                    <button
                                        onClick={handleAnalyze}
                                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold text-white shadow-sm transition flex items-center gap-2"
                                    >
                                        <Brain className="w-4 h-4" />
                                        Analyze {files.length} {files.length === 1 ? 'Paper' : 'Papers'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ---- ERROR MESSAGE ---- */}
                {error && !analyzing && (
                    <div className="mb-8 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 rounded-xl">
                        <div className="flex items-start gap-3 text-red-600 dark:text-red-300 mb-4">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold">Analysis Failed</p>
                                <p className="text-sm mt-1 text-red-500 dark:text-red-400">{error}</p>
                            </div>
                        </div>
                        <button onClick={handleReset} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition">
                            Try Again
                        </button>
                    </div>
                )}

                {/* ---- RESULTS SECTION ---- */}
                {result && !analyzing && (
                    <div ref={resultRef} className="space-y-6">
                        {/* Reset button */}
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                Analysis Complete — {result.filesAnalyzed?.length || files.length} file(s)
                            </h2>
                            <button onClick={handleReset} className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 dark:hover:text-white bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 px-4 py-2 rounded-xl transition">
                                New Analysis
                            </button>
                        </div>

                        {/* Summary & Metadata */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-semibold mb-3 flex items-center text-indigo-600 dark:text-indigo-400">
                                    <Brain className="w-5 h-5 mr-2" />
                                    AI Summary
                                </h3>
                                <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-sm">
                                    {result.summary || "No summary available."}
                                </p>
                            </div>
                            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-sm space-y-4">
                                <div>
                                    <div className="text-xs text-stone-400 uppercase tracking-wider mb-1">Subject</div>
                                    <div className="text-lg font-bold text-stone-900 dark:text-white">{result.subject || 'Not detected'}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-stone-400 uppercase tracking-wider mb-1">Semester / Year</div>
                                    <div className="text-base font-semibold text-stone-800 dark:text-stone-200">{result.semester || 'Not detected'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Topics */}
                        {result.topics && result.topics.length > 0 && (
                            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold mb-4 text-stone-900 dark:text-white">Key Topics & Focus Areas</h3>
                                <div className="flex flex-wrap gap-3">
                                    {result.topics.map((topic: any, idx: number) => (
                                        <div key={idx} className="px-4 py-2 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-full flex items-center gap-2">
                                            <span className="font-medium text-stone-700 dark:text-stone-200">{topic.name}</span>
                                            {topic.count && (
                                                <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full">{topic.count}x</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* FAQs */}
                        {result.faqs && result.faqs.length > 0 && (
                            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold mb-4 text-stone-900 dark:text-white">Frequently Asked Questions</h3>
                                <div className="space-y-3">
                                    {result.faqs.map((faq: any, idx: number) => (
                                        <div key={idx} className="bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 p-4 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-600 transition">
                                            <div className="flex items-start justify-between gap-4">
                                                <p className="font-medium text-stone-800 dark:text-stone-200 flex-1">{faq.question}</p>
                                                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                                    {faq.frequency && (
                                                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                                            String(faq.frequency).toLowerCase().includes('high') ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' :
                                                            String(faq.frequency).toLowerCase().includes('medium') ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400' :
                                                            'bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400'
                                                        }`}>
                                                            {faq.frequency}
                                                        </span>
                                                    )}
                                                    {faq.marks && (
                                                        <span className="text-xs text-stone-400 font-mono">{faq.marks} Marks</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
