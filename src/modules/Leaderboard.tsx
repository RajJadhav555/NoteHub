import React, { useState, useRef, useEffect } from "react";
import { Award, TrendingUp, Search, Upload, Crown } from "lucide-react/dist/esm/lucide-react";
import { ScanModal } from "./ScanModal";

export function GamificationPage({ leaderboard, userProfile, onAddNote }) {
  const [showScanModal, setShowScanModal] = useState(false);
  const fileInputRef = useRef(null);
  const [departmentWar, setDepartmentWar] = useState({ winningDepartment: null, scores: [] });

  useEffect(() => {
    fetch('/api/leaderboard/department-war')
      .then(res => res.json())
      .then(data => setDepartmentWar(data))
      .catch(err => console.error("Dept War Fetch Error:", err));
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
        setShowScanModal(true);
    }
  };
  const [searchTerm, setSearchTerm] = useState("");

  const handleScanComplete = (result) => {
    const isAutoApproved = result.score >= 85 && result.plagiarism <= 10;
    
    // Create new note object
    const newNote = {
        id: Date.now(),
        title: "New Gamified Upload", 
        subject: "General", 
        author: userProfile?.name || "Anonymous",
        verified: isAutoApproved,
        downloads: 0,
        rating: 0,
        likes: 0,
        fileType: "PDF",
        year: "First Year",
        semester: "Semester 1",
        course: "Computer Engineering" // Default
    };

    onAddNote(newNote); 

    if (isAutoApproved) {
        alert(`🎉 +5.5 Points! Your note was AUTO-APPROVED (Score: ${result.score}%). You've earned a Departmental Flare Bonus!`);
    } else {
        alert(`👍 +5.5 Points! Note uploaded. AI Score: ${result.score}%. Pending review. (Includes Flare Bonus!)`);
    }
  };

  const nextRankPoints = leaderboard && leaderboard.length > 0 && userProfile.rank > 1 
    ? (leaderboard[userProfile.rank - 2]?.points || 100) 
    : (userProfile.points + 50);
  const rankProgress = Math.min(((userProfile.points / nextRankPoints) * 100), 100);

  return (
    <div className="pt-20 min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-heading text-stone-900 dark:text-white">Gamified Learning</h1>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Compete, earn, and achieve
              </p>
            </div>
          </div>
          
          {departmentWar.winningDepartment && (
            <div className="hidden sm:flex items-center space-x-3 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-full animate-pulse">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-tighter">
                  Current Champion: {departmentWar.winningDepartment}
                </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column: User Profile + Battle for the Flare */}
          <div className="space-y-6">
            {/* User Profile Card */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-sm">
              <div className="text-center mb-6">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 text-white shadow-lg ${userProfile.hasFlare ? 'flare-glow' : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/30'}`}>
                  {(userProfile.name || 'U')[0]}
                </div>
                <h2 className={`text-xl font-bold mb-1 text-stone-900 dark:text-white ${userProfile.hasFlare ? 'flare-glow-text' : ''}`}>
                  {userProfile.name}
                  {userProfile.hasFlare && <Crown className="w-4 h-4 text-yellow-500 inline-block ml-2 mb-1" />}
                </h2>
              <p className="text-stone-500 text-sm">{userProfile.department}</p>
            </div>

            <div className="space-y-4">
              {/* Upload Action */}
              <div className="space-y-3">
                  <button
                    onClick={handleUploadClick}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition transform active:scale-95 font-bold"
                  >
                    <Upload className="w-5 h-5" />
                    Upload Note {userProfile.hasFlare ? '(+5.5 Pts)' : '(+5 Pts)'}
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".pdf,.doc,.docx" 
                    onChange={handleFileChange}
                  />
                  <p className="text-xs text-center text-stone-500">
                    Earn points for every approved note! {userProfile.hasFlare && "🔥 Flare Active!"}
                  </p>
              </div>

              <div className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-4 border border-stone-100 dark:border-stone-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-stone-500 text-sm">Rank Progress</span>
                  <span className="text-2xl font-bold text-stone-900 dark:text-white">
                    #{userProfile.rank}
                  </span>
                </div>
                <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden">
                     <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${rankProgress}%` }}></div>
                </div>
                <p className="text-[10px] text-stone-400 mt-2 text-right uppercase font-bold tracking-widest">
                  {userProfile.points} / {Math.round(nextRankPoints)} PTS
                </p>
              </div>

              <div className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-4 border border-stone-100 dark:border-stone-700">
                <div className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-3">Badges</div>
                <div className="flex flex-wrap gap-2">
                  {(userProfile.badges || []).map((badge, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded text-xs font-medium text-stone-700 dark:text-stone-300"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Battle for the Flare Card */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-sm flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity rotate-12">
                 <Crown size={120} />
              </div>
              <h2 className="text-lg font-bold flex items-center text-stone-900 dark:text-white mb-4 relative z-10">
                <Crown className="w-5 h-5 mr-2 text-yellow-500" />
                Battle for the Flare
              </h2>
              <div className="space-y-4 relative z-10">
                {departmentWar.scores.map((dept, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className={`font-semibold text-stone-700 dark:text-stone-300 ${departmentWar.winningDepartment === dept.department ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                        {dept.department}
                        {departmentWar.winningDepartment === dept.department && " 👑"}
                      </span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">{dept.average_points} pts/usr</span>
                    </div>
                    <div className="w-full bg-stone-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${departmentWar.winningDepartment === dept.department ? 'bg-gradient-to-r from-yellow-400 via-indigo-500 to-purple-600 animate-pulse' : 'bg-stone-300 dark:bg-stone-600'}`} 
                        style={{ width: `${Math.min((dept.average_points / Math.max(departmentWar.scores[0]?.average_points || 1, 1)) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                {departmentWar.scores.length === 0 && (
                  <p className="text-sm text-stone-500 italic">No department data yet.</p>
                )}
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500 text-center uppercase tracking-widest font-bold">
                 Wins +10% Points for Department
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center text-stone-900 dark:text-white">
                <TrendingUp className="w-5 h-5 mr-2 text-indigo-500" />
                Global Leaderboard
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-1.5 bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-48 transition-all focus:w-64"
                />
              </div>
            </div>

            <div className="space-y-0divide-y divide-stone-100 dark:divide-stone-800">
              {(leaderboard || [])
                .filter((u) =>
                  (u?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((user, index) => (
                  <div
                    key={user.id}
                    className={`p-4 rounded-lg flex items-center justify-between transition group ${
                      user.name === userProfile.name
                        ? "bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800"
                        : "hover:bg-stone-50 dark:hover:bg-stone-800/50 border border-transparent"
                    }`}
                  >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-8 h-8 rounded text-sm font-bold flex items-center justify-center ${
                            user.department === departmentWar.winningDepartment && departmentWar.winningDepartment
                              ? "flare-glow text-white"
                              : index < 3 ? "bg-stone-900 text-white dark:bg-white dark:text-stone-900" : "bg-stone-100 text-stone-500"
                          }`}
                        >
                          {user.rank}
                        </div>
                        <div>
                          <div className={`font-semibold text-stone-900 dark:text-white flex items-center gap-2 ${user.department === departmentWar.winningDepartment && departmentWar.winningDepartment ? 'flare-glow-text' : ''}`}>
                            {user.name}
                            {user.department === departmentWar.winningDepartment && departmentWar.winningDepartment && <Crown className="w-4 h-4 text-yellow-500 inline-block" />}
                            {user.name === userProfile.name ? (
                                <span className="text-xs text-indigo-500 font-bold tracking-wide">(You)</span>
                            ) : user.is_online ? (
                                <span className="relative flex h-2.5 w-2.5" title="Online">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                </span>
                            ) : (
                                <span className="relative flex h-2 w-2" title="Offline">
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 opacity-80"></span>
                                </span>
                            )}
                          </div>
                          <div className="text-xs text-stone-500">
                            {user.uploads} uploads
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-indigo-600 dark:text-indigo-400">
                          {user.points}
                        </div>
                        <div className="text-[10px] text-stone-400 uppercase">Points</div>
                      </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      
      {/* Scan Modal for Uploads */}
      {showScanModal && (
        <ScanModal 
            onClose={() => setShowScanModal(false)}
            onComplete={handleScanComplete}
        />
      )}
    </div>
  );
}
