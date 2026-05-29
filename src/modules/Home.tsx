import React from "react";
import {
  BookOpen,
  Shield,
  Users,
  Zap,
  Award,
  CheckCircle,
  MessageSquare,
  TrendingUp,
  Download,
  ChevronRight,
  Star,
  FileText,
  Clock,
  Code,
  Lightbulb,
  ArrowRight,
  Sparkles,
  Target,
  Briefcase,
  GraduationCap,
  Brain,
  Crown,
  AlertCircle,
} from "lucide-react/dist/esm/lucide-react";
import { useNavigate } from 'react-router-dom';


import { notesAPI, leaderboardAPI } from "../services/api";

// The Dashboard component for logged-in users
function StudentDashboard({ userProfile, onNoteClick }) {
  const navigate = useNavigate();
  const [recentNotes, setRecentNotes] = React.useState([]);
  const [topStudents, setTopStudents] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [notes, leaderboard] = await Promise.all([
          notesAPI.getVerifiedNotes().catch((e) => []),
          leaderboardAPI.getLeaderboard().catch((e) => []),
        ]);

        // Take top 4 recent notes (Safety Check)
        if (Array.isArray(notes)) {
          setRecentNotes(notes.slice(0, 4));
        } else {
          console.error("Notes API returned non-array:", notes);
          setRecentNotes([]);
        }

        // Take top 3 students (Safety Check)
        if (Array.isArray(leaderboard)) {
          setTopStudents(leaderboard.slice(0, 3));
        } else {
          console.error("Leaderboard API returned non-array:", leaderboard);
          setTopStudents([]);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2 font-heading">
              Welcome back, {userProfile?.name?.split(" ")[0] || "Student"}! 👋
            </h1>
            <p className="text-indigo-100 max-w-xl">
              You're doing great! Check out the latest notes or verify some
              pending uploads to earn more points.
            </p>
          </div>
        </div>

        {/* Dynamic Alerts (Latest Features) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {!userProfile?.is_verified && (

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-200/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="w-16 h-16 bg-white dark:bg-amber-900/30 rounded-2xl flex items-center justify-center shadow-sm relative z-10">
                <Shield className="w-8 h-8 text-amber-600" />
              </div>
              <div className="flex-1 text-center sm:text-left relative z-10">
                <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-1">Boost Your Points! 🚀</h3>
                <p className="text-sm text-amber-700 dark:text-amber-400 mb-4 leading-relaxed">
                  Verify your student identity to unlock a **1.1x multiplier** on all points earned from note uploads.
                </p>
                <button 
                  onClick={() => navigate('/profile')}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl transition shadow-lg shadow-amber-600/20 transform active:scale-95"
                >
                  Verify Now
                </button>
              </div>
            </div>
          )}

          {userProfile?.hasFlare && (

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 border border-indigo-200 dark:border-indigo-800/50 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden group">
               <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-200/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="w-16 h-16 bg-white dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center shadow-sm relative z-10 flare-glow">
                <Crown className="w-8 h-8 text-indigo-600" />
              </div>
              <div className="flex-1 text-center sm:text-left relative z-10">
                <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-100 mb-1 flex items-center justify-center sm:justify-start gap-2">
                  Flare Active! 🔥
                  <span className="inline-block animate-pulse w-2 h-2 rounded-full bg-green-500"></span>
                </h3>
                <p className="text-sm text-indigo-700 dark:text-indigo-400 mb-4 leading-relaxed">
                  Your department is currently leading the **Departmental War**! Enjoy **+10% bonus points** on every activity.
                </p>
                <button 
                  onClick={() => navigate('/gamify')}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition shadow-lg shadow-indigo-600/20 transform active:scale-95"
                >
                  View War Stats
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 flex items-center gap-4 hover:shadow-md transition">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-xl">
              🏆
            </div>
            <div>
              <div className="text-2xl font-bold text-stone-900 dark:text-white">
                {userProfile?.points || 0}
              </div>

              <div className="text-xs text-stone-500 font-medium uppercase tracking-wide">
                Total Points
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 flex items-center gap-4 hover:shadow-md transition">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-xl">
              📤
            </div>
            <div>
              <div className="text-2xl font-bold text-stone-900 dark:text-white">
                {userProfile?.uploads || 0}
              </div>

              <div className="text-xs text-stone-500 font-medium uppercase tracking-wide">
                Uploads
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 flex items-center gap-4 hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-xl">
              ✅
            </div>
            <div>
              <div className="text-2xl font-bold text-stone-900 dark:text-white">
                {userProfile?.verifiedNotes || 0}
              </div>

              <div className="text-xs text-stone-500 font-medium uppercase tracking-wide">
                Verified
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 flex items-center gap-4 hover:shadow-md transition">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-xl">
              🏅
            </div>
            <div>
              <div className="text-2xl font-bold text-stone-900 dark:text-white">
                #{userProfile?.rank || "-"}
              </div>

              <div className="text-xs text-stone-500 font-medium uppercase tracking-wide">
                Global Rank
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/notes")}
              className="group p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition text-left shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-stone-900 dark:text-white mb-1">
                Browse Notes
              </h3>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Find study materials for your courses
              </p>
            </button>

            <button
              onClick={() => navigate("/pyq")}
              className="group p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition text-left shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-stone-900 dark:text-white mb-1">
                PYQ AI Analysis
              </h3>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Analyze past year questions with AI
              </p>
            </button>

            <button
              onClick={() => navigate("/gamify")}
              className="group p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition text-left shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-stone-900 dark:text-white mb-1">
                Check Leaderboard
              </h3>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                See where you stand among peers
              </p>
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="group p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition text-left shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-stone-900 dark:text-white mb-1">
                Identity Verification
              </h3>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Verify your ID for bonus multipliers
              </p>
            </button>
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Recent Notes Section */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                Recently Added
              </h2>
              <button
                onClick={() => navigate("/notes")}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {isLoading ? (
                [1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-48 bg-stone-200 dark:bg-stone-800 rounded-xl animate-pulse"
                  ></div>
                ))
              ) : recentNotes.length > 0 ? (
                recentNotes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-white dark:bg-stone-900 rounded-xl p-4 border border-stone-200 dark:border-stone-800 hover:shadow-md transition flex gap-4 cursor-pointer"
                    onClick={() => onNoteClick && onNoteClick(note)}
                  >
                    <div className="w-20 h-24 bg-stone-100 dark:bg-stone-800 rounded-lg flex-shrink-0 overflow-hidden">
                      {note.thumbnail_url ? (
                        <img
                          src={note.thumbnail_url}
                          className="w-full h-full object-cover"
                          alt="thumb"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400">
                          <FileText className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className="font-bold text-stone-900 dark:text-white truncate"
                        title={note.title}
                      >
                        {note.title}
                      </h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                        {note.subject}
                      </p>
                      <p className="text-xs text-stone-400 mt-2">
                        By {note.uploader_name || "Anonymous"}
                      </p>

                      <div className="flex items-center gap-3 mt-3 text-xs text-stone-500">
                        <span className="flex items-center gap-1">
                          <Download className="w-3 h-3" /> {note.downloads || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400" />{" "}
                          {note.rating || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-stone-500 bg-white dark:bg-stone-900 rounded-xl border border-dashed border-stone-300">
                  No notes available yet. Be the first to upload!
                </div>
              )}
            </div>
          </div>

          {/* Leaderboard Preview */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-500" />
                Top Students
              </h2>
            </div>
            <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
              {isLoading ? (
                <div className="p-4 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-12 bg-stone-100 dark:bg-stone-800 rounded-lg animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : topStudents.length > 0 ? (
                topStudents.map((student, index) => (
                  <div
                    key={student.id}
                    className="p-4 flex items-center gap-4 border-b border-stone-100 dark:border-stone-800 last:border-0 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition"
                  >
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                        index === 0
                          ? "bg-yellow-100 text-yellow-600"
                          : index === 1
                            ? "bg-stone-100 text-stone-600"
                            : index === 2
                              ? "bg-amber-100 text-amber-700"
                              : "bg-stone-50 text-stone-400"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-stone-900 dark:text-white text-sm">
                        {student.name}
                      </div>
                      <div className="text-xs text-stone-500">
                        {student.points} pts
                      </div>
                    </div>
                    {index === 0 && (
                      <Award className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-stone-500 text-sm">
                  No leaderboard data yet.
                </div>
              )}
              <button
                onClick={() => navigate("/gamify")}
                className="w-full py-3 text-sm text-center text-indigo-600 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition"
              >
                View Full Leaderboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Renaming LandingPage to HomePage to reflect dual nature
export function HomePage({
  isLoggedIn,
  userProfile,
  onNoteClick,
}) {
  const navigate = useNavigate();
  if (isLoggedIn) {
    return (
      <StudentDashboard
        userProfile={userProfile}
        onNoteClick={onNoteClick}
      />
    );
  }

  // Original Landing Page Content for Guests
  const stats = [
    { value: "1,250+", label: "Verified Notes" },
    { value: "5,000+", label: "Active Students" },
    { value: "4.9/5", label: "Average Rating" },
  ];

  const features = [
    {
      icon: Shield,
      title: "AI ID Verification",
      description: "Official student verification for a 1.1x point multiplier.",
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: Crown,
      title: "Departmental Flare",
      description: "Win the 'Flare' for your department and earn bonus points.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Award,
      title: "Gamified Learning",
      description: "Climb global leaderboards and achieve rare badges.",
      color: "from-green-500 to-emerald-500",
    }
  ];

  return (
    <div className="bg-stone-50 dark:bg-stone-950 h-screen w-screen overflow-hidden fixed inset-0 z-0 pt-16">
      {/* Horizontal Scroll Container */}
      <div className="flex h-full w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth no-scrollbar">
        
        {/* SECTION 1: HERO */}
        <section className="min-w-full h-full snap-center relative flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-900/10 pointer-events-none" />
          
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 leading-[1.1] text-stone-900 dark:text-white tracking-tight animate-fade-in-up">
              Collaborate, Learn <br />& <span className="text-indigo-600 dark:text-indigo-500">Explore</span>
            </h1>

            <p className="text-xl text-stone-600 dark:text-stone-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
              A unified platform for verified notes, real-time collaboration, and AI-driven learning guidance.
            </p>

            <button
              onClick={() => navigate("/notes")}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-xl font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition text-lg inline-flex items-center space-x-2 text-white animate-fade-in-up delay-200"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
             <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-stone-400">
                <div className="flex flex-col items-center gap-2">
                    <span className="text-xs uppercase tracking-widest">Swipe</span>
                    <ChevronRight className="w-6 h-6" />
                </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: STATS */}
        <section className="min-w-full h-full snap-center flex items-center justify-center bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm border-x border-stone-200 dark:border-stone-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <h2 className="text-center text-3xl font-bold mb-16 text-stone-900 dark:text-white">Our Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center transform hover:scale-110 transition-transform duration-300">
                  <div className="text-5xl md:text-6xl font-bold font-heading text-indigo-600 dark:text-indigo-500 mb-4">
                    {stat.value}
                  </div>
                  <div className="text-xl text-stone-600 dark:text-stone-300 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: FEATURES */}
        <section className="min-w-full h-full snap-center flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-stone-50 dark:bg-stone-950">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold font-heading text-stone-900 dark:text-white mb-6">
                Why Choose NoteHub?
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <div key={i} className="group p-8 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-indigo-500/50 hover:shadow-xl transition-all duration-300">
                   <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-stone-500 dark:text-stone-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: CTA */}
        <section className="min-w-full h-full snap-center flex flex-col justify-center relative bg-indigo-600 dark:bg-indigo-900 text-white">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
          <div className="relative z-10 text-center px-4">
            <h2 className="text-4xl md:text-6xl font-bold font-heading mb-8">
              Ready to Transform Your Grades?
            </h2>
             <p className="text-indigo-100 mb-12 text-xl max-w-2xl mx-auto">
              Join thousands of students who are already using NoteHub to share knowledge and succeed.
            </p>
            <button
              onClick={() => navigate("/notes")}
              className="px-10 py-5 bg-white text-indigo-600 rounded-xl font-bold text-xl hover:bg-indigo-50 transition shadow-2xl inline-flex items-center gap-2 hover:-translate-y-1 transform duration-300"
            >
              Start Exploring <ArrowRight className="w-6 h-6" />
            </button>
          </div>
          
           {/* Footer inside the last slide */}
          <footer className="absolute bottom-0 left-0 right-0 py-6 text-center bg-black/10 backdrop-blur-sm">
            <p className="text-white/60 text-sm">
              © 2025-2026 NoteHub. Developed by SREIR's Samarth College of Engineering.
            </p>
          </footer>
        </section>

      </div>
    </div>
  );
}

// Support legacy export name if needed, or better yet, we'll update App.tsx to use HomePage
export { HomePage as LandingPage };
