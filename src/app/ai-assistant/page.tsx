"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bot, Send, ShieldCheck, AlertTriangle, Shield, Mic, MicOff, 
    Lock, EyeOff, Globe, CreditCard, CheckCircle2, XCircle, Home,
    Briefcase, Smartphone, Database, Search, ArrowRight, Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";

const SUGGESTIONS = [
    "My Instagram got hacked and email changed",
    "I received a job offer asking for ₹500 processing fee",
    "Is this QR code safe to scan for receiving money?",
    "Why is my calculator app asking for SMS permission?",
    "Was my email leaked in a data breach?"
];

// Module registry
const MODULE_CARDS = [
    { id: 'account_recovery', title: "Account Recovery", desc: "Recover hacked Instagram, Gmail, WhatsApp", icon: Lock, color: "text-blue-400", bg: "bg-blue-400/10", link: "/account-recovery" },
    { id: 'job_scam', title: "Job Scam Detector", desc: "Paste job message → get scam score", icon: Briefcase, color: "text-purple-400", bg: "bg-purple-400/10", link: "/job-scam" },
    { id: 'breach_check', title: "Data Breach Checker", desc: "Check if your email was exposed", icon: Database, color: "text-red-400", bg: "bg-red-400/10", link: "/breach-check" },
    { id: 'permission_analysis', title: "App Permission Analyzer", desc: "Find out which apps are spying", icon: Smartphone, color: "text-emerald-400", bg: "bg-emerald-400/10", link: "/permission-analysis" },
    { id: 'payment_fraud', title: "UPI Fraud Analyzer", desc: "Detect QR scams and UPI tricks", icon: CreditCard, color: "text-orange-400", bg: "bg-orange-400/10", link: "/payment-fraud" }
];

// --------------------------------------------------------------------------------
// UTILITY COMPONENTS
// --------------------------------------------------------------------------------

const RiskRadial = ({ level, score }: { level: string, score?: number }) => {
    const upper = (level || "MEDIUM").toUpperCase();
    
    // Determine color and percentage
    let strokeColor = "#3BA4FF"; // Default/Low
    let pct = 25;
    let label = "LOW";

    if (upper === "HIGH" || upper === "DANGEROUS" || score && score >= 70) {
        strokeColor = "#FF4C4C";
        pct = score || 85;
        label = "HIGH";
    } else if (upper === "MEDIUM" || upper === "SUSPICIOUS" || score && score >= 40) {
        strokeColor = "#F59E0B";
        pct = score || 50;
        label = "MEDIUM";
    } else {
        strokeColor = "#00FF9C";
        pct = score || 15;
    }

    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (pct / 100) * circumference;

    return (
        <div className="flex items-center gap-6 p-4 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-xl">
            <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="30" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="transparent" />
                    <circle 
                        cx="40" cy="40" r="30" 
                        stroke={strokeColor} 
                        strokeWidth="6" 
                        fill="transparent" 
                        strokeDasharray={circumference} 
                        strokeDashoffset={offset} 
                        strokeLinecap="round"
                        style={{ transition: "stroke-dashoffset 1s ease-out" }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-white">{pct}%</span>
                </div>
            </div>
            <div>
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Risk Assesment</p>
                <h3 className="text-2xl font-black tracking-tight text-white mb-0" style={{ color: strokeColor }}>{label} RISK</h3>
            </div>
        </div>
    );
};

const SectionData = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => {
    let colorClass = "text-cyan-400";
    let borderClass = "border-cyan-500/20";
    
    if (title.toLowerCase().includes("not")) {
        colorClass = "text-red-400";
        borderClass = "border-red-500/20";
    } else if (title.toLowerCase().includes("action")) {
        colorClass = "text-emerald-400";
        borderClass = "border-emerald-500/20";
    }

    return (
        <div className="glass-module p-6 rounded-2xl flex flex-col h-full">
            <h3 className={`flex items-center gap-3 text-sm font-black uppercase tracking-widest mb-4 ${colorClass}`}>
                <Icon size={18} />
                {title}
            </h3>
            <div className="text-slate-300 font-medium leading-relaxed flex-1 space-y-3 break-words">
                {children}
            </div>
        </div>
    );
};


export default function AIAssistantPage() {
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);

    // AI State
    const [isLoading, setIsLoading] = useState(false);
    const [activeModule, setActiveModule] = useState<string | null>(null);
    const [moduleData, setModuleData] = useState<any>(null);

    // Dynamic Placeholders
    useEffect(() => {
        const id = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % SUGGESTIONS.length);
        }, 3000);
        return () => clearInterval(id);
    }, []);

    const recognitionRef = useRef<any>(null);
    const toggleVoice = useCallback(() => {
        if (typeof window === "undefined") return;
        const w = window as any;
        const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
        if (!SR) return alert("Voice input not supported.");

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        const recognition = new SR();
        recognition.lang = "en-IN";
        recognition.interimResults = false;
        recognition.onresult = (e: any) => setInput(prev => prev + " " + e.results[0][0].transcript);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);

        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
    }, [isListening]);

    const handleSend = async (override?: string) => {
        const query = (override || input).trim();
        if (!query || isLoading) return;
        
        setIsLoading(true);
        setActiveModule(null);
        setModuleData(null);

        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            // 1. Intent Detection
            const analyzeRes = await axios.post('http://localhost:5000/api/ai/analyze', { message: query }, { headers });
            const detectedModule = analyzeRes.data.module; // e.g. 'job_scam'

            // 2. Route to Specific Module
            const endpointMap: Record<string, string> = {
                'account_recovery': '/account-recovery',
                'job_scam': '/job-scam',
                'breach_check': '/breach-check',
                'permission_analysis': '/permission-analysis',
                'payment_fraud': '/payment-fraud'
            };

            const endpoint = endpointMap[detectedModule] || '/account-recovery';
            
            // For breach check, auto-extract email if found
            let payload: any = { message: query };
            if (detectedModule === 'breach_check') {
                const emailMatch = query.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
                if (emailMatch) payload.email = emailMatch[0];
            }

            const moduleRes = await axios.post(`http://localhost:5000/api/ai${endpoint}`, payload, { headers });
            
            setModuleData(moduleRes.data);
            setActiveModule(detectedModule);
        } catch (error) {
            console.error("AI Error:", error);
            alert("Failed to connect to the AI Engine. Please try again.");
        } finally {
            setIsLoading(false);
            setInput("");
        }
    };

    const resetUI = () => {
        setActiveModule(null);
        setModuleData(null);
    };

    // UI RENDERERS
    const renderHero = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[85vh] max-w-5xl mx-auto w-full px-4 relative z-10">
            {/* Header */}
            <div className="text-center mb-16 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 text-cyan-400 text-xs font-black uppercase tracking-widest mb-2 shadow-sm">
                    <Shield size={14} className="text-cyan-400" /> Platform Intelligence
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mx-auto max-w-5xl">
                    Describe your cyber problem.<br className="hidden sm:block" />
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Get instant help.</span>
                </h1>
                <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto">
                    AI-powered cybersecurity assistant for India. Fast. Simple. Reliable.
                </p>
            </div>

            {/* Input Bar */}
            <div className="w-full max-w-3xl relative mb-16">
                <div className="input-glass p-[6px] pl-4 flex items-center group">
                    <button 
                        onClick={toggleVoice}
                        className={cn("p-3 rounded-full transition-colors shrink-0", isListening ? "text-red-400 bg-red-400/10" : "text-slate-400 hover:text-white")}
                    >
                        {isListening ? <MicOff size={22} className="animate-pulse" /> : <Mic size={22} />}
                    </button>
                    
                    <div className="flex-1 px-4 relative flex items-center">
                        <input 
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            disabled={isLoading}
                            className="w-full bg-transparent border-none text-white text-lg focus:outline-none focus:ring-0 placeholder:text-transparent relative z-10 font-medium tracking-wide"
                        />
                        {!input && (
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <span className="text-slate-500 text-lg font-medium">
                                    {SUGGESTIONS[placeholderIndex]}
                                </span>
                                <motion.span 
                                    animate={{ opacity: [1, 0, 1] }} 
                                    transition={{ duration: 1, repeat: Infinity }} 
                                    className="ml-[1px] w-[2px] h-5 bg-cyan-400 inline-block"
                                />
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={() => handleSend()}
                        disabled={isLoading || !input.trim()}
                        className="btn-primary px-8 py-3.5 rounded-full flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Analyze & Solve <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            {/* Modules Grid */}
            <div className="w-full text-left space-y-4 max-w-5xl">
                <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest pl-2 flex items-center gap-2"><Activity size={12}/> Analysis Modules</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MODULE_CARDS.map(mod => (
                        <button 
                            key={mod.id}
                            onClick={() => mod.link ? window.location.href = mod.link : handleSend(mod.title)}
                            className="glass-module p-8 min-h-[160px] rounded-3xl flex flex-col items-start justify-center relative group w-full text-left"
                        >
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors z-10 bg-black/50 border border-white/5 shadow-inner", mod.color)}>
                                <mod.icon size={24} />
                            </div>
                            <h4 className="text-white font-bold text-lg mb-2 z-10">{mod.title}</h4>
                            <p className="text-slate-400 text-sm leading-relaxed z-10">{mod.desc}</p>
                            
                            {/* Subtle bottom edge glow on hover */}
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
                        </button>
                    ))}
                </div>
            </div>
        </motion.div>
    );

    const renderLoading = () => {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full animate-[spin_3s_linear_infinite]" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="48" stroke="rgba(0,229,255,0.1)" strokeWidth="1" fill="none" strokeDasharray="4 4" />
                        <circle cx="50" cy="50" r="40" stroke="rgba(0,102,255,0.2)" strokeWidth="2" fill="none" strokeDasharray="60 30" />
                        <circle cx="50" cy="50" r="32" stroke="rgba(0,229,255,0.5)" strokeWidth="2" fill="none" strokeDasharray="30 40" className="animate-[spin_2s_linear_infinite_reverse]" style={{ transformOrigin: '50% 50%' }} />
                    </svg>
                    <Shield className="w-8 h-8 text-cyan-400 animate-pulse glow-blue" />
                </div>
                <div className="text-center">
                    <h3 className="text-sm font-black text-cyan-400 uppercase tracking-widest animate-pulse">
                        Analyzing Intelligence Stream...
                    </h3>
                    <p className="text-slate-500 text-xs mt-2 font-medium">Please wait while the engine processes data</p>
                </div>
            </div>
        );
    };

    // --------------------------------------------------------------------------------
    // MODULE SPECIFIC RENDERERS & STANDARDIZED UI
    // --------------------------------------------------------------------------------
    const renderModuleResult = () => {
        if (!moduleData) return null;
        
        const rd = moduleData; // Result Data
        const titleMap: Record<string, string> = {
            'account_recovery': 'Account Recovery Analysis',
            'job_scam': 'Job Scam Analysis',
            'breach_check': 'Data Breach Report',
            'permission_analysis': 'Permission Risk Report',
            'payment_fraud': 'Payment Fraud Detection'
        };

        const activeTitle = activeModule ? titleMap[activeModule] : "Analysis Complete";
        
        // Extract Standardized Sections based on module response structure
        // Explanation
        let explanationText: React.ReactNode = rd.explanation;
        if (activeModule === 'breach_check') {
            explanationText = rd.breaches?.length > 0 ? 
                `Found ${rd.breaches.length} exposed incidents involving your data.` : 
                "No immediate breaches detected. Stay vigilant!";
            
            if (rd.breaches?.length > 0) {
                explanationText = (
                    <div className="space-y-3">
                        <p>Found <b>{rd.breaches.length}</b> exposed incidents involving your data.</p>
                        {rd.breaches.map((b: any, i: number) => (
                            <div key={i} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm pt-2">
                                <span className="font-bold text-red-400 block mb-1">{b.name} ({b.year})</span>
                                <div className="text-xs text-red-300">Exposed: {(b.data_exposed || []).join(", ")}</div>
                            </div>
                        ))}
                    </div>
                );
            }
        } else if (activeModule === 'permission_analysis') {
            explanationText = (
                <div className="space-y-3">
                    <p>App permission breakdown request processed.</p>
                    {(rd.permissions || []).map((p: any, i: number) => (
                        <div key={i} className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg text-sm">
                            <span className="font-bold text-blue-400 block">{p.name || "Unknown"}</span>
                            <div className="text-xs text-slate-400 mt-1">{p.reason}</div>
                        </div>
                    ))}
                </div>
            );
        } else if (rd.flags) {
            explanationText = (
                <div className="space-y-3">
                    <p>{rd.explanation}</p>
                    {(rd.flags || []).map((f: string, i: number) => (
                        <div key={i} className="px-3 py-2 bg-red-500/5 border border-red-500/10 rounded text-xs text-red-300">
                            • {f}
                        </div>
                    ))}
                </div>
            );
        }

        // Action Plan
        const actionItems: string[] = rd.what_to_do || rd.steps || rd.actions || [];
        const nextActions: string[] = rd.next_actions || [];

        // What NOT to do
        const notToDoItems: string[] = rd.what_not_to_do || [];

        return (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto w-full pb-20 relative z-10 pt-8 px-4">
                <button onClick={resetUI} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                    <ArrowRight className="rotate-180" size={14} /> New Analysis
                </button>

                {/* Header Profile */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tight">{activeTitle}</h2>
                        <p className="text-slate-400 mt-1 text-sm flex items-center gap-2">
                            <ShieldCheck size={14} className="text-emerald-400" /> Secure AI Analysis Complete
                        </p>
                    </div>
                    {/* Radial Risk Indicator */}
                    <RiskRadial level={rd.risk_level || (rd.scam_score > 50 ? "HIGH" : "MEDIUM")} score={rd.scam_score} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column - Explanation */}
                    <div className="md:col-span-1 space-y-6 flex flex-col">
                        <SectionData title="Explanation & Context" icon={Activity}>
                            {explanationText || "Analysis context is not available for this query."}
                        </SectionData>
                    </div>

                    {/* Right column - Actions */}
                    <div className="md:col-span-2 space-y-6 flex flex-col">
                        
                        {(notToDoItems.length > 0 || rd.fraud_detected) && (
                            <SectionData title="What NOT To Do" icon={XCircle}>
                                {rd.fraud_detected && (
                                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-widest rounded-md">
                                        <AlertTriangle size={14}/> Fraud strongly suspected
                                    </div>
                                )}
                                <ul className="space-y-3">
                                    {notToDoItems.map((w: string, i: number) => (
                                        <li key={i} className="flex gap-3 text-red-200 text-sm">
                                            <XCircle className="text-red-400 shrink-0 mt-0.5" size={16}/> 
                                            <span className="leading-relaxed">{w}</span>
                                        </li>
                                    ))}
                                </ul>
                            </SectionData>
                        )}

                        {actionItems.length > 0 && (
                            <SectionData title="Action Plan" icon={ShieldCheck}>
                                <ul className="space-y-3">
                                    {actionItems.map((w: string, i: number) => (
                                        <li key={i} className="flex gap-3 text-slate-200 text-sm">
                                            <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={16}/> 
                                            <span className="leading-relaxed">{w}</span>
                                        </li>
                                    ))}
                                    {nextActions.map((w: string, i: number) => (
                                        <li key={`next_${i}`} className="flex gap-3 text-slate-300 text-sm">
                                            <ArrowRight className="text-blue-400 shrink-0 mt-0.5" size={16}/> 
                                            <span className="leading-relaxed">{w}</span>
                                        </li>
                                    ))}
                                </ul>
                                
                                {/* Links block */}
                                {(rd.official_links?.length > 0 || rd.report_links?.length > 0) && (
                                    <div className="mt-6 pt-4 border-t border-white/5">
                                        <h4 className="text-xs uppercase font-black text-slate-500 mb-3">Official Resources</h4>
                                        <div className="flex flex-col gap-2">
                                            {(rd.official_links || rd.report_links).map((link: string, i: number) => (
                                                <a key={i} href={link} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-cyan-400 transition-colors text-sm underline md:no-underline hover:underline truncate inline-flex items-center gap-1">
                                                    <Globe size={12}/> {link}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </SectionData>
                        )}

                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-transparent font-sans relative overflow-x-hidden selection:bg-cyan-500/30">
            {/* Navigation Overlay */}
            <nav className="w-full p-6 flex justify-between items-center relative z-20 max-w-7xl mx-auto">
                <div className="flex items-center">
                    <img 
                        src="/cyberspacelogo.jpeg" 
                        alt="Cyberspace Logo" 
                        className="h-12 w-auto object-contain" 
                    />
                </div>
                <button onClick={() => window.location.href = '/dashboard'} className="btn-secondary px-5 py-2.5 rounded-full font-bold text-xs tracking-widest uppercase">
                    Back to Dashboard
                </button>
            </nav>

            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10 pt-10">
                        {renderLoading()}
                    </motion.div>
                ) : activeModule ? (
                    <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10 w-full">
                        {renderModuleResult()}
                    </motion.div>
                ) : (
                    <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10">
                        {renderHero()}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
