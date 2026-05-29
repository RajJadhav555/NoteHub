import React, { useState } from "react";
import { User, Mail, Book, Calendar, Award, Star, Save, Shield, Clock } from "lucide-react/dist/esm/lucide-react";
import { usersAPI } from "../services/api";

export function ProfilePage({ userProfile, onProfileUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile.name || "",
    year: userProfile.year || "",
    semester: userProfile.semester || "",
    department: userProfile.department || "",
    bio: userProfile.bio || "",
    selectedDocs: [] as File[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const updatedUser = await usersAPI.updateUser(userProfile.id, formData);
      onProfileUpdate(updatedUser); // Update App.tsx state
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);
    } catch (error) {
      console.error("Update failed:", error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || "Failed to update profile.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Identity */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-sm border border-stone-200 dark:border-stone-800 text-center">
            <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
              {userProfile.name ? userProfile.name[0] : "U"}
            </div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-1">{userProfile.name}</h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm mb-4">{userProfile.email}</p>
            
            <div className="flex justify-center gap-2 mb-6">
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-full">
                Student
              </span>
              {userProfile.rank && (
                <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-full flex items-center gap-1">
                  <Award className="w-3 h-3" /> Rank #{userProfile.rank}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-stone-100 dark:border-stone-800 pt-6">
              <div>
                <div className="text-2xl font-bold text-stone-900 dark:text-white">
                  {userProfile.points || 0}
                </div>
                <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Points</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-stone-900 dark:text-white">
                  {userProfile.verifiedNotes || 0}
                </div>
                <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Verified Notes</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-sm border border-stone-200 dark:border-stone-800">
            <h3 className="font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield className={`w-5 h-5 ${userProfile.is_verified ? 'text-green-500' : 'text-amber-500'}`} /> 
              Verification Status
            </h3>
            {userProfile.is_verified ? (
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50 text-center">
                < Award className="w-10 h-10 text-green-500 mx-auto mb-2" />
                <div className="text-sm font-bold text-green-700 dark:text-green-400">Department Verified</div>
                <div className="text-[10px] text-green-600 dark:text-green-500 uppercase tracking-tighter mt-1">Official Member of {userProfile.department}</div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30">
                  <div className="text-xs text-amber-700 dark:text-amber-400 font-medium mb-3">
                    Upload your ID Card (Front & Back) and optional Bonafide certificate (JPG or PDF).
                  </div>
                  <label className="block mb-4">
                    <span className="sr-only">Choose Files</span>
                    <input 
                      type="file" 
                      multiple
                      accept="image/*,.pdf"
                      capture="environment"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []) as File[];
                        if (files.length > 0) {
                          setFormData(prev => ({ ...prev, selectedDocs: files }));
                        }
                      }}
                      className="block w-full text-sm text-stone-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-xs file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100"
                    />
                  </label>

                  {formData.selectedDocs && formData.selectedDocs.length > 0 && (
                    <div className="space-y-2 mb-4">
                      <div className="text-[10px] font-bold text-stone-400 uppercase">Selected Documents:</div>
                      {formData.selectedDocs.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-800 p-2 rounded-lg border border-stone-100 dark:border-stone-700">
                          <Book className="w-3 h-3 text-indigo-500" />
                          <span className="truncate max-w-[150px]">{file.name}</span>
                          <span className="ml-auto text-[9px] text-stone-400">{(file.size / 1024).toFixed(0)} KB</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {(!userProfile.department || userProfile.department === 'General') && (
                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/20 text-[10px] text-amber-600 dark:text-amber-400 font-bold mb-4 flex items-center gap-2">
                       <Shield className="w-4 h-4 text-amber-500" /> Please select and SAVE your specific Department (e.g., Computer Engineering) in "Profile Details" before verifying.
                    </div>
                  )}

                  <button
                    onClick={async () => {
                      if (!formData.selectedDocs || formData.selectedDocs.length === 0) return;
                      if (!userProfile.department || userProfile.department === 'General') {
                        setMessage({ type: "error", text: "Please select your specific department first!" });
                        return;
                      }
                      setIsLoading(true);
                      setMessage({ type: "info", text: "AI is analyzing your documents..." });

                      try {
                        const filePromises = formData.selectedDocs.map(file => {
                          return new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onerror = () => reject(new Error("File unreadable or corrupted."));
                            reader.readAsDataURL(file);
                            reader.onload = () => resolve({
                              data: reader.result,
                              mimeType: file.type
                            });
                          });
                        });

                        const encodedFiles = await Promise.all(filePromises);
                        
                        // Enforce frontend hard stop at 10MB to align exactly with backend payload safety
                        const totalBytes = encodedFiles.reduce((acc, f: any) => (acc as number) + (f.data.length || 0), 0) as number;
                        if (totalBytes > 10 * 1024 * 1024) {
                            throw new Error("Smartphones photos are too large. Maximum 10MB total allowed. Please compress them and try again.");
                        }
                        
                        // Small buffer to ensure browser memory is ready
                        await new Promise(r => setTimeout(r, 500));

                        const res = await fetch('/api/users/verify-id', {
                          method: 'POST',
                          headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${sessionStorage.getItem('notehub_token')}`
                          },
                          body: JSON.stringify({ files: encodedFiles })
                        });
                        
                        const result = await res.json();
                        if (result.success) {
                          setMessage({ type: "success", text: `Verification Successful! Welcome, ${result.extractedName}.` });
                          setTimeout(() => window.location.reload(), 2000);
                        } else {
                          // Show the specific error from the backend instead of a generic one
                          setMessage({ type: "error", text: result.error || result.reasoning || "Verification failed. Check your department." });
                        }
                      } catch (err) {
                         console.error(err);
                         setMessage({ type: "error", text: err.name === 'AbortError' ? "AI API Connection Timeout." : (err.message || "Upload failed. Try again.") });
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={isLoading || !formData.selectedDocs?.length}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition disabled:opacity-50"
                  >
                    {isLoading ? "Analyzing..." : "Submit for Verification"}
                  </button>
                </div>
                <div className="text-[10px] text-stone-400 italic text-center">
                   Privacy: Documents are processed instantly and NOT stored.
                </div>
              </div>
            )}
          </div>
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-sm border border-stone-200 dark:border-stone-800">
            <h3 className="font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" /> Achievements
            </h3>
            <div className="space-y-3">
              {/* Achievements */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-stone-900 dark:text-white">Verified Uploader</div>
                  <div className="text-xs text-stone-500">First note approved</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-stone-900 dark:text-white">Early Bird</div>
                  <div className="text-xs text-stone-500">Joined in first month</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-8 shadow-sm border border-stone-200 dark:border-stone-800">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white font-heading">
                Profile Details
              </h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all transform active:scale-95 ${
                  isEditing 
                    ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" 
                    : `bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 dark:shadow-indigo-900/20 ${(!userProfile.department || userProfile.department === 'General') ? 'animate-pulse scale-105' : ''}`
                }`}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {message.text && (
              <div className={`mb-6 p-4 rounded-xl text-sm ${
                message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-stone-400" />
                    <input
                      type="text"
                      name="name"
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-70 disabled:cursor-not-allowed transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-stone-400" />
                    <input
                      type="email"
                      disabled
                      value={userProfile.email}
                      className="w-full pl-10 pr-4 py-3 bg-stone-100 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Course (Department)
                  </label>
                  <div className="relative group">
                    <Book className="absolute left-3 top-3 w-5 h-5 text-stone-400" />
                    <select
                      name="department"
                      disabled={!isEditing}
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-70 disabled:cursor-not-allowed transition appearance-none"
                    >
                      <option value="">Select Course</option>
                      <option value="Computer Engineering">Computer Engineering</option>
                      <option value="AIML Engineering">AIML Engineering</option>
                      <option value="AIDS">AIDS</option>
                      <option value="E&TC Engineering">E&TC Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                    </select>
                    {userProfile.department && isEditing && (
                      <div className="mt-2 text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1 uppercase tracking-tight">
                        <Shield className="w-3 h-3" /> Locked for 30 days after change
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Academic Year
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-stone-400" />
                    <select
                      name="year"
                      disabled={!isEditing}
                      value={formData.year || ""}
                      onChange={(e) => {
                         // Reset semester when year changes to avoid invalid combinations
                         setFormData({ ...formData, year: e.target.value, semester: "" });
                      }}
                      className="w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-70 disabled:cursor-not-allowed transition appearance-none"
                    >
                      <option value="">Select Year</option>
                      <option value="First Year">First Year</option>
                      <option value="Second Year">Second Year</option>
                      <option value="Third Year">Third Year</option>
                      <option value="Final Year">Final Year</option>
                    </select>
                  </div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Semester
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 w-5 h-5 text-stone-400" />
                    <select
                      name="semester"
                      disabled={!isEditing || !formData.year}
                      value={formData.semester}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-70 disabled:cursor-not-allowed transition appearance-none"
                    >
                      <option value="">Select Semester</option>
                      {formData.year === "First Year" && (
                        <>
                          <option value="Semester 1">Semester 1</option>
                          <option value="Semester 2">Semester 2</option>
                        </>
                      )}
                      {formData.year === "Second Year" && (
                        <>
                          <option value="Semester 3">Semester 3</option>
                          <option value="Semester 4">Semester 4</option>
                        </>
                      )}
                      {formData.year === "Third Year" && (
                        <>
                          <option value="Semester 5">Semester 5</option>
                          <option value="Semester 6">Semester 6</option>
                        </>
                      )}
                      {formData.year === "Final Year" && (
                        <>
                          <option value="Semester 7">Semester 7</option>
                          <option value="Semester 8">Semester 8</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
