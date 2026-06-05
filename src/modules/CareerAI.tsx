import React, { useState, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import {
  Brain,
  Sparkles,
  MessageSquare,
  Briefcase,
  User,
  Send,
  Star,
  Code,
  ChevronRight,
  ArrowLeft,
  CircleCheck as CheckCircle2,
  Clock,
  BookOpen
} from "lucide-react/dist/esm/lucide-react";
import { careerAPI } from "../services/api";

export function CareerGuidance({ userProfile }) {
  const [messages, setMessages] = useState([
    {
      type: "ai",
      content: `Hello ${userProfile.name}! I'm your AI Career Advisor. I've analyzed your profile and I'm here to help guide your academic and career journey. With ${userProfile.points} points and rank #${userProfile.rank}, you're doing great! What would you like to explore today?`,
      timestamp: new Date(),
    },
  ]);

  // Update greeting when user logs in
  React.useEffect(() => {
    setMessages((prev) => {
      const newMessages = [...prev];
      if (newMessages.length > 0 && newMessages[0].type === "ai") {
        newMessages[0].content = `Hello ${userProfile.name}! I'm your AI Career Advisor. I've analyzed your profile and I'm here to help guide your academic and career journey. With ${userProfile.points || 0} points and rank #${userProfile.rank || 0}, you're doing great! What would you like to explore today?`;
      }
      return newMessages;
    });
  }, [userProfile.id, userProfile.name, userProfile.points, userProfile.rank]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const roadmapRef = useRef(null);

  // Roadmap Customization States
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState("6 Months");
  const [customWeeks, setCustomWeeks] = useState("");
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [aiRoadmap, setAiRoadmap] = useState(null);

  const careerPaths = [
    {
      id: "sde",
      title: "Software Engineer",
      match: 95,
      description: "Build applications and systems using programming languages. High demand in tech giants and startups.",
      skills: ["Java", "Python", "React", "Node.js", "System Design"],
      salary: "₹6-15 LPA",
      color: "from-blue-500 to-cyan-500",
      roadmap: [
        {
          title: "Computer Science Fundamentals",
          duration: "Months 1-2",
          description: "Master the core concepts that define efficient coding.",
          topics: ["Data Structures & Algorithms", "gperftools", "Operating Systems", "Computer Networks"],
          resources: ["LeetCode", "CS50 by Harvard"]
        },
        {
          title: "Web Development Basics",
          duration: "Month 3",
          description: "Learn how the web works and build static sites.",
          topics: ["HTML5 & CSS3", "JavaScript (ES6+)", "Git & GitHub", "Responsive Design"],
          resources: ["MDN Web Docs", "FreeCodeCamp"]
        },
        {
          title: "Frontend Specialization",
          duration: "Months 4-5",
          description: "Create dynamic, interactive user interfaces.",
          topics: ["React.js", "Tailwind CSS", "State Management (Redux)", "API Integration"],
          resources: ["React.dev", "NoteHub React Guides"]
        },
        {
          title: "Backend & Databases",
          duration: "Months 6-7",
          description: "Power your applications with server-side logic.",
          topics: ["Node.js & Express", "PostgreSQL / MongoDB", "Authentication (JWT)", "RESTful APIs"],
          resources: ["FullStackOpen"]
        },
        {
          title: "System Design & Deployment",
          duration: "Month 8+",
          description: "Scale your apps for millions of users.",
          topics: ["Docker & CI/CD", "Cloud Basics (AWS)", "High Level Design", "Microservices"],
          resources: ["System Design Primer"]
        }
      ]
    },
    {
      id: "ds",
      title: "Data Scientist",
      match: 88,
      description: "Analyze complex data and build predictive models to drive decision making.",
      skills: ["Python", "Machine Learning", "Statistics", "SQL", "Pandas"],
      salary: "₹8-20 LPA",
      color: "from-purple-500 to-pink-500",
      roadmap: [
        {
          title: "Mathematics & Statistics",
          duration: "Months 1-2",
          description: "The foundation of all data science models.",
          topics: ["Linear Algebra", "Calculus", "Probability", "Descriptive Statistics"],
          resources: ["Khan Academy", "3Blue1Brown"]
        },
        {
          title: "Python for Data Science",
          duration: "Months 3-4",
          description: "Learn the primary language of data.",
          topics: ["Python Syntax", "NumPy & Pandas", "Matplotlib & Seaborn", "Data Cleaning"],
          resources: ["Kaggle Learn", "DataCamp"]
        },
        {
          title: "Machine Learning Basics",
          duration: "Months 5-6",
          description: "Teach computers to learn from data.",
          topics: ["Supervised Learning", "Unsupervised Learning", "Scikit-learn", "Model Evaluation"],
          resources: ["Andrew Ng's ML Course"]
        },
        {
          title: "Deep Learning & NLP",
          duration: "Months 7-8",
          description: "Advanced AI techniques.",
          topics: ["Neural Networks", "TensorFlow / PyTorch", "NLP Basics", "Computer Vision"],
          resources: ["fast.ai"]
        }
      ]
    },
    {
      id: "cloud",
      title: "Cloud Engineer",
      match: 82,
      description: "Design and manage scalable cloud infrastructure and DevOps pipelines.",
      skills: ["AWS", "Azure", "Docker", "Kubernetes", "Linux"],
      salary: "₹7-18 LPA",
      color: "from-orange-500 to-red-500",
      roadmap: [
        {
          title: "Linux & Scripting",
          duration: "Months 1-2",
          description: "Master the OS that powers the cloud.",
          topics: ["Linux Command Line", "Bash Scripting", "Networking Basics", "SSH & Security"],
          resources: ["LinuxJourney", "OverTheWire"]
        },
        {
          title: "Containerization",
          duration: "Months 3-4",
          description: "Package applications for consistency.",
          topics: ["Docker Fundamentals", "Docker Compose", "Container Registries"],
          resources: ["Docker Curriculum"]
        },
        {
          title: "Cloud Provider (AWS)",
          duration: "Months 5-6",
          description: "Learn the industry standard cloud platform.",
          topics: ["EC2 & S3", "IAM Security", "VPC Networking", "Lambda Serverless"],
          resources: ["AWS Certified Practitioner"]
        },
         {
          title: "Orchestration & IaC",
          duration: "Months 7-8",
          description: "Automate and scale infrastructure.",
          topics: ["Kubernetes", "Terraform", "Ansible", "CI/CD Pipelines"],
          resources: ["LearnK8s"]
        }
      ]
    },
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await careerAPI.chat(currentInput);
      
      const aiMsg = {
        type: "ai",
        content: response.message || response.text || "I apologize, I couldn't process that request.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Career AI Error:", error);
      const errorMsg = {
        type: "ai",
        content: "Sorry, I'm having trouble connecting to the server. Please try again later.",
        timestamp: new Date(),
        isError: true
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGenerateCustomRoadmap = async () => {
    if (!selectedCareer) return;
    
    setIsGeneratingRoadmap(true);
    const duration = selectedDuration === "Custom Weeks" ? `${customWeeks} Weeks` : selectedDuration;
    
    try {
      const prompt = `Create a detailed ${duration} career roadmap for becoming a ${selectedCareer.title}. 
      Break it down into logical ${selectedDuration === "Custom Weeks" ? 'weekly' : 'monthly'} steps.
      For each step, provide: 1. Title, 2. Duration, 3. Description, 4. Key Topics, 5. Resources.
      Format the response as a clear, structured Markdown roadmap that I can render.
      Start with a brief encouraging sentence.`;
      
      const response = await careerAPI.chat(prompt);
      setAiRoadmap(response.message || response.text);
    } catch (error) {
      console.error("Roadmap Generation Error:", error);
      alert("Failed to generate custom roadmap. Please try again.");
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  const downloadRoadmapPDF = async () => {
    if (!roadmapRef.current) return;
    
    try {
      const canvas = await html2canvas(roadmapRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        // position needs to shift up by the pageHeight for each new page
        // Since position starts at 0, next page it should be -pageHeight, then -2*pageHeight etc.
        // But the while loop logic conventionally uses:
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`NoteHub_${selectedCareer.title}_Roadmap.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  const renderContent = () => {
    if (activeTab === "chat") {
        return (
          <div className="grid grid-cols-1 gap-6">
            <div
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden flex flex-col shadow-sm"
              style={{ height: "600px" }}
            >
              {/* Chat Header */}
              <div className="p-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 backdrop-blur-sm">
                <h2 className="text-lg font-bold flex items-center font-heading text-stone-900 dark:text-white">
                  <Brain className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                  AI Career Advisor
                </h2>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50 dark:bg-stone-950/30">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-xl ${
                        msg.type === "user"
                          ? "flex-row-reverse space-x-reverse"
                          : ""
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ${
                          msg.type === "user"
                            ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                            : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                        }`}
                      >
                        {msg.type === "user" ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Brain className="w-4 h-4" />
                        )}
                      </div>
                      <div
                        className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm prose dark:prose-invert max-w-none ${
                          msg.type === "user"
                            ? "bg-indigo-600 text-white rounded-tr-sm"
                            : "bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 border border-stone-200 dark:border-stone-800 rounded-tl-sm"
                        }`}
                      >
                        {msg.type === 'user' ? (
                          <p>{msg.content}</p>
                        ) : (
                          <ReactMarkdown
                            components={{
                              p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                              h3: ({node, ...props}) => <h3 className="text-base font-bold mb-2 mt-1 text-purple-600 dark:text-purple-400" {...props} />,
                              ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                              ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                              li: ({node, ...props}) => <li className="mb-0.5" {...props} />,
                              strong: ({node, ...props}) => <strong className="font-bold text-stone-900 dark:text-white" {...props} />,
                              hr: () => <hr className="my-3 border-stone-200 dark:border-stone-700" />,
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="px-4 py-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-800 rounded-2xl rounded-tl-sm shadow-sm">
                      <div className="flex space-x-1.5">
                        <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder={!userProfile.id ? "Please log in to chat with the AI Advisor..." : "Ask about skills, interview tips, or career paths..."}
                      disabled={isTyping || !userProfile.id}
                      className="flex-1 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm shadow-sm disabled:opacity-50 text-stone-900 dark:text-white"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isTyping || !inputMessage.trim() || !userProfile.id}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-3 rounded-xl transition-colors shadow-sm flex items-center justify-center font-medium"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  {!userProfile.id && (
                    <p className="text-xs text-red-500 mt-2 text-center">
                      You must be logged in to chat with the AI Career Advisor.
                    </p>
                  )}
                </div>
            </div>
          </div>
        );
    } 

    if (activeTab === "careers") {
        if (selectedCareer) {
            // RENDER DETAIL VIEW (ROADMAP)
            return (
                <div className="animate-fade-in-up">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <button 
                           onClick={() => { setSelectedCareer(null); setAiRoadmap(null); }}
                           className="flex items-center text-stone-500 hover:text-indigo-600 transition font-medium"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Career Paths
                        </button>

                        <div className="flex items-center gap-2">
                            {aiRoadmap && (
                                <button 
                                    onClick={downloadRoadmapPDF}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition text-sm font-bold flex items-center gap-2 shadow-sm"
                                >
                                    <Briefcase className="w-4 h-4" />
                                    Download PDF
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Duration Configurator */}
                    <div className="bg-white dark:bg-stone-900 rounded-xl p-4 border border-stone-200 dark:border-stone-800 shadow-sm mb-6 flex flex-wrap items-center gap-4">
                        <span className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                            <Clock className="w-4 h-4 text-indigo-600" />
                            Target Duration:
                        </span>
                        <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-lg">
                            {["3 Months", "6 Months", "Custom Weeks"].map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setSelectedDuration(d)}
                                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition ${
                                        selectedDuration === d 
                                        ? "bg-white dark:bg-stone-700 text-indigo-600 dark:text-white shadow-sm" 
                                        : "text-stone-500 hover:text-stone-900 dark:hover:text-stone-300"
                                    }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>

                        {selectedDuration === "Custom Weeks" && (
                            <div className="flex items-center gap-2 mt-4 md:mt-0">
                                <input 
                                    type="number"
                                    min="1"
                                    max="52"
                                    value={customWeeks}
                                    onChange={(e) => setCustomWeeks(e.target.value)}
                                    placeholder="7"
                                    disabled={!userProfile.id}
                                    className="w-20 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                                />
                                <span className="text-sm text-stone-500">weeks</span>
                            </div>
                        )}
                        
                        <div className="flex flex-col items-end">
                            <button
                                onClick={handleGenerateCustomRoadmap}
                                disabled={isGeneratingRoadmap || (selectedDuration === "Custom Weeks" && !customWeeks) || !userProfile.id}
                                className="ml-auto bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-400 font-medium px-4 py-2 rounded-xl text-sm transition-colors flex items-center shadow-sm disabled:opacity-50 mt-4 md:mt-0"
                            >
                                {isGeneratingRoadmap ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-2" />
                                        Planning...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Generate Custom Roadmap
                                    </>
                                )}
                            </button>
                            {!userProfile.id && (
                                <p className="text-xs text-red-500 mt-1">Login required</p>
                            )}
                        </div>
                    </div>

                    <div ref={roadmapRef} className="bg-white dark:bg-stone-900 rounded-xl p-8 border border-stone-200 dark:border-stone-800 shadow-sm relative overflow-hidden">
                        {aiRoadmap ? (
                            <div className="prose dark:prose-invert max-w-none">
                                <ReactMarkdown
                                    components={{
                                        h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-4" {...props} />,
                                        h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-8 mb-4 text-indigo-600 border-b pb-2 border-stone-100 dark:border-stone-800" {...props} />,
                                        h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-6 mb-2 text-stone-900 dark:text-white" {...props} />,
                                        ul: ({node, ...props}) => <ul className="list-disc pl-6 space-y-2 my-4" {...props} />,
                                        li: ({node, ...props}) => <li className="text-stone-700 dark:text-stone-300" {...props} />,
                                        strong: ({node, ...props}) => <strong className="text-indigo-600 dark:text-indigo-400 font-bold" {...props} />,
                                        hr: () => <hr className="my-8 border-stone-100 dark:border-stone-800" />,
                                    }}
                                >
                                    {aiRoadmap}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <>
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${selectedCareer.color} opacity-10 rounded-bl-full pointer-events-none`} />
                                
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10 mb-8">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h2 className="text-3xl font-bold text-stone-900 dark:text-white">{selectedCareer.title}</h2>
                                            <div className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-bold">
                                                {selectedCareer.match}% Match
                                            </div>
                                        </div>
                                        <p className="text-stone-500 dark:text-stone-400 max-w-2xl text-lg">
                                            {selectedCareer.description}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-stone-500 uppercase tracking-wide font-semibold">Avg Salary</div>
                                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{selectedCareer.salary}</div>
                                    </div>
                                </div>

                                {/* Roadmap Steps (Static Fallback) */}
                                <div className="relative">
                                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-stone-200 dark:bg-stone-800" />
                                    
                                    <div className="space-y-12 pb-12">
                                        {selectedCareer.roadmap.map((step, index) => (
                                            <div key={index} className="relative pl-24 group">
                                                <div className={`absolute left-[26px] top-0 w-4 h-4 rounded-full border-4 border-white dark:border-stone-900 ${
                                                    index === 0 ? "bg-emerald-500 ring-4 ring-emerald-500/20" : "bg-indigo-500"
                                                }`} />
                                                
                                                <div className="bg-white dark:bg-stone-100/5 rounded-xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Step {index + 1}</span>
                                                                <span className="text-xs text-stone-400">•</span>
                                                                <div className="flex items-center text-stone-500 text-xs font-medium bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                                                                    <Clock className="w-3 h-3 mr-1" />
                                                                    {step.duration}
                                                                </div>
                                                            </div>
                                                            <h3 className="text-xl font-bold text-stone-900 dark:text-white">{step.title}</h3>
                                                        </div>
                                                    </div>
                                                    
                                                    <p className="text-stone-600 dark:text-stone-400 mb-6 border-l-4 border-indigo-100 dark:border-indigo-900/50 pl-4 py-1 italic">
                                                        "{step.description}"
                                                    </p>
                                                    
                                                    <div className="grid md:grid-cols-2 gap-6">
                                                        <div>
                                                            <h4 className="font-bold text-sm text-stone-900 dark:text-white mb-3 flex items-center">
                                                                <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
                                                                What to Learn
                                                            </h4>
                                                            <div className="flex flex-wrap gap-2">
                                                                {step.topics.map((t, i) => (
                                                                    <span key={i} className="px-2 py-1 bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs rounded border border-stone-200 dark:border-stone-700">
                                                                        {t}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-sm text-stone-900 dark:text-white mb-3 flex items-center">
                                                                <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                                                                Resources
                                                            </h4>
                                                            <ul className="space-y-1">
                                                                {step.resources.map((r, i) => (
                                                                    <li key={i} className="text-sm text-stone-500 dark:text-stone-400 flex items-center">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-stone-300 mr-2" />
                                                                        <a href="#" className="hover:text-indigo-600 hover:underline">{r}</a>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            );
        }

        // RENDER LIST VIEW
        return (
            <div>
                <div className="mb-8 p-6 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 rounded-xl">
                  <h2 className="text-2xl font-bold mb-2 font-heading text-stone-900 dark:text-white">
                    Recommended Career Paths
                  </h2>
                  <p className="text-stone-500 dark:text-stone-400">
                    Based on your profile, interests:{" "}
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">{(userProfile.interests || []).join(", ")}</span>
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {careerPaths.map((career, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedCareer(career)}
                      className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-sm hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700/50 transition group cursor-pointer transform hover:-translate-y-1"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-br ${career.color} bg-opacity-10 text-white shadow-sm`}
                        >
                          <Code className="w-6 h-6" />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-stone-900 dark:text-white">{career.match}%</div>
                          <div className="text-xs text-stone-500 font-medium uppercase tracking-wider">Match</div>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold mb-2 text-stone-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center">
                        {career.title}
                        <ChevronRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-stone-500 dark:text-stone-400 text-sm mb-6 leading-relaxed line-clamp-2">
                        {career.description}
                      </p>

                      <div className="mb-6">
                        <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
                          Key Skills
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {career.skills.slice(0, 3).map((skill, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md text-xs font-medium text-stone-600 dark:text-stone-300"
                            >
                              {skill}
                            </span>
                          ))}
                          {career.skills.length > 3 && (
                              <span className="px-2.5 py-1 text-xs font-medium text-stone-400">+{career.skills.length - 3} more</span>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-between items-center text-sm">
                        
                        <div className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">
                          {career.salary}
                        </div>
                        <span className="text-indigo-600 font-medium text-xs">View Roadmap →</span>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
        );
    }
    
    return null;
  };

  return (
    <div className="pt-16 min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Brain className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold flex items-center font-heading text-stone-900 dark:text-white">
                  AI Career Guidance
                  <Sparkles className="w-5 h-5 ml-2 text-amber-400" />
                </h1>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Personalized career planning powered by AI
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            {
              id: "chat",
              label: "AI Chat",
              icon: <MessageSquare className="w-4 h-4" />,
            },
            {
              id: "careers",
              label: "Career Paths",
              icon: <Briefcase className="w-4 h-4" />,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSelectedCareer(null); }}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? "bg-stone-900 dark:bg-white text-white dark:text-stone-900"
                  : "bg-white dark:bg-stone-800 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-800"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </div>
  );
}
