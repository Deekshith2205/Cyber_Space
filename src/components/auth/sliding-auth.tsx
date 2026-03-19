"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Mail, User, ChevronRight, AlertCircle, Loader2, Github, Globe } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SlidingAuth() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "register";
  const [isSignUp, setIsSignUp] = useState(initialMode);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register State
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(regName, regEmail, regPassword);
      setIsSignUp(false); // Switch to login after success
      setError(null);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-4xl h-[600px] glass-premium rounded-[30px] overflow-hidden shadow-2xl flex items-center justify-center">
      
      {/* Forms Container */}
      <div className="absolute inset-0 flex w-full h-full">
        
        {/* Sign In Form */}
        <div className={cn(
          "w-1/2 h-full flex flex-col items-center justify-center p-12 transition-all duration-700 ease-in-out z-10",
          isSignUp ? "translate-x-full opacity-0 pointer-events-none" : "translate-x-0 opacity-100"
        )}>
          <form onSubmit={handleLogin} className="w-full space-y-6 text-center">
            <h2 className="text-3xl font-black text-white mb-6 tracking-tight text-glow-primary">Sign In</h2>
            
            <div className="flex justify-center gap-3 mb-6">
              <SocialIcon icon={Github} />
              <SocialIcon icon={Globe} />
            </div>
            
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-4 block">or use your secure email</span>
            
            <div className="space-y-4">
              <AuthInput 
                icon={Mail} 
                type="email" 
                placeholder="Agent Email" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <AuthInput 
                icon={Lock} 
                type="password" 
                placeholder="Access Key" 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            
            <button className="text-xs text-zinc-500 hover:text-cyber-blue transition-colors">Forgot your clearance?</button>
            
            <button 
              disabled={loading}
              className="w-48 mx-auto mt-6 bg-cyber-blue text-black font-black py-3 rounded-full hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2 group"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  SIGN IN
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
            {error && !isSignUp && (
              <p className="text-xs text-red-400 mt-4 animate-shake">{error}</p>
            )}
          </form>
        </div>

        {/* Sign Up Form */}
        <div className={cn(
          "w-1/2 h-full flex flex-col items-center justify-center p-12 transition-all duration-700 ease-in-out z-10",
          !isSignUp ? "-translate-x-full opacity-0 pointer-events-none" : "translate-x-0 opacity-100"
        )}>
          <form onSubmit={handleRegister} className="w-full space-y-6 text-center">
            <h2 className="text-3xl font-black text-white mb-6 tracking-tight text-glow-primary">Create Account</h2>
            
            <div className="flex justify-center gap-3 mb-6">
              <SocialIcon icon={Github} />
              <SocialIcon icon={Globe} />
            </div>
            
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-4 block">or use email for registration</span>
            
            <div className="space-y-4">
              <AuthInput 
                icon={User} 
                type="text" 
                placeholder="Agent Name" 
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
              <AuthInput 
                icon={Mail} 
                type="email" 
                placeholder="Email Address" 
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
              <AuthInput 
                icon={Lock} 
                type="password" 
                placeholder="Security Key" 
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
            </div>
            
            <button 
              disabled={loading}
              className="w-48 mx-auto mt-6 bg-cyber-blue text-black font-black py-3 rounded-full hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2 group"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  SIGN UP
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
            {error && isSignUp && (
              <p className="text-xs text-red-400 mt-4 animate-shake">{error}</p>
            )}
          </form>
        </div>

      </div>

      {/* Overlay Container */}
      <div className={cn(
        "absolute top-0 w-1/2 h-full overflow-hidden transition-all duration-700 ease-in-out z-50",
        isSignUp ? "-translate-x-full left-1/2" : "translate-x-0 left-1/2"
      )}>
        
        {/* Overlay Content */}
        <div className={cn(
          "relative -left-full h-full w-[200%] bg-gradient-to-br from-cyber-blue to-neon-purple transition-all duration-700 ease-in-out",
          isSignUp ? "translate-x-1/2" : "translate-x-0"
        )}>
          
          <div className="absolute inset-0 flex w-full h-full">
            {/* Left Overlay (Sign In Prompt) */}
            <div className={cn(
              "w-1/2 h-full flex flex-col items-center justify-center text-center p-12 transition-all duration-700",
              isSignUp ? "translate-x-0" : "-translate-x-[20%]"
            )}>
              <h1 className="text-4xl font-black text-black mb-4 tracking-tight">Welcome Back!</h1>
              <p className="text-black/70 text-sm font-medium leading-relaxed mb-8">
                To keep connected with us please login with your personal info
              </p>
              <button 
                onClick={() => setIsSignUp(false)}
                className="w-48 border-2 border-black text-black font-black py-3 rounded-full hover:bg-black hover:text-white transition-all active:scale-95"
              >
                SIGN IN
              </button>
            </div>

            {/* Right Overlay (Sign Up Prompt) */}
            <div className={cn(
              "w-1/2 h-full flex flex-col items-center justify-center text-center p-12 transition-all duration-700",
              isSignUp ? "translate-x-[20%]" : "translate-x-0"
            )}>
              <h1 className="text-4xl font-black text-black mb-4 tracking-tight">Hello, Agent!</h1>
              <p className="text-black/70 text-sm font-medium leading-relaxed mb-8">
                Enter your personal details and start your journey with us
              </p>
              <button 
                onClick={() => setIsSignUp(true)}
                className="w-48 border-2 border-black text-black font-black py-3 rounded-full hover:bg-black hover:text-white transition-all active:scale-95"
              >
                SIGN UP
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

function SocialIcon({ icon: Icon }: { icon: any }) {
  return (
    <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-cyber-blue hover:border-cyber-blue/50 transition-all hover:shadow-[0_0_15px_rgba(0,229,255,0.2)]">
      <Icon size={18} />
    </button>
  );
}

function AuthInput({ icon: Icon, ...props }: any) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-cyber-blue transition-colors">
        <Icon size={18} />
      </div>
      <input 
        {...props}
        className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-white text-sm focus:outline-none focus:bg-white/10 focus:border-cyber-blue/30 transition-all shadow-inset-deep"
      />
    </div>
  );
}
