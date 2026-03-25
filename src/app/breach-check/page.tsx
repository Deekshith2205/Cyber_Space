"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck, Lock, Activity, CheckCircle2,
    AlertTriangle, ArrowRight, ShieldAlert, Key, Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock breach records
const MOCK_BREACHES = [
    { id: 1, company: "LinkedIn", year: 2012, data: ["Email Addresses", "Passwords"], severity: "HIGH" },
    { id: 2, company: "Dubsmash", year: 2018, data: ["Email Addresses", "Names", "Passwords"], severity: "HIGH" },
    { id: 3, company: "Apollo", year: 2018, data: ["Email Addresses", "Employers", "Job Titles", "Locations"], severity: "MEDIUM" },
];

export default function BreachCheckPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "scanning" | "safe" | "breached">("idle");
    const [breachData, setBreachData] = useState<typeof MOCK_BREACHES>([]);

    const handleCheck = () => {
        if (!email.trim() || !email.includes("@")) return;
        setStatus("scanning");
        
        // Simulate API delay
        setTimeout(() => {
            // Very simple demo logic: if email contains 'safe', it's safe. Otherwise mocked breaches.
            if (email.toLowerCase().includes("safe")) {
                setBreachData([]);
                setStatus("safe");
            } else {
                setBreachData(MOCK_BREACHES);
                setStatus("breached");
            }
        }, 2000);
    };

    const resetScan = () => {
        setStatus("idle");
        setEmail("");
        setBreachData([]);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="min-h-screen bg-[#07090F] font-sans relative overflow-x-hidden text-slate-200">
            {/* Extremely subtle background light only on results */}
            <AnimatePresence>
                {status !== "idle" && status !== "scanning" && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}
                        className={cn(
                            "absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] rounded-[100%] blur-[120px] opacity-10 pointer-events-none mix-blend-screen",
                            status === "safe" ? "bg-emerald-500" : "bg-red-500"
                        )} 
                    />
                )}
            </AnimatePresence>

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

            <div className="max-w-3xl mx-auto px-4 pb-20 relative z-10 pt-16">
                
                <AnimatePresence mode="wait">
                    {/* INPUT SECTION */}
                    {(status === "idle" || status === "scanning") && (
                        <motion.div 
                            key="input"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                            transition={{ duration: 0.4 }}
                            className="text-center space-y-10"
                        >
                            <div className="space-y-4">
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white bg-clip-text">
                                    Check Data Breach
                                </h1>
                                <p className="text-slate-400 text-lg font-medium">
                                    Find out securely if your email has been exposed in a data breach.
                                </p>
                            </div>

                            <div className="max-w-xl mx-auto space-y-4">
                                <div className="relative group">
                                    <input 
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={status === "scanning"}
                                        placeholder="Enter your email address"
                                        className="w-full bg-[#0E131F] border border-white/10 rounded-2xl py-5 px-6 text-lg text-white font-medium focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm placeholder:text-slate-600 disabled:opacity-50"
                                    />
                                    <button 
                                        onClick={handleCheck}
                                        disabled={!email.trim() || !email.includes("@") || status === "scanning"}
                                        className="absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-blue-600 text-white font-bold opacity-90 hover:opacity-100 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
                                    >
                                        {status === "scanning" ? (
                                            <><Activity size={18} className="animate-spin" /> Scanning...</>
                                        ) : "Check Breach"}
                                    </button>
                                </div>
                                <p className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
                                    <Lock size={12} className="text-slate-400" /> Your email is never stored or shared with third parties.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* RESULT SECTION */}
                    {status !== "idle" && status !== "scanning" && (
                        <motion.div 
                            key="result"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-10"
                        >
                            {/* Status Banner */}
                            <motion.div 
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                className={cn(
                                    "p-6 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm",
                                    status === "safe" ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-14 h-14 rounded-full flex items-center justify-center shrink-0 border",
                                        status === "safe" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border-red-500/30 text-red-500"
                                    )}>
                                        {status === "safe" ? <ShieldCheck size={28} /> : <AlertTriangle size={28} />}
                                    </div>
                                    <div>
                                        <h2 className={cn("text-2xl font-bold tracking-tight", status === "safe" ? "text-emerald-400" : "text-red-500")}>
                                            {status === "safe" ? "No Breaches Detected" : "Data Exposure Detected"}
                                        </h2>
                                        <p className="text-sm font-medium text-slate-400 mt-1">
                                            {status === "safe" ? `Your email ${email} is secure.` : `${breachData.length} known breaches involve ${email}`}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={resetScan} className="text-xs font-bold text-slate-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/5 whitespace-nowrap">
                                    Check Another Email
                                </button>
                            </motion.div>

                            {/* Breach Timeline (Only if breached) */}
                            {status === "breached" && (
                                <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
                                    <div className="mb-2">
                                        <h3 className="text-lg font-bold text-white tracking-tight">Breach History</h3>
                                        <p className="text-sm text-slate-500 font-medium">Verified instances where your data was compromised.</p>
                                    </div>

                                    <div className="relative border-l-2 border-slate-800/50 ml-4 space-y-8 pb-4">
                                        {breachData.map((b, i) => (
                                            <motion.div key={i} variants={itemVariants} className="relative pl-8">
                                                {/* Dot */}
                                                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-[#07090F] bg-slate-400" />
                                                
                                                <div className="bg-[#0E131F] border border-white/5 p-5 rounded-2xl shadow-sm group hover:border-white/10 transition-colors">
                                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                                                        <div>
                                                            <h4 className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">{b.company}</h4>
                                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Breach occurred in {b.year}</p>
                                                        </div>
                                                        <span className={cn(
                                                            "inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest border h-fit",
                                                            b.severity === "HIGH" ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                                        )}>
                                                            {b.severity} RISK
                                                        </span>
                                                    </div>
                                                    
                                                    <div>
                                                        <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Compromised Data:</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {b.data.map((d, di) => (
                                                                <span key={di} className="px-3 py-1.5 bg-black/40 border border-white/5 rounded-lg text-xs font-medium text-slate-300">
                                                                    {d}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Action Panel */}
                            {status === "breached" && (
                                <motion.div variants={itemVariants} className="pt-6">
                                    <div className="bg-gradient-to-br from-blue-900/10 to-indigo-900/10 border border-blue-500/20 rounded-3xl p-8 shadow-sm">
                                        <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-6">
                                            <ShieldAlert className="text-blue-500" size={20} /> Immediate Action Required
                                        </h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="bg-black/20 p-5 rounded-2xl border border-white/5">
                                                <Key size={20} className="text-slate-400 mb-3" />
                                                <h4 className="font-bold text-sm text-white mb-1">Change Passwords</h4>
                                                <p className="text-xs text-slate-400 font-medium leading-relaxed">Immediately change passwords for all affected services, prioritizing email accounts.</p>
                                            </div>
                                            <div className="bg-black/20 p-5 rounded-2xl border border-white/5">
                                                <Lock size={20} className="text-slate-400 mb-3" />
                                                <h4 className="font-bold text-sm text-white mb-1">Enable 2FA</h4>
                                                <p className="text-xs text-slate-400 font-medium leading-relaxed">Activate two-factor authentication on critical accounts to block unauthorized access.</p>
                                            </div>
                                            <div className="bg-black/20 p-5 rounded-2xl border border-white/5">
                                                <Eye size={20} className="text-slate-400 mb-3" />
                                                <h4 className="font-bold text-sm text-white mb-1">Monitor Activity</h4>
                                                <p className="text-xs text-slate-400 font-medium leading-relaxed">Check your financial statements and email forwarding rules for suspicious changes.</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Safe UI Extras */}
                            {status === "safe" && (
                                <motion.div variants={itemVariants} className="pt-6">
                                    <div className="bg-black/20 border border-white/5 rounded-3xl p-8 shadow-sm max-w-2xl mx-auto text-center">
                                        <ShieldCheck size={32} className="text-slate-600 mx-auto mb-4" />
                                        <h3 className="text-lg font-bold text-white mb-2">Good Security Posture</h3>
                                        <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6">
                                            While no breaches were found for this email, it's essential to remain vigilant. Use strong, unique passwords for every service.
                                        </p>
                                        <button className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white font-bold text-sm rounded-xl transition-colors border border-white/10">
                                            Review Security Best Practices
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
