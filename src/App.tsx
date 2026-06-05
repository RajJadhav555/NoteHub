import React from 'react';
// @ts-ignore
const { useState, useEffect, useRef } = React;
// @ts-ignore
import { BookOpen, Menu, X, Search, ChevronDown, Sun, Moon, GraduationCap, Shield } from 'lucide-react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LoginPage } from './modules/Login';
import { HomePage as LandingPage } from './modules/Home';
import { NotesAIChatModal, VerifiedNotesPage } from './modules/Notes';
import { CollaborationPage } from './modules/Collaborate';
import { GamificationPage } from './modules/Leaderboard';
import { CareerGuidance } from './modules/CareerAI';
import { ProfilePage } from './modules/Profile';
import { PYQAnalyzer } from './modules/PYQAnalyzer';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { io } from "socket.io-client";

import { 
  notesAPI, 
  usersAPI, 
  leaderboardAPI, 
  messagesAPI,
  careerAPI 
} from './services/api';

const GOOGLE_CLIENT_ID = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || "245527865578-l4jhi8jvpt0hv7brfpughg3o1n3fp7lu.apps.googleusercontent.com";

// Popup Modal for Visitor Access
const LoginPromptModal = ({ isOpen, onClose, message, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-2xl w-full max-w-sm shadow-2xl border border-stone-200 dark:border-stone-800 p-6 relative transform transition-all scale-100">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <span className="text-3xl">🔒</span>
          </div>
          <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2 font-heading">
            Access Restricted
          </h3>
          <p className="text-stone-600 dark:text-stone-400 mb-6 leading-relaxed">
            {message}
          </p>
          
          <div className="space-y-3">
            <button
              onClick={onLogin}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition transform active:scale-95"
            >
              Login / Sign Up
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-xl font-medium hover:bg-stone-200 dark:hover:bg-stone-700 transition"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginMenu, setShowLoginMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Popup State
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  const [promptMessage, setPromptMessage] = useState("");

  const loginMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userProfile, setUserProfile] = useState({
    name: "Guest User",
    email: "",
    semester: "Semester 1",
    department: "General",
    interests: [],
    uploads: 0,
    points: 0,
    rank: 0,
    badges: [],
    verifiedNotes: 0,
    collaborations: 0,
    is_verified: false,
    hasFlare: false
  });


  const [notes, setNotes] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  // Fetch initial data
  const defaultUser = {
    name: "Guest User",
    email: "",
    semester: "Semester 1",
    department: "General",
    interests: [],
    uploads: 0,
    points: 0,
    rank: 0,
    badges: [],
    verifiedNotes: 0,
    collaborations: 0,
    is_verified: false,
    hasFlare: false
  };


  // Fetch initial data & restore session
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const [fetchedNotes, fetchedLeaderboard] = await Promise.all([
          notesAPI.getVerifiedNotes(),
          leaderboardAPI.getLeaderboard()
        ]);
        
        setNotes(fetchedNotes || []);
        setLeaderboard(fetchedLeaderboard || []);
        
        // Restore session from sessionStorage
        const storedUser = sessionStorage.getItem('notehub_user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);

            // Find this user's live rank in the leaderboard data we just fetched
            const liveEntry = (fetchedLeaderboard || []).find(
              (u: any) => String(u.user_id) === String(parsedUser.id)
            );
            const liveRank = liveEntry ? Number(liveEntry.rank) : (parsedUser.rank || 0);
            const livePoints = liveEntry ? Number(liveEntry.points) : (parsedUser.points || 0);
            const liveUploads = liveEntry ? Number(liveEntry.uploads) : (parsedUser.uploads || 0);

            // 1. Set initial state from storage + live rank for immediate UI
            setUserProfile({ ...defaultUser, ...parsedUser, rank: liveRank, points: livePoints, uploads: liveUploads });
            setIsLoggedIn(true);

            // 2. Fetch fresh profile data in background and re-apply live rank
            if (parsedUser.id) {
               usersAPI.getUserById(parsedUser.id)
                  .then(freshUser => {
                      if (freshUser) {
                          // Re-find rank in case leaderboard changed
                          const updatedEntry = (fetchedLeaderboard || []).find(
                            (u: any) => String(u.user_id) === String(parsedUser.id)
                          );
                          const freshRank = updatedEntry ? Number(updatedEntry.rank) : liveRank;
                          const freshPoints = updatedEntry ? Number(updatedEntry.points) : freshUser.points || 0;
                          const freshUploads = updatedEntry ? Number(updatedEntry.uploads) : freshUser.uploads || 0;

                          const mergedUser = { ...freshUser, rank: freshRank, points: freshPoints, uploads: freshUploads };
                          setUserProfile(mergedUser);
                          sessionStorage.setItem('notehub_user', JSON.stringify(mergedUser));
                      }
                  })
                  .catch(err => console.error("Failed to refresh user stats:", err));
            }

          } catch (e) {
            console.error("Failed to parse stored user", e);
            sessionStorage.removeItem('notehub_user');
            setUserProfile(defaultUser);
            setIsLoggedIn(false);
          }
        } else {
            // Ensure clean state
            setUserProfile(defaultUser);
            setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Failed to load application data. Please ensure backend is running.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();

    // Poll leaderboard every 15 seconds so active status dynamically changes
    const pollLeaderboard = async () => {
      try {
        const freshLeaderboard = await leaderboardAPI.getLeaderboard();
        setLeaderboard(freshLeaderboard || []);
      } catch (e) {
        // silent fail
      }
    };
    const pollInterval = setInterval(pollLeaderboard, 15000);
    return () => clearInterval(pollInterval);
  }, []);

  // Heartbeat for online status
  useEffect(() => {
    if (!isLoggedIn || !(userProfile as any)?.id) return;

    const sendPulse = () => {
       // @ts-ignore
       usersAPI.sendHeartbeat((userProfile as any).id, (userProfile as any).current_session_token || null);
    };

    sendPulse(); // Immediate pulse
    const interval = setInterval(sendPulse, 60000); // Pulse every 60s
    return () => clearInterval(interval);
  }, [isLoggedIn, (userProfile as any).id]);

  // Global Web Socket for real-time presence
  useEffect(() => {
    if (!isLoggedIn || !(userProfile as any)?.id) return;
    
    const SOCKET_URL = window.location.hostname.includes('vercel.app') 
        ? 'https://rajdjadhav-notehub-backend.hf.space'
        // @ts-ignore
        : API_BASE_URL.replace('/api', '');

    const globalSocket = io(SOCKET_URL, {
        query: { userId: (userProfile as any).id, userName: (userProfile as any).name },
        transports: ['websocket', 'polling']
    });

    globalSocket.on("online_status_changed", async () => {
        try {
            const freshLeaderboard = await leaderboardAPI.getLeaderboard();
            setLeaderboard(freshLeaderboard || []);
        } catch (e) {
            console.error("Failed to fetch fresh leaderboard via socket", e);
        }
    });

    return () => {
        globalSocket.disconnect();
    };
  }, [isLoggedIn, (userProfile as any).id]);

  // Handle click outside to close menus
  useEffect(() => {
    function handleClickOutside(event) {
      if (loginMenuRef.current && !loginMenuRef.current.contains(event.target)) {
        setShowLoginMenu(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [loginMenuRef, profileMenuRef]);

  // Updated navigation handler with React Router support
  const navigateTo = (page) => {
    const path = page === 'landing' ? '/' : `/${page}`;
    navigate(path);
    setIsMenuOpen(false); 
    setShowProfileMenu(false); 
    window.scrollTo(0, 0);
  };

  const handleLoginSuccess = (authData) => {
    const { user, token, sessionToken } = authData;
    setIsLoggedIn(true);
    setUserProfile(user);
    sessionStorage.setItem('notehub_user', JSON.stringify(user));
    if (token) sessionStorage.setItem('notehub_token', token);
    if (sessionToken) sessionStorage.setItem('notehub_session_token', sessionToken);
    // Force all users to the Student Dashboard (Home) as requested
    navigateTo('landing');
  };

  const handleLogout = () => {
    if (userProfile && (userProfile as any).id) {
        usersAPI.setOffline((userProfile as any).id);
    }
    
    setIsLoggedIn(false);
    setUserProfile({
        name: "Guest User",
        email: "",
        semester: "Semester 1",
        department: "General",
        interests: [],
        uploads: 0,
        points: 0,
        rank: 0,
        badges: [],
        verifiedNotes: 0,
        collaborations: 0,
        is_verified: false,
        hasFlare: false
    });
    sessionStorage.removeItem('notehub_user');
    sessionStorage.removeItem('notehub_token');
    sessionStorage.removeItem('notehub_session_token');
    navigateTo('landing');
  };

  const handleUploadNote = () => {
     alert("Upload feature coming soon!");
  };

  const handleVerifyNote = (noteId) => {
      alert(`Note ${noteId} verified! (Mock action)`);
  };

  const handleDownloadNote = (note) => {
      alert(`Downloading ${note.title}...`);
  };

  const handleSendMessage = async (message) => {
    try {
      // Optimistic update
      setChatMessages(prev => [...prev, { 
        id: prev.length + 1, 
        ...message 
      }]);
      
      await messagesAPI.sendMessage(message);
    } catch (err) {
      console.error("Message send failed:", err);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderNavigation = () => {
    // Only apply transparent/marketing style if on landing page AND NOT LOGGED IN
    // Simplified Navbar for stability across all slides
    const navBackground = 'bg-white/80 dark:bg-stone-900/80 backdrop-blur-md shadow-sm';
    
    const textColor = 'text-stone-600 dark:text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-400';

    const activeLinkClass = "text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-900/20";
    const inactiveLinkClass = textColor;

    const logoText = 'text-stone-900 dark:text-white';
    const bookIconColor = 'text-indigo-600 dark:text-indigo-400';

    const stats = [
    { value: "1,250+", label: "Verified Notes" },
    { value: "5,000+", label: "Active Students" },
    { value: "4.9/5", label: "Average Rating" },
  ];
    const navItems = [
      { id: 'landing', label: 'Home', public: true },
      { id: 'notes', label: 'Notes', public: true },
      { id: 'collab', label: 'Collaborate', public: false, prompt: "Collaborate with peers in real-time! Please login to join study rooms." },
      { id: 'gamify', label: 'Leaderboard', public: false, prompt: "Compete with top students! Login to see your rank and earn badges." },
      { id: 'career', label: 'Career AI', public: false, prompt: "Get personalized career guidance! Login to unlock AI-powered insights." },
      { id: 'pyq', label: 'PYQ AI', public: false, prompt: "Analyze Previous Year Questions with AI! Login to access smart insights." },
      { id: 'admin', label: 'Admin', public: false },
    ];

    // Navigation handler to enforce login or show popup
    const handleNavigation = (item) => {
      if (item.public || isLoggedIn || item.id === 'login' || item.id === 'admin') {
        navigateTo(item.id);
      } else {
        // Show Popup for restricted items
        setPromptMessage(item.prompt || "Please login to access this feature.");
        setShowLoginPrompt(true);
      }
    };

    return (
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBackground}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigateTo('landing')}>
              <BookOpen className={`w-8 h-8 ${bookIconColor}`} />
              <span className={`text-xl font-bold font-heading ${logoText}`}>NoteHub</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                 if (item.id === 'admin') return null; // Hide Admin from main nav
                 if (!item.public && !isLoggedIn) return null; // Hide restricted items for visitors
                 return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                      (location.pathname === '/' && item.id === 'landing') || (location.pathname === `/${item.id}`) ? activeLinkClass : inactiveLinkClass
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${textColor} hover:bg-stone-100 dark:hover:bg-stone-800`}
                title={`Theme: ${theme}`}
              >
                {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              {!isLoggedIn ? (
                <div className="relative" ref={loginMenuRef}>
                  <button 
                    className="px-5 py-2.5 rounded-xl font-bold transition shadow-lg shadow-indigo-500/20 bg-indigo-600 text-white hover:bg-indigo-700"
                    onClick={() => navigateTo('login')}
                  >
                    Login
                  </button>
                </div>
              ) : (
                <div className="relative ml-4" ref={profileMenuRef}>
                  <button 
                    className="flex items-center space-x-2 cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800 p-2 rounded-lg transition"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                      {userProfile.name ? userProfile.name[0] : 'U'}
                    </div>
                    <span className={`text-sm font-medium ${logoText}`}>{userProfile.name ? userProfile.name.split(' ')[0] : 'User'}</span>
                    <ChevronDown className={`w-4 h-4 ${logoText}`} />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-stone-800 rounded-xl shadow-xl border border-stone-200 dark:border-stone-700 py-1 overflow-hidden z-20">
                      <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-700">
                        <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">Signed in as</p>
                        <p className="text-sm font-medium text-stone-900 dark:text-white truncate">{userProfile.email}</p>
                      </div>
                      
                      <button
                        onClick={() => navigateTo('profile')}
                        className="block w-full text-left px-4 py-3 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 transition"
                      >
                        Your Profile
                      </button>
                      
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition font-medium"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button 
              className={`md:hidden ${logoText}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white/95 dark:bg-stone-900/95 backdrop-blur-lg border-t border-stone-200 dark:border-stone-800 shadow-xl">
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navItems.map((item) => {
                 if (item.id === 'admin') return null;
                 if (!item.public && !isLoggedIn) return null; // Hide restricted items for visitors
                 return (
                  <button
                    key={item.id}
                    onClick={() => { handleNavigation(item); setIsMenuOpen(false); }}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                      (location.pathname === '/' && item.id === 'landing') || (location.pathname === `/${item.id}`) 
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
              
              {/* Theme Toggle Mobile */}
              <button
                onClick={() => { toggleTheme(); setIsMenuOpen(false); }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors border-t border-stone-100 dark:border-stone-800 mt-2 pt-2"
              >
                <span>Theme</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-semibold opacity-70">{theme}</span>
                  {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </div>
              </button>
            </div>
          </div>
        )}
      </nav>
    );
  };

  const handleProfileUpdate = (updatedUser) => {
    setUserProfile({ ...userProfile, ...updatedUser });
  };

  const handleAddNote = (newNote) => {
    setNotes(prev => {
      if (prev.find(n => n.id === newNote.id)) return prev;
      return [newNote, ...prev];
    });
  };

  const refreshUserProfile = async () => {
    if (userProfile && (userProfile as any).id) {
       try {
           const freshUser = await usersAPI.getUserById((userProfile as any).id);
           if (freshUser) {
               const currentLeaderboard = await leaderboardAPI.getLeaderboard().catch(() => []);
               const liveEntry = (currentLeaderboard || []).find((u: any) => String(u.user_id) === String((userProfile as any).id));
               
               const mergedUser = { 
                  ...userProfile, 
                  ...freshUser,
                  rank: liveEntry ? Number(liveEntry.rank) : freshUser.rank
               };
               setUserProfile(prev => mergedUser);
               sessionStorage.setItem('notehub_user', JSON.stringify(mergedUser));
           }
       } catch (err) {
           console.error("Failed to refresh user stats:", err);
       }
    }
  };

  const handleDeleteNote = (noteId) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
  };

  const handleRateNote = (noteId, newRating) => {
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, rating: newRating } : n));
  };

  const [selectedNote, setSelectedNote] = useState(null);

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    navigateTo('notes');
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
        {renderNavigation()}
        
        <Routes>
          <Route path="/" element={<LandingPage isLoggedIn={isLoggedIn} userProfile={userProfile} onNoteClick={handleNoteClick} />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/profile" element={<ProfilePage userProfile={userProfile} onProfileUpdate={handleProfileUpdate} />} />
          <Route path="/notes" element={<VerifiedNotesPage notes={notes} onVerify={handleVerifyNote} onDownload={handleDownloadNote} userProfile={userProfile} onAddNote={handleAddNote} onDeleteNote={handleDeleteNote} onRateUpdate={handleRateNote} initialNote={selectedNote} onClearInitialNote={() => setSelectedNote(null)} refreshUserProfile={refreshUserProfile} />} />
          <Route path="/collab" element={<CollaborationPage userProfile={userProfile} />} />
          <Route path="/gamify" element={<GamificationPage leaderboard={leaderboard} userProfile={userProfile} onAddNote={handleAddNote} />} />
          <Route path="/career" element={<CareerGuidance userProfile={userProfile} />} />
          <Route path="/pyq" element={<PYQAnalyzer />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

      
      {/* Login Prompt Modal */}
      <LoginPromptModal 
        isOpen={showLoginPrompt} 
        onClose={() => setShowLoginPrompt(false)} 
        message={promptMessage}
        onLogin={() => {
            setShowLoginPrompt(false);
            navigateTo('login');
        }}
      />
      </div>
    </GoogleOAuthProvider>
  );
};
