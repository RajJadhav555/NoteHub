import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { BookOpen, Eye, EyeClosed as EyeOff } from "lucide-react/dist/esm/lucide-react";
import { usersAPI } from "../services/api";

export function LoginPage({ onLoginSuccess }) {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Clear fields when toggling mode
  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError("");
    setEmail("");
    setPassword("");
    setName("");
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      const { credential } = credentialResponse;
      const data = await usersAPI.googleLogin(credential);
      onLoginSuccess(data);
    } catch (err) {
      console.error("Login error:", err);
      setError("Google Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (isSignup && !name) {
      setError("Please enter your name");
      return;
    }

    try {
      setIsLoading(true);
      let data;
      
      if (isSignup) {
        data = await usersAPI.createUser({ name, email, password });
      } else {
        data = await usersAPI.login({ email, password });
      }
      
      onLoginSuccess(data);
    } catch (err) {
      console.error("Auth error:", err);
      setError(isSignup ? "Signup failed. Try a different email." : "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 pt-20">
      <div className="bg-slate-800 p-6 rounded-xl border border-white/10 shadow-2xl max-w-sm w-full text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-xl font-bold text-white mb-2">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          {isSignup 
            ? "Join NoteHub to share and explore notes." 
            : "Sign in to access your verified notes."}
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-2 rounded-lg mb-4 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-3 text-left">
          {isSignup && (
            <div>
              <input
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          )}

          <div>
             <input
              type="email"
              name="email"
              autoComplete="username"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none transition"
              >
                {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                ) : (
                    <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {!isSignup && (
            <div className="text-right">
              <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300">Forgot Password?</a>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading 
              ? (isSignup ? "Creating Account..." : "Signing In...") 
              : (isSignup ? "Sign Up" : "Sign In")}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-600"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-slate-800 text-gray-400">Or continue with</span>
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google Login Failed")}
            theme="filled_black"
            shape="pill"
            size="medium"
            text={isSignup ? "signup_with" : "signin_with"}
          />
        </div>

        <div className="text-center mt-4">
          <button 
            type="button"
            onClick={toggleMode}
            className="text-xs text-gray-400 hover:text-white transition"
          >
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <span className="text-indigo-400 font-medium hover:underline">
              {isSignup ? "Sign In" : "Sign Up"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
