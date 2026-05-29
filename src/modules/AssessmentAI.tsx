import React, { useState } from 'react';
import { Brain, FileText, CheckCircle, Target, Sparkles, BookOpen, Clock, ArrowRight } from 'lucide-react';

export function AssessmentAI() {
  const [activeTab, setActiveTab] = useState('quiz'); // 'quiz' or 'exam'
  const [inputText, setInputText] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Results State
  const [quizData, setQuizData] = useState(null);
  const [examData, setExamData] = useState(null);
  
  // Interactive Quiz State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  
  // Flashcard State
  const [showAnswer, setShowAnswer] = useState(false);

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setError("Please paste some text or notes to generate an assessment.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setQuizData(null);
    setExamData(null);
    
    try {
      const endpoint = activeTab === 'quiz' ? '/api/assessments/quiz' : '/api/assessments/exam';
      const body = activeTab === 'quiz' ? { text: inputText, difficulty } : { text: inputText };
      
      // @ts-ignore - Vite specific env vars
      const API_BASE = import.meta.env?.VITE_API_BASE_URL || '';
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate assessment.");
      }

      const data = await response.json();
      
      if (activeTab === 'quiz') {
        setQuizData(data);
        setCurrentQuestionIdx(0);
        setSelectedAnswers({});
        setShowResults(false);
        setShowAnswer(false);
      } else {
        setExamData(data);
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionIdx, optionIdx) => {
    if (showResults) return; // Prevent changing after submission
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIdx]: optionIdx
    });
  };

  const calculateScore = () => {
    if (!quizData?.mcqs) return 0;
    let score = 0;
    quizData.mcqs.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) score++;
    });
    return score;
  };

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="mb-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
          <Brain className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-heading text-stone-900 dark:text-white flex items-center gap-2">
            AI Assessment Hub <Sparkles className="w-5 h-5 text-amber-500" />
          </h1>
          <p className="text-stone-500 dark:text-stone-400">
            Generate quizzes, flashcards, and mock exams instantly from your notes.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Input & Configuration */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-stone-900/50 backdrop-blur-md border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" /> Let's Start
            </h2>
            
            <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-xl mb-6">
              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'quiz' 
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm' 
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
                }`}
              >
                Quiz & Flashcards
              </button>
              <button
                onClick={() => setActiveTab('exam')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'exam' 
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm' 
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
                }`}
              >
                Mock Exam
              </button>
            </div>

            {activeTab === 'quiz' && (
               <div className="mb-4">
                 <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Difficulty</label>
                 <select 
                   value={difficulty}
                   onChange={(e) => setDifficulty(e.target.value)}
                   className="w-full bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 rounded-xl px-4 py-2 text-stone-900 dark:text-white"
                 >
                   <option value="easy">Easy (Definitions & Basics)</option>
                   <option value="medium">Medium (Application)</option>
                   <option value="hard">Hard (Complex Scenarios)</option>
                 </select>
               </div>
            )}

            <div className="mb-6">
               <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Source Material (Paste notes here)</label>
               <textarea
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 placeholder="Paste a paragraph, lecture transcript, or study notes here..."
                 className="w-full h-48 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-4 text-stone-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
               />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading || !inputText.trim()}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
            >
              {isLoading ? (
                <> Generating AI Response...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Generate {activeTab === 'quiz' ? 'Quiz' : 'Exam'}</>
              )}
            </button>
            
            {error && (
               <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                 {error}
               </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Results / Interactive Area */}
        <div className="lg:col-span-7 space-y-6">
            
          {!quizData && !examData && !isLoading && (
              <div className="h-full min-h-[400px] border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl flex flex-col items-center justify-center text-center p-8">
                 <div className="w-20 h-20 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mb-6">
                    <Target className="w-10 h-10 text-stone-400" />
                 </div>
                 <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">Ready to Test Your Knowledge?</h3>
                 <p className="text-stone-500 max-w-sm">Provide some source material on the left, and our AI will create a personalized assessment for you.</p>
              </div>
          )}

          {isLoading && (
              <div className="h-full min-h-[400px] border border-stone-200 dark:border-stone-800 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-stone-900/50">
                 <div className="w-12 h-12 text-indigo-500 animate-pulse bg-indigo-200 dark:bg-indigo-900 rounded-full mb-4"></div>
                 <h3 className="text-lg font-bold text-stone-900 dark:text-white">Analyzing Content...</h3>
                 <p className="text-stone-500">Our AI is reading your notes and strictly formulating questions. This might take a few seconds.</p>
              </div>
          )}

          {/* QUIZ RESULTS VIEW */}
          {quizData && activeTab === 'quiz' && (
              <div className="space-y-6">
                  {/* Flashcards Section */}
                  {quizData.flashcards && quizData.flashcards.length > 0 && (
                      <div className="bg-white dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm">
                          <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-purple-500"/> Key Concept Flashcards</h3>
                          <div 
                             onClick={() => setShowAnswer(!showAnswer)}
                             className="min-h-[200px] bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md transition-all group relative"
                          >
                              <div className="absolute top-4 right-4 text-xs font-semibold text-indigo-500 uppercase tracking-wide">
                                  {showAnswer ? 'Definition' : 'Concept'}
                              </div>
                              <h4 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">
                                 {showAnswer ? quizData.flashcards[0].back : quizData.flashcards[0].front}
                              </h4>
                              <p className="text-stone-500 text-sm mt-4 flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                  Click to flip
                              </p>
                          </div>
                      </div>
                  )}

                  {/* MCQ Section */}
                  {quizData.mcqs && quizData.mcqs.length > 0 && (
                      <div className="bg-white dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm">
                          <div className="flex justify-between items-center mb-6">
                             <h3 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500"/> Multiple Choice</h3>
                             {showResults && (
                                 <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold rounded-lg text-sm">
                                     Score: {calculateScore()} / {quizData.mcqs.length}
                                 </div>
                             )}
                          </div>
                          
                          <div className="space-y-8">
                             {quizData.mcqs.map((q, idx) => (
                                 <div key={idx} className="space-y-3">
                                     <p className="font-semibold text-stone-900 dark:text-white"><span className="text-indigo-500 mr-2">{idx + 1}.</span> {q.question}</p>
                                     <div className="grid sm:grid-cols-2 gap-3">
                                         {q.options.map((opt, optIdx) => {
                                             const isSelected = selectedAnswers[idx] === optIdx;
                                             const isCorrect = q.correctAnswerIndex === optIdx;
                                             
                                             let buttonClass = "p-3 rounded-xl border text-left transition-all ";
                                             
                                             if (!showResults) {
                                                 buttonClass += isSelected 
                                                     ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300" 
                                                     : "border-stone-200 dark:border-stone-700 hover:border-indigo-300 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300";
                                             } else {
                                                 if (isCorrect) {
                                                     buttonClass += "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20";
                                                 } else if (isSelected && !isCorrect) {
                                                     buttonClass += "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 line-through opacity-70";
                                                 } else {
                                                     buttonClass += "border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-500 dark:text-stone-400 opacity-50";
                                                 }
                                             }

                                             return (
                                                 <button 
                                                     key={optIdx}
                                                     onClick={() => handleAnswerSelect(idx, optIdx)}
                                                     disabled={showResults}
                                                     className={buttonClass}
                                                 >
                                                     {opt}
                                                 </button>
                                             );
                                         })}
                                     </div>
                                 </div>
                             ))}
                          </div>
                          
                          {!showResults ? (
                              <button 
                                  onClick={() => setShowResults(true)}
                                  disabled={Object.keys(selectedAnswers).length < quizData.mcqs.length}
                                  className="mt-8 w-full py-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl font-bold disabled:opacity-50 transition-opacity"
                              >
                                  Submit Quiz
                              </button>
                          ) : (
                              <button 
                                  onClick={handleGenerate}
                                  className="mt-8 w-full py-3 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-xl font-bold hover:bg-indigo-200 transition-colors"
                              >
                                  Generate New Quiz
                              </button>
                          )}
                      </div>
                  )}
              </div>
          )}

          {/* EXAM VIEW */}
          {examData && activeTab === 'exam' && (
               <div className="space-y-6">
                   <div className="bg-white dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm">
                      <div className="flex items-center gap-2 mb-6 text-stone-500 dark:text-stone-400 pb-4 border-b border-stone-100 dark:border-stone-800">
                          <Clock className="w-5 h-5"/> 
                          <span>Mock Exam Mode - Treat this like a real test.</span>
                      </div>

                      {examData.shortAnswer && examData.shortAnswer.length > 0 && (
                          <div className="mb-8">
                              <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-4">Section A: Short Answer</h3>
                              <div className="space-y-6">
                                  {examData.shortAnswer.map((q, idx) => (
                                      <div key={idx}>
                                          <p className="font-semibold text-stone-800 dark:text-stone-200 mb-2">Q{idx + 1}. {q.question}</p>
                                          <textarea 
                                              placeholder="Type your answer here..."
                                              className="w-full h-24 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-3 text-sm focus:ring-1 focus:ring-indigo-500 resize-none"
                                          />
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}

                      {examData.essay && examData.essay.length > 0 && (
                           <div>
                               <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-4">Section B: Essay</h3>
                               <div className="space-y-8">
                                   {examData.essay.map((q, idx) => (
                                       <div key={idx} className="bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 p-5 rounded-xl">
                                           <p className="font-bold text-stone-900 dark:text-white mb-2">Essay Prompt {idx + 1}:</p>
                                           <p className="text-stone-700 dark:text-stone-300 mb-4">{q.prompt}</p>
                                           <textarea 
                                               placeholder="Begin your essay..."
                                               className="w-full h-48 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl p-4 focus:ring-1 focus:ring-indigo-500 resize-none mb-3"
                                           />
                                           <details className="text-sm">
                                               <summary className="cursor-pointer text-indigo-600 dark:text-indigo-400 font-semibold mb-2 outline-none">Toggle Grading Key (Points to Cover)</summary>
                                               <ul className="list-disc pl-5 space-y-1 text-stone-600 dark:text-stone-400 bg-white dark:bg-stone-900 p-3 rounded-lg border border-stone-100 dark:border-stone-800">
                                                   {q.expectedPoints?.map((pt, pIdx) => (
                                                       <li key={pIdx}>{pt}</li>
                                                   ))}
                                               </ul>
                                           </details>
                                       </div>
                                   ))}
                               </div>
                           </div>
                      )}
                   </div>
               </div>
          )}

        </div>
      </div>
    </div>
  );
}
