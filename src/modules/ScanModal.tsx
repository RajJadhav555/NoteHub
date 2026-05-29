import React, { useState, useEffect } from 'react';
import { 
  ScanLine as Scan, 
  CheckCircle, 
  TriangleAlert as AlertTriangle, 
  FileText, 
  Cpu, 
  Shield, 
  X,
  LoaderCircle as Loader2,
  Sparkles
} from 'lucide-react/dist/esm/lucide-react';

export function ScanModal({ onClose, onComplete, type = 'note' }) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [scanResult, setScanResult] = useState(null);

  const noteSteps = [
    { label: "Initializing Scanner...", icon: <Cpu className="w-5 h-5" /> },
    { label: "Analyzing Content Structure...", icon: <FileText className="w-5 h-5" /> },
    { label: "Checking Plagiarism...", icon: <Shield className="w-5 h-5" /> },
    { label: "Verifying Academic Integrity...", icon: <Scan className="w-5 h-5" /> },
    { label: "Generating AI Summary...", icon: <Cpu className="w-5 h-5" /> }
  ];

  const pyqSteps = [
    { label: "Reading Question Paper...", icon: <FileText className="w-5 h-5" /> },
    { label: "Extracting Questions (OCR)...", icon: <Scan className="w-5 h-5" /> },
    { label: "Categorizing Topics...", icon: <Cpu className="w-5 h-5" /> },
    { label: "Analyzing Difficulty Level...", icon: <AlertTriangle className="w-5 h-5" /> },
    { label: "Generating Exam Insights...", icon: <Sparkles className="w-5 h-5" /> }
  ];

  const steps = type === 'pyq' ? pyqSteps : noteSteps;

  useEffect(() => {
    // Simulate scanning process
    if (step < steps.length) {
      const timeout = setTimeout(() => {
        setStep(prev => prev + 1);
        setProgress(((step + 1) / steps.length) * 100);
      }, 1500); // 1.5s per step
      return () => clearTimeout(timeout);
    } else {
      // Finished scanning
      // ✅ FIX #2: Show disclaimer — this modal is a preview animation, not real data.
      // Real plagiarism analysis happens during upload via checkPlagiarism().
      setTimeout(() => {
        if (type === 'pyq') {
           setScanResult({
            summary: "Preliminary format scan complete. Full plagiarism analysis will run during upload.",
            score: null, // Not computed here
            plagiarism: null, // Not applicable — real check runs on upload
            quality: "Pending Upload",
            disclaimer: true,
          });
        } else {
          setScanResult({
            score: null,
            plagiarism: null,
            quality: "Pending Upload",
            summary: "Preliminary format scan complete. Full originality and plagiarism analysis will run when you upload this note.",
            disclaimer: true,
          });
        }
      }, 1000);
    }
  }, [step, type]);

  const handleComplete = () => {
    onComplete(scanResult);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-md z-[80] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-900 rounded-2xl w-full max-w-md shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden relative">
        
        {/* Close Button */}
        {!scanResult && (
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 z-10"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${
              scanResult 
                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" 
                : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 animate-pulse"
            }`}>
              {scanResult ? (
                <CheckCircle className="w-10 h-10" />
              ) : (
                <Scan className="w-10 h-10" />
              )}
            </div>
            
            <h2 className="text-2xl font-bold font-heading text-stone-900 dark:text-white">
              {scanResult ? "Verification Complete" : "AI Scan in Progress"}
            </h2>
            <p className="text-stone-500 dark:text-stone-400 mt-2 text-sm">
              {scanResult 
                ? "Your note has been successfully verified." 
                : "Please wait while our AI analyzes your document."}
            </p>
          </div>

          {!scanResult ? (
            /* Progress Section */
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Current Step */}
              <div className="space-y-3">
                {steps.map((s, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center space-x-3 transition-colors duration-300 ${
                      idx === step 
                        ? "text-indigo-600 font-medium" 
                        : idx < step 
                          ? "text-emerald-500" 
                          : "text-stone-400"
                    }`}
                  >
                    <div className="shrink-0">
                      {idx < step ? <CheckCircle className="w-5 h-5" /> : 
                       idx === step ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                       s.icon}
                    </div>
                    <span className="text-sm">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Result Section */
            <div className="space-y-6 animate-fade-in-up">
              {/* ✅ FIX #2: Disclaimer banner */}
              {scanResult.disclaimer && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3">
                  <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                    ⚠️ This is a preliminary format check. Full plagiarism & originality analysis runs automatically during upload.
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-stone-50 dark:bg-stone-800 p-4 rounded-xl text-center border border-stone-200 dark:border-stone-700">
                  <div className="text-xs text-stone-500 uppercase font-bold mb-1">Format Check</div>
                  <div className="text-3xl font-bold text-emerald-600">{scanResult.score != null ? `${scanResult.score}%` : '✓'}</div>
                </div>
                <div className="bg-stone-50 dark:bg-stone-800 p-4 rounded-xl text-center border border-stone-200 dark:border-stone-700">
                  <div className="text-xs text-stone-500 uppercase font-bold mb-1">Plagiarism</div>
                  <div className="text-2xl font-bold text-indigo-600">{scanResult.plagiarism != null ? `${scanResult.plagiarism}%` : 'On Upload'}</div>
                </div>
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                <h4 className="font-bold text-indigo-900 dark:text-indigo-200 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Summary
                </h4>
                <p className="text-sm text-indigo-800 dark:text-indigo-300 leading-relaxed">
                  {scanResult.summary}
                </p>
              </div>

              <button
                onClick={handleComplete}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition transform active:scale-95"
              >
                Proceed to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
