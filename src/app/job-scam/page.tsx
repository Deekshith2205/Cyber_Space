"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Activity, ShieldAlert, Crosshair, Search, ShieldCheck, 
    TerminalSquare, AlertTriangle, ArrowRight, XSquare, CheckCircle2,
    Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

// Forensic highlight animation logic
const MOCK_SCAM_PHRASES = [
    "processing fee", "security deposit", "whatsapp", "kindly",
    "urgent", "100% remote", "no experience required", "crypto",
    "refundable", "onboarding cost"
];

// Reusable Circular Score
const ScoreCircle = ({ score, isScanning }: { score: number, isScanning: boolean }) => {
    const [displayScore, setDisplayScore] = useState(0);

    useEffect(() => {
        if (isScanning) {
            const interval = setInterval(() => {
                setDisplayScore(Math.floor(Math.random() * 99));
            }, 50);
            return () => clearInterval(interval);
        } else {
            // Animate gently to final score
            let current = 0;
            const step = Math.ceil(score / 30);
            const interval = setInterval(() => {
                current += step;
                if (current >= score) {
                    setDisplayScore(score);
                    clearInterval(interval);
                } else {
                    setDisplayScore(current);
                }
            }, 30);
            return () => clearInterval(interval);
        }
    }, [isScanning, score]);

    let color = "#10B981"; // Safe
    let label = "SAFE";
    if (displayScore >= 75) {
        color = "#EF4444"; // High Risk
        label = "HIGH RISK";
    } else if (displayScore >= 40) {
        color = "#F59E0B"; // Suspicious
        label = "SUSPICIOUS";
    }

    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (displayScore / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-36 h-36 flex items-center justify-center mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                    {!isScanning && (
                        <circle 
                            cx="60" cy="60" r="50" 
                            stroke={color} 
                            strokeWidth="8" 
                            fill="transparent" 
                            strokeDasharray={circumference} 
                            strokeDashoffset={offset} 
                            strokeLinecap="round"
                            style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
                        />
                    )}
                    {isScanning && (
                        <circle 
                            cx="60" cy="60" r="50" 
                            stroke="#3BA4FF" 
                            strokeWidth="8" 
                            fill="transparent" 
                            strokeDasharray={circumference} 
                            strokeDashoffset={circumference * 0.2} 
                            strokeLinecap="round"
                            className="animate-[spin_1s_linear_infinite]"
                            style={{ transformOrigin: '50% 50%' }}
                        />
                    )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-white mix-blend-screen" style={{ color: isScanning ? '#3BA4FF' : color }}>
                        {displayScore}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mt-1">Score</span>
                </div>
            </div>
            
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-1.5 rounded-md border border-white/10"
                style={{ backgroundColor: `${color}15`, borderColor: `${color}40`, color }}
            >
                <span className="font-black tracking-widest text-xs uppercase">{isScanning ? "SCANNING PIPELINE..." : label}</span>
            </motion.div>
        </div>
    );
};

export default function JobScamPage() {
    const [jobText, setJobText] = useState("");
    const [company, setCompany] = useState("");
    const [sender, setSender] = useState("");
    
    const [status, setStatus] = useState<"idle" | "scanning" | "result">("idle");
    const [finalScore, setFinalScore] = useState(0);

    const handleAnalyze = () => {
        if (!jobText.trim()) return;
        setStatus("scanning");
        
        // Mock heavy processing time
        setTimeout(() => {
            // Very simple mock logic to determine score
            const lowerText = jobText.toLowerCase();
            let score = 15; // base
            MOCK_SCAM_PHRASES.forEach(p => {
                if (lowerText.includes(p)) score += 15;
            });
            if (sender.includes("gmail") || sender.includes("yahoo") || sender.includes("@mail.com")) score += 20;
            if (score > 98) score = 98;
            
            setFinalScore(score);
            setStatus("result");
        }, 3500);
    };

    const renderHighlightedText = () => {
        // Simple logic to extract and highlight text matching our mock phrases
        let words = jobText.split(/(\s+)/);
        let currentDelay = 0;

        return (
            <div className="font-mono text-sm leading-8 text-slate-300 whitespace-pre-wrap p-6 bg-[#030712] border border-white/5 rounded-xl shadow-inner relative overflow-hidden">
                {/* Forensic scanline overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-[20%] animate-[scan_3s_linear_infinite_both] pointer-events-none mix-blend-screen" />
                
                {words.map((word, i) => {
                    const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
                    const isDanger = MOCK_SCAM_PHRASES.some(p => p.includes(cleanWord) && cleanWord.length > 3);
                    
                    if (isDanger) {
                        currentDelay += 0.1;
                        return (
                            <motion.span 
                                key={i}
                                initial={{ backgroundColor: "rgba(239, 68, 68, 0)", color: "#CBD5E1" }}
                                animate={{ backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#FCA5A5", borderBottom: "1px solid #EF4444" }}
                                transition={{ delay: currentDelay, duration: 0.3 }}
                                className="px-1 rounded-sm mx-0.5"
                            >
                                {word}
                            </motion.span>
                        );
                    }
                    return <span key={i}>{word}</span>;
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#060B14] font-sans relative overflow-x-hidden selection:bg-red-500/30 text-slate-200">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#3BA4FF 1px, transparent 1px), linear-gradient(90deg, #3BA4FF 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

            {/* Navigation Overlay */}
            <nav className="w-full p-6 flex justify-between items-center relative z-20 max-w-7xl mx-auto">
                <div className="flex items-center">
                    <img 
                        src="/cyberspacelogo.jpeg" 
                        alt="Cyberspace Logo" 
                        className="h-10 w-auto object-contain" 
                    />
                </div>
                <button onClick={() => window.location.href = '/ai-assistant'} className="px-5 py-2.5 rounded-full font-bold text-xs tracking-widest uppercase bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10 flex items-center gap-2">
                    <ArrowRight className="rotate-180" size={14} /> Back to Assistant
                </button>
            </nav>

            <div className="max-w-6xl mx-auto px-4 pb-20 relative z-10 pt-8">
                {/* Header */}
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-red-500/20 bg-red-500/10 text-red-500 text-[10px] font-mono uppercase tracking-widest mb-4">
                        <TerminalSquare size={12} /> Forensic Job Scanner
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
                        Analyze Job Offer
                    </h1>
                    <p className="text-sm font-mono text-slate-500 uppercase tracking-widest mt-2 flex items-center gap-2">
                        <Crosshair size={14} className="text-slate-400" /> Target Payload Decryption
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* LEFT COLUMN: Input */}
                    <motion.div layout className="lg:col-span-5 space-y-6">
                        <div className="bg-[#0B1220] border border-white/5 rounded-2xl p-6 shadow-xl">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                <Search size={14} className="text-cyan-500" /> Data Input
                            </h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-2 block">Raw Message / Email Body *</label>
                                    <textarea 
                                        value={jobText}
                                        onChange={(e) => setJobText(e.target.value)}
                                        disabled={status !== 'idle'}
                                        placeholder="Paste the recruiter's message, email content, or WhatsApp text here..."
                                        className="w-full h-48 bg-[#030712] border border-white/10 rounded-xl p-4 text-sm font-mono text-slate-300 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none shadow-inner disabled:opacity-50"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-2 block">Company Claimed</label>
                                        <input 
                                            type="text" value={company} onChange={(e) => setCompany(e.target.value)} disabled={status !== 'idle'}
                                            placeholder="e.g. Amazon, TCS"
                                            className="w-full bg-[#030712] border border-white/10 rounded-lg p-3 text-sm font-mono text-slate-300 focus:border-cyan-500/50 transition-all disabled:opacity-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-2 block">Sender Email</label>
                                        <input 
                                            type="text" value={sender} onChange={(e) => setSender(e.target.value)} disabled={status !== 'idle'}
                                            placeholder="hr@example.com"
                                            className="w-full bg-[#030712] border border-white/10 rounded-lg p-3 text-sm font-mono text-slate-300 focus:border-cyan-500/50 transition-all disabled:opacity-50"
                                        />
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={handleAnalyze}
                                    disabled={!jobText.trim() || status !== 'idle'}
                                    className="w-full mt-4 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black uppercase font-mono tracking-widest text-xs transition-all shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 border border-red-500/50"
                                >
                                    {status === 'idle' ? (
                                        <><ShieldAlert size={16} /> Execute Forensic Analysis</>
                                    ) : (
                                        <><Activity className="animate-pulse" size={16} /> Analysis Locked</>
                                    )}
                                </button>
                                
                                {status === 'result' && (
                                    <button onClick={() => setStatus('idle')} className="w-full py-3 text-xs font-mono uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                                        Reset Scanner
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT COLUMN: Results & Analysis */}
                    <motion.div layout className="lg:col-span-7">
                        {status === "idle" && (
                            <div className="h-full min-h-[400px] border border-white/5 border-dashed rounded-2xl flex flex-col items-center justify-center text-slate-600 space-y-4">
                                <Briefcase size={48} className="opacity-20" />
                                <p className="text-sm font-mono tracking-widest uppercase">Awaiting Target Payload...</p>
                            </div>
                        )}

                        <AnimatePresence mode="wait">
                            {(status === "scanning" || status === "result") && (
                                <motion.div 
                                    key="analysis"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-6"
                                >
                                    {/* Top Results Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-[#0B1220] border border-white/5 rounded-2xl p-6 shadow-xl flex items-center justify-center">
                                            <ScoreCircle score={finalScore} isScanning={status === "scanning"} />
                                        </div>
                                        
                                        <div className="bg-[#0B1220] border border-white/5 rounded-2xl p-6 shadow-xl">
                                            <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                                                <TerminalSquare size={12} /> Diagnostic Vectors
                                            </h4>
                                            
                                            {status === "scanning" ? (
                                                <div className="space-y-4 font-mono text-xs text-slate-400">
                                                    <p className="flex items-center gap-2"><Activity size={12} className="animate-spin text-cyan-500"/> Extracting entities...</p>
                                                    <p className="flex items-center gap-2"><Activity size={12} className="animate-spin text-cyan-500"/> Cross-referencing known signatures...</p>
                                                    <p className="flex items-center gap-2"><Activity size={12} className="animate-spin text-cyan-500"/> Domain reputation check...</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-3 font-mono text-xs">
                                                    <div className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded flex gap-2">
                                                        <XSquare size={14} className="shrink-0 mt-0.5" /> 
                                                        Detected "processing fee" demand (classic scam vector)
                                                    </div>
                                                    <div className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded flex gap-2">
                                                        <XSquare size={14} className="shrink-0 mt-0.5" /> 
                                                        Generic or mismatched sender email domain
                                                    </div>
                                                    <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded flex gap-2">
                                                        <AlertTriangle size={14} className="shrink-0 mt-0.5" /> 
                                                        Unrealistic effort-to-pay ratio
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Text Inspector */}
                                    <div className="bg-[#0B1220] border border-white/5 rounded-2xl p-6 shadow-xl">
                                        <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                                            <Search size={12} /> Payload Inspector
                                        </h4>
                                        {status === "scanning" ? (
                                            <div className="h-32 bg-[#030712] rounded-xl border border-white/5 relative overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent w-1/2 animate-[pulse_1s_ease-in-out_infinite]" />
                                            </div>
                                        ) : (
                                            renderHighlightedText()
                                        )}
                                    </div>

                                    {/* Action Panel */}
                                    {status === "result" && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                                            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 shadow-xl">
                                                <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-red-500 mb-4 flex items-center gap-2">
                                                    <ShieldAlert size={12} /> Recommended Protocols
                                                </h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                                                        <h5 className="font-bold text-sm text-slate-200 mb-2">Primary Action</h5>
                                                        <p className="text-xs text-slate-400 leading-relaxed font-mono">Do not reply to the message. Block the sender unconditionally. Under no circumstances transfer any onboarding or processing fees.</p>
                                                    </div>
                                                    <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                                                        <h5 className="font-bold text-sm text-slate-200 mb-2">Escalation</h5>
                                                        <p className="text-xs text-slate-400 leading-relaxed font-mono">Report the number/email to the Cybercrime Portal immediately.</p>
                                                        <button className="mt-3 w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-white rounded transition-colors text-center border border-white/10">
                                                            Go to Threat Reporter
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </motion.div>
                </div>
            </div>
            
            <style jsx global>{`
                @keyframes scan {
                    0% { transform: translateY(-100%); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(500%); opacity: 0; }
                }
            `}</style>
        </div>
    );
}
