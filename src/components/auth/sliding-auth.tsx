"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Mail, User, ChevronRight, AlertCircle, Loader2, Github, Globe, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
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
  const [showWeakWarning, setShowWeakWarning] = useState(false);
  const [verificationLink, setVerificationLink] = useState<string | null>(null);
  
  const { login, register } = useAuth();
  const router = useRouter();

  // Email Validation Logic
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(regEmail);
  const isLoginEmailValid = emailRegex.test(loginEmail);

  // Password Strength Logic
  const getStrength = (pw: string) => {
    let score = 0;
    if (!pw) return 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[!@#$%^&*]/.test(pw)) score++;
    return score;
  };

  const strength = getStrength(regPassword);
  const isPasswordValid = strength === 5 && regPassword.length <= 12;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoginEmailValid) {
        setError("Please enter a valid email address");
        return;
    }
    setError(null);
    setLoading(true);
    try {
      const { isWeakPassword } = await login(loginEmail, loginPassword);
      if (isWeakPassword) {
        console.warn("User has a weak password. Prompt for upgrade.");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid) {
      setError("Valid email required for Agent activation");
      return;
    }
    if (!isPasswordValid) return;
    
    setError(null);
    setLoading(true);
    try {
      // We need to capture the response to show the verification link (for demo)
      const response: any = await register(regName, regEmail, regPassword);
      if (response?.verificationLink) {
          setVerificationLink(response.verificationLink);
      }
      setIsSignUp(false);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const requirements = [
    { label: "8-12 Characters", met: regPassword.length >= 8 && regPassword.length <= 12 },
    { label: "Uppercase Letter", met: /[A-Z]/.test(regPassword) },
    { label: "Lowercase Letter", met: /[a-z]/.test(regPassword) },
    { label: "Number (0-9)", met: /\d/.test(regPassword) },
    { label: "Special (!@#$%^&*)", met: /[!@#$%^&*]/.test(regPassword) },
  ];

  return (
    <div className="relative w-full max-w-4xl h-[650px] glass-premium rounded-[30px] overflow-hidden shadow-2xl flex items-center justify-center">
      
      {/* Forms Container */}
      <div className="absolute inset-0 flex w-full h-full">
        
        {/* Sign In Form */}
        <div className={cn(
          "w-1/2 h-full flex flex-col items-center justify-center p-12 transition-all duration-700 ease-in-out z-10",
          isSignUp ? "translate-x-full opacity-0 pointer-events-none" : "translate-x-0 opacity-100"
        )}>
          <form onSubmit={handleLogin} className="w-full space-y-6 text-center">
            <h2 className="text-3xl font-black text-foreground mb-6 tracking-tight text-glow-primary">Sign In</h2>
            
            {verificationLink && !isSignUp && (
                <div className="bg-success-green/10 border border-success-green/20 rounded-xl p-3 text-[10px] text-success-green font-bold animate-pulse">
                    AGENT COMMAND: Check your email for activation.
                    <a href={verificationLink} target="_blank" className="block mt-1 underline hover:text-white transition-colors">SIMULATE VERIFICATION</a>
                </div>
            )}

            <div className="flex justify-center gap-3 mb-6">
              <SocialIcon icon={Github} />
              <SocialIcon icon={Globe} />
            </div>
            
            <span className="text-[10px] text-text-secondary uppercase tracking-widest font-bold mb-4 block">or use your secure email</span>
            
            <div className="space-y-4">
              <AuthInput 
                icon={Mail} 
                type="email" 
                placeholder="Agent Email" 
                value={loginEmail}
                onChange={(e: any) => setLoginEmail(e.target.value)}
                valid={loginEmail ? isLoginEmailValid : null}
              />
              <AuthInput 
                icon={Lock} 
                type="password" 
                placeholder="Access Key" 
                value={loginPassword}
                onChange={(e: any) => setLoginPassword(e.target.value)}
              />
            </div>
            
            <button type="button" className="text-xs text-text-secondary hover:text-cyber-blue transition-colors font-medium">Forgot your clearance?</button>
            
            <button 
              disabled={loading}
              className="w-48 mx-auto mt-6 bg-gradient-to-br from-[#3BA4FF] to-[#0066FF] text-white font-black py-3 rounded-full hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2 group shadow-lg"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  SIGN IN
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
            {error && !isSignUp && (
              <p className="text-xs text-red-500 mt-4 animate-shake font-bold">{error}</p>
            )}
          </form>
        </div>

        {/* Sign Up Form */}
        <div className={cn(
          "w-1/2 h-full flex flex-col items-center justify-center p-12 transition-all duration-700 ease-in-out z-10",
          !isSignUp ? "-translate-x-full opacity-0 pointer-events-none" : "translate-x-0 opacity-100"
        )}>
          <form onSubmit={handleRegister} className="w-full space-y-4 text-center">
            <h2 className="text-3xl font-black text-foreground mb-4 tracking-tight text-glow-primary">Create Account</h2>
            
            <div className="space-y-3">
              <AuthInput 
                icon={User} 
                type="text" 
                placeholder="Agent Name" 
                value={regName}
                onChange={(e: any) => setRegName(e.target.value)}
              />
              <AuthInput 
                icon={Mail} 
                type="email" 
                placeholder="Email Address" 
                value={regEmail}
                onChange={(e: any) => setRegEmail(e.target.value)}
                valid={regEmail ? isEmailValid : null}
              />
              <div className="space-y-2">
                <AuthInput 
                  icon={Lock} 
                  type="password" 
                  placeholder="Security Key" 
                  value={regPassword}
                  onChange={(e: any) => setRegPassword(e.target.value)}
                />
                
                {/* Strength Meter */}
                {regPassword && (
                    <div className="px-1 space-y-2">
                        <div className="flex gap-1 h-1">
                            {[1, 2, 3, 4, 5].map((step) => (
                                <div 
                                    key={step}
                                    className={cn(
                                        "flex-1 rounded-full transition-all duration-500",
                                        strength >= step 
                                            ? strength <= 2 ? "bg-red-500" : strength <= 4 ? "bg-yellow-500" : "bg-success-green"
                                            : "bg-white/10"
                                    )}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
                            <span className={cn(
                                strength <= 2 ? "text-red-500" : strength <= 4 ? "text-yellow-500" : "text-success-green"
                            )}>
                                {strength <= 2 ? "Weak Access" : strength <= 4 ? "Medium Security" : "High Clearance"}
                            </span>
                            <span className="text-text-muted">8-12 CHARS REQ.</span>
                        </div>

                        {/* Requirements List */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-left">
                            {requirements.map((req, i) => (
                                <div key={i} className="flex items-center gap-1.5 transform transition-all duration-300">
                                    {req.met ? (
                                        <CheckCircle2 size={10} className="text-success-green" />
                                    ) : (
                                        <div className="w-2.5 h-2.5 rounded-full border border-white/20" />
                                    )}
                                    <span className={cn(
                                        "text-[9px] font-bold transition-colors",
                                        req.met ? "text-success-green" : "text-text-muted"
                                    )}>{req.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
              </div>
            </div>
            
            <button 
              disabled={loading || !isPasswordValid || !isEmailValid}
              className={cn(
                "w-48 mx-auto mt-4 text-white font-black py-3 rounded-full transition-all active:scale-95 flex items-center justify-center gap-2 group shadow-lg",
                (isPasswordValid && isEmailValid)
                    ? "bg-gradient-to-br from-[#3BA4FF] to-[#0066FF] hover:shadow-[0_0_20px_rgba(0,229,255,0.4)]" 
                    : "bg-white/5 text-text-muted cursor-not-allowed border border-white/10"
              )}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  SIGN UP
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
            {error && isSignUp && (
              <p className="text-xs text-red-500 mt-4 animate-shake font-bold">{error}</p>
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
          
          <div className="absolute inset-0 flex w-full h-full text-black">
            {/* Left Overlay (Sign In Prompt) */}
            <div className={cn(
              "w-1/2 h-full flex flex-col items-center justify-center text-center p-12 transition-all duration-700",
              isSignUp ? "translate-x-0" : "-translate-x-[20%]"
            )}>
              <h1 className="text-4xl font-black mb-4 tracking-tight">Welcome Back!</h1>
              <p className="text-black/70 text-sm font-medium leading-relaxed mb-8">
                To keep connected with us please login with your personal info
              </p>
              <button 
                onClick={() => setIsSignUp(false)}
                className="w-48 border-2 border-black font-black py-3 rounded-full hover:bg-black hover:text-white transition-all active:scale-95"
              >
                SIGN IN
              </button>
            </div>

            {/* Right Overlay (Sign Up Prompt) */}
            <div className={cn(
              "w-1/2 h-full flex flex-col items-center justify-center text-center p-12 transition-all duration-700",
              isSignUp ? "translate-x-[20%]" : "translate-x-0"
            )}>
              <h1 className="text-4xl font-black mb-4 tracking-tight">Hello, Agent!</h1>
              <p className="text-black/70 text-sm font-medium leading-relaxed mb-8">
                Enter your personal details and start your journey with us
              </p>
              <button 
                onClick={() => setIsSignUp(true)}
                className="w-48 border-2 border-black font-black py-3 rounded-full hover:bg-black hover:text-white transition-all active:scale-95"
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
    <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-secondary hover:text-cyber-blue hover:border-cyber-blue/50 transition-all hover:shadow-sm">
      <Icon size={18} />
    </button>
  );
}

function AuthInput({ icon: Icon, type, valid, ...props }: any) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="relative group">
      <div className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 transition-colors",
          valid === true ? "text-success-green" : valid === false ? "text-red-500" : "text-text-muted group-focus-within:text-cyber-blue"
      )}>
        <Icon size={18} />
      </div>
      <input 
        {...props}
        type={isPassword ? (show ? "text" : "password") : type}
        className={cn(
            "w-full bg-panel-secondary/50 border rounded-2xl py-3 pl-12 pr-12 text-foreground text-sm focus:outline-none focus:bg-panel transition-all shadow-sm",
            valid === true ? "border-success-green/50 bg-success-green/5" : valid === false ? "border-red-500/50 bg-red-500/5" : "border-border focus:border-cyber-blue/40"
        )}
      />
      {isPassword && (
          <button 
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-cyber-blue transition-colors"
          >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
      )}
      {valid === true && !isPassword && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-success-green">
              <CheckCircle2 size={16} />
          </div>
      )}
      {valid === false && !isPassword && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500">
              <XCircle size={16} />
          </div>
      )}
    </div>
  );
}
