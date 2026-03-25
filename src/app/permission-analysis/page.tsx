"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck, ArrowRight, Smartphone, Terminal,
    AlertTriangle, ShieldAlert, CheckCircle2, Info, Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

// Comprehensive Mock Database for translating permissions
const PERMISSION_DB: Record<string, { severity: "SAFE"|"SUSPICIOUS"|"DANGEROUS", desc: string, why: string }> = {
    "READ_SMS": {
        severity: "DANGEROUS",
        desc: "Allows the app to read all your text messages.",
        why: "Apps can intercept OTPs (One Time Passwords) for your bank or social media, leading to account takeover."
    },
    "RECORD_AUDIO": {
        severity: "DANGEROUS",
        desc: "Allows the app to use the microphone to record audio at any time.",
        why: "Malicious apps can listen to your background conversations or phone calls without you knowing."
    },
    "CAMERA": {
        severity: "DANGEROUS",
        desc: "Allows the app to take pictures and record video.",
        why: "Apps can secretly capture photos of you or your surroundings."
    },
    "READ_CONTACTS": {
        severity: "SUSPICIOUS",
        desc: "Allows the app to read data about your contacts.",
        why: "Often used to harvest data and spam your friends or sell your network information."
    },
    "ACCESS_FINE_LOCATION": {
        severity: "SUSPICIOUS",
        desc: "Pinpoints your exact GPS location.",
        why: "While needed for maps, a calculator or flashlight app tracking your precise location is highly invasive."
    },
    "INTERNET": {
        severity: "SAFE",
        desc: "Allows the app to connect to the internet.",
        why: "Almost all modern apps need this to function normally (e.g., loading ads, fetching data)."
    },
    "VIBRATE": {
        severity: "SAFE",
        desc: "Allows the app to control the vibration motor.",
        why: "Used for harmless haptic feedback and notifications."
    }
};

export default function PermissionAnalysisPage() {
    const [inputMode, setInputMode] = useState<"name" | "paste">("paste");
    const [appTitle, setAppTitle] = useState("");
    const [rawPermissions, setRawPermissions] = useState("");
    
    const [status, setStatus] = useState<"idle" | "scanning" | "result">("idle");
    const [analyzedPermissions, setAnalyzedPermissions] = useState<any[]>([]);

    const handleAnalyze = () => {
        if (inputMode === "name" && !appTitle.trim()) return;
        if (inputMode === "paste" && !rawPermissions.trim()) return;
        
        setStatus("scanning");
        
        setTimeout(() => {
            // Mock logic to extract permissions
            let extracted: string[] = [];
            
            if (inputMode === "name") {
                // If it's just a name, mock some standard scary permissions for a random app
                extracted = ["CAMERA", "RECORD_AUDIO", "INTERNET", "READ_CONTACTS"];
            } else {
                // Extract from pasted text
                const upperText = rawPermissions.toUpperCase();
                Object.keys(PERMISSION_DB).forEach(key => {
                    if (upperText.includes(key) || upperText.includes(key.replace("_", " "))) {
                        extracted.push(key);
                    }
                });
                // Fallback if none found exactly
                if (extracted.length === 0) {
                    extracted = ["READ_SMS", "INTERNET"];
                }
            }
            
            const results = extracted.map(key => ({
                id: key,
                ...PERMISSION_DB[key]
            })).sort((a, b) => {
                const weight = { "DANGEROUS": 3, "SUSPICIOUS": 2, "SAFE": 1 };
                return weight[b.severity] - weight[a.severity]; // Riskiest first
            });

            setAnalyzedPermissions(results);
            setStatus("result");
        }, 1500);
    };

    const resetAnalyzer = () => {
        setStatus("idle");
        setAppTitle("");
        setRawPermissions("");
        setAnalyzedPermissions([]);
    };

    // Animation Configs
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.2 } }
    };

    const cardVariants = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0, transition: { duration: 0.5 } }
    };

    const getSeverityConfig = (severity: string) => {
        switch(severity) {
            case "DANGEROUS": return { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30", icon: ShieldAlert, label: "🔴 DANGEROUS" };
            case "SUSPICIOUS": return { color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/30", icon: AlertTriangle, label: "🟡 SUSPICIOUS" };
            default: return { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", icon: CheckCircle2, label: "🟢 SAFE" };
        }
    };

    return (
        <div className="min-h-screen bg-[#07090F] font-sans relative overflow-x-hidden text-slate-200">
            {/* Soft Ambient Background Glow Component */}
            <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

            {/* Navigation Overlay */}
            <nav className="w-full p-6 flex justify-between items-center relative z-20 max-w-7xl mx-auto">
                <div className="flex items-center">
                    <img 
                        src="/cyberspacelogo.jpeg" 
                        alt="Cyberspace Logo" 
                        className="h-10 w-auto object-contain" 
                    />
                </div>
                <button onClick={() => window.location.href = '/ai-assistant'} className="px-5 py-2.5 rounded-full font-bold text-xs tracking-widest uppercase bg-transparent hover:bg-white/5 text-slate-400 hover:text-white transition-colors border border-white/5 flex items-center gap-2">
                    <ArrowRight className="rotate-180" size={14} /> Back to Assistant
                </button>
            </nav>

            <div className="max-w-4xl mx-auto px-4 pb-20 relative z-10 pt-10">
                
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono uppercase tracking-widest mb-4">
                        <Smartphone size={14} /> Android/iOS Security
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
                        Analyze App Permissions
                    </h1>
                    <p className="text-sm font-medium text-slate-400 mt-4 max-w-xl mx-auto leading-relaxed">
                        Detect suspicious or dangerous hidden access granted to applications. We translate scary technical jargon into plain English.
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {/* INPUT SECTION */}
                    {(status === "idle" || status === "scanning") && (
                        <motion.div 
                            key="input"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
                            className="bg-[#0B1220] border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
                        >
                            {status === "scanning" && (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-4">
                                    <Activity className="w-10 h-10 text-blue-400 animate-spin" />
                                    <p className="text-xs font-mono text-blue-400 uppercase tracking-widest animate-pulse">Decompiling Manifest...</p>
                                </div>
                            )}

                            {/* Tabs */}
                            <div className="flex p-1 bg-black/40 rounded-xl mb-8 border border-white/5 w-fit mx-auto">
                                <button 
                                    onClick={() => setInputMode("paste")}
                                    className={cn("px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center gap-2", inputMode === "paste" ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300")}
                                >
                                    <Terminal size={14}/> Paste List
                                </button>
                                <button 
                                    onClick={() => setInputMode("name")}
                                    className={cn("px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center gap-2", inputMode === "name" ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300")}
                                >
                                    <Smartphone size={14}/> App Name
                                </button>
                            </div>

                            <div className="space-y-6">
                                {inputMode === "name" ? (
                                    <div className="space-y-3 max-w-md mx-auto">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Target Application Name</label>
                                        <input 
                                            type="text"
                                            value={appTitle}
                                            onChange={(e) => setAppTitle(e.target.value)}
                                            placeholder="e.g. Super Flashlight Pro"
                                            className="w-full bg-[#030712] border border-white/10 rounded-xl py-4 px-5 text-sm font-medium text-white focus:outline-none focus:border-blue-500/50 transition-all shadow-inner"
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Paste Full Permission List</label>
                                        <textarea 
                                            value={rawPermissions}
                                            onChange={(e) => setRawPermissions(e.target.value)}
                                            placeholder="android.permission.READ_SMS&#10;android.permission.CAMERA..."
                                            className="w-full h-40 bg-[#030712] border border-white/10 rounded-xl py-4 px-5 text-sm font-mono text-slate-300 focus:outline-none focus:border-blue-500/50 transition-all shadow-inner resize-none"
                                        />
                                    </div>
                                )}

                                <div className="pt-4 border-t border-white/5 flex justify-center">
                                    <button 
                                        onClick={handleAnalyze}
                                        className="w-full md:w-auto px-12 py-4 rounded-xl relative group overflow-hidden bg-blue-600 text-white font-black uppercase tracking-widest text-xs transition-all hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]"
                                    >
                                        Analyze Permissions
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* RESULTS SECTION */}
                    {status === "result" && (
                        <motion.div 
                            key="result"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0B1220] border border-white/5 p-6 rounded-2xl shadow-sm">
                                <div>
                                    <h3 className="text-xl font-black text-white">Diagnostic Report</h3>
                                    <p className="text-xs font-medium text-slate-400 mt-1">Found {analyzedPermissions.length} distinct permission requests.</p>
                                </div>
                                <button onClick={resetAnalyzer} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors">
                                    Analyze Another
                                </button>
                            </div>

                            <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
                                {analyzedPermissions.map((perm, idx) => {
                                    const config = getSeverityConfig(perm.severity);
                                    
                                    return (
                                        <motion.div 
                                            key={idx} 
                                            variants={cardVariants}
                                            className={cn(
                                                "relative overflow-hidden group bg-[#0B1220] border rounded-2xl p-6 transition-colors shadow-sm",
                                                config.border
                                            )}
                                        >
                                            {/* Subtle background wash based on severity */}
                                            <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity", config.bg.replace('/10', ''))} />
                                            
                                            {/* Desktop Layout */}
                                            <div className="flex flex-col md:flex-row md:items-start gap-6 relative z-10">
                                                
                                                {/* Left Column: Raw Name and Tag */}
                                                <div className="md:w-1/3 shrink-0">
                                                    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-black tracking-widest mb-3 border", config.bg, config.color, config.border)}>
                                                        {config.label}
                                                    </div>
                                                    <h4 className="font-mono font-bold text-white text-sm break-all">
                                                        {perm.id}
                                                    </h4>
                                                </div>

                                                {/* Right Column: Explanations */}
                                                <div className="md:w-2/3 space-y-4 md:border-l md:border-white/5 md:pl-6">
                                                    <div>
                                                        <h5 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 mb-1">
                                                            <Info size={14} className="text-blue-400" /> What it does
                                                        </h5>
                                                        <p className="text-sm text-slate-300 font-medium leading-relaxed">
                                                            {perm.desc}
                                                        </p>
                                                    </div>

                                                    <div className="pt-3 border-t border-white/5">
                                                        <h5 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 mb-1">
                                                            <config.icon size={14} className={config.color} /> Risk Analysis
                                                        </h5>
                                                        <p className={cn("text-sm font-medium leading-relaxed", "text-slate-300")}>
                                                            {perm.why}
                                                        </p>
                                                    </div>
                                                </div>

                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                            
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
