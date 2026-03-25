"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    AlertOctagon, ShieldAlert, ArrowRight, QrCode, 
    MessageSquareWarning, ExternalLink, XOctagon, CheckCircle,
    Activity, ShieldCheck, AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock scam analyzer
const analyzePaymentRisk = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Simple Keyword Matching for prototype
    if (lowerText.includes("scan") && lowerText.includes("receive")) {
        return {
            status: "FRAUD",
            type: "Reverse QR Code Scam",
            desc: "The scammer is trying to trick you into entering your UPI PIN to 'receive' money. PINs are ONLY used to SEND money."
        };
    }
    if (lowerText.includes("anydesk") || lowerText.includes("teamviewer") || lowerText.includes("quicksupport")) {
        return {
            status: "FRAUD",
            type: "Remote Access Takeover",
            desc: "The scammer wants you to install a screen-sharing app to watch you enter passwords or steal OTPs directly from your screen."
        };
    }
    if (lowerText.includes("kyc") && (lowerText.includes("suspend") || lowerText.includes("block"))) {
        return {
            status: "FRAUD",
            type: "Urgent KYC Threat",
            desc: "A classic pressure tactic. Banks will never threaten immediate account suspension via an unverified SMS with a random link."
        };
    }
    if (lowerText.trim() === "safe") {
        return { status: "SAFE", type: "No Immediate Threat", desc: "This message does not contain standard fraud markers, but always remain vigilant." };
    }

    return {
        status: "WARNING",
        type: "Suspicious Payment Request",
        desc: "We detected risky language. Verify the sender's identity through official channels before proceeding."
    };
};

export default function PaymentFraudPage() {
    const [inputText, setInputText] = useState("");
    const [fileUploaded, setFileUploaded] = useState(false);
    
    const [status, setStatus] = useState<"idle" | "scanning" | "result">("idle");
    const [result, setResult] = useState<{ status: string; type: string; desc: string } | null>(null);

    const handleAnalyze = () => {
        if (!inputText.trim() && !fileUploaded) return;
        
        setStatus("scanning");
        setTimeout(() => {
            setResult(analyzePaymentRisk(inputText || "QR mock"));
            setStatus("result");
        }, 1800);
    };

    const resetScan = () => {
        setStatus("idle");
        setInputText("");
        setFileUploaded(false);
        setResult(null);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    return (
        <div className="min-h-screen bg-[#030303] font-sans relative overflow-x-hidden text-slate-200">
            {/* Extremely dramatic red background bloom for high-alert */}
            <AnimatePresence>
                {status === "result" && result?.status === "FRAUD" && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: [0, 0.4, 0.2] }} 
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        className="fixed inset-0 bg-red-600/20 pointer-events-none mix-blend-screen" 
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

            <div className="max-w-4xl mx-auto px-4 pb-20 relative z-10 pt-8">
                
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">
                        Detect Payment Fraud
                    </h1>
                    <p className="text-sm md:text-base font-bold text-red-500 uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                        <AlertOctagon size={18} /> Avoid scams before it's too late
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {/* INPUT SECTION */}
                    {(status === "idle" || status === "scanning") && (
                        <motion.div 
                            key="input"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden max-w-2xl mx-auto"
                        >
                            {status === "scanning" && (
                                <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-10 flex flex-col items-center justify-center space-y-6">
                                    <div className="relative w-24 h-24 flex items-center justify-center">
                                        <div className="absolute inset-0 border-4 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                                        <ShieldAlert size={40} className="text-red-500 animate-pulse" />
                                    </div>
                                    <p className="text-sm font-black text-red-500 uppercase tracking-[0.2em] animate-pulse">Running Risk Analysis...</p>
                                </div>
                            )}

                            <div className="space-y-6">
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                                        <MessageSquareWarning size={14} className="text-blue-500"/> Describe Situation or Paste Message
                                    </label>
                                    <textarea 
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder="e.g. Someone sent me a QR code and said I need to scan it and enter my PIN to receive 5000 Rupees..."
                                        className="w-full h-32 bg-black border border-white/10 rounded-xl py-4 px-5 text-sm font-medium text-white focus:outline-none focus:border-red-500/50 transition-all shadow-inner resize-none focus:bg-red-500/5"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                                        <QrCode size={14} className="text-emerald-500"/> Optional Evidence
                                    </label>
                                    <div 
                                        onClick={() => setFileUploaded(!fileUploaded)}
                                        className={cn(
                                            "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors",
                                            fileUploaded ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" : "border-white/10 hover:border-white/20 bg-black text-slate-500"
                                        )}
                                    >
                                        <p className="text-sm font-bold tracking-tight">
                                            {fileUploaded ? "✓ QR Code Mock Uploaded" : "Click to Upload Screenshot / QR Image"}
                                        </p>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleAnalyze}
                                    disabled={!inputText.trim() && !fileUploaded}
                                    className="w-full py-5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-[0.2em] text-sm transition-all shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] disabled:opacity-30 disabled:pointer-events-none"
                                >
                                    Analyze Payment Risk
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* RESULT SECTION */}
                    {status === "result" && result && (
                        <motion.div 
                            key="result"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="space-y-6"
                        >
                            {/* THE ALERT BANNER */}
                            <motion.div 
                                variants={itemVariants}
                                className={cn(
                                    "rounded-3xl p-8 border-2 shadow-2xl relative overflow-hidden",
                                    result.status === "FRAUD" ? "bg-red-950/40 border-red-500" : 
                                    result.status === "WARNING" ? "bg-yellow-950/40 border-yellow-500" : "bg-emerald-950/40 border-emerald-500"
                                )}
                            >
                                {/* Diagonal hazard stripes for fraud */}
                                {result.status === "FRAUD" && (
                                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, #EF4444 10px, #EF4444 20px)" }} />
                                )}

                                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
                                    <div className={cn(
                                        "w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                                        result.status === "FRAUD" ? "bg-red-500 text-white animate-pulse" : 
                                        result.status === "WARNING" ? "bg-yellow-500 text-black" : "bg-emerald-500 text-white"
                                    )}>
                                        {result.status === "FRAUD" ? <XOctagon size={48} /> : 
                                         result.status === "WARNING" ? <AlertTriangle size={48} /> : 
                                         <ShieldCheck size={48} />}
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h2 className={cn("text-4xl md:text-5xl font-black uppercase tracking-tighter",
                                            result.status === "FRAUD" ? "text-red-500" :
                                            result.status === "WARNING" ? "text-yellow-500" : "text-emerald-500"
                                        )}>
                                            {result.status} {result.status === "FRAUD" && "DETECTED"}
                                        </h2>
                                        <p className="text-xl font-medium text-white mt-1 mb-3">
                                            {result.type}
                                        </p>
                                        <p className="text-sm font-medium text-slate-300 bg-black/50 p-4 rounded-xl border border-white/5 inline-block">
                                            {result.desc}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* PROTOCOL PANELS */}
                            {result.status !== "SAFE" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* WHAT NOT TO DO */}
                                    <motion.div variants={itemVariants} className="bg-[#120000] border border-red-500/30 rounded-3xl p-8 shadow-xl">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center">
                                                <XOctagon size={24} />
                                            </div>
                                            <h3 className="text-xl font-black text-red-500 uppercase tracking-tight">CRITICAL: Do Not Do This</h3>
                                        </div>
                                        <ul className="space-y-4">
                                            <li className="flex items-start gap-3 bg-red-500/5 p-4 rounded-xl border border-red-500/10">
                                                <XOctagon className="text-red-500 mt-0.5 shrink-0" size={18} />
                                                <p className="text-sm font-bold text-slate-200">Do NOT enter your UPI PIN. <span className="text-red-400 block font-normal mt-1">PIN is only used for sending money, never for receiving.</span></p>
                                            </li>
                                            <li className="flex items-start gap-3 bg-red-500/5 p-4 rounded-xl border border-red-500/10">
                                                <XOctagon className="text-red-500 mt-0.5 shrink-0" size={18} />
                                                <p className="text-sm font-bold text-slate-200">Do NOT share your screen. <span className="text-red-400 block font-normal mt-1">Delete AnyDesk, TeamViewer, or similar apps immediately if instructed to download them.</span></p>
                                            </li>
                                            <li className="flex items-start gap-3 bg-red-500/5 p-4 rounded-xl border border-red-500/10">
                                                <XOctagon className="text-red-500 mt-0.5 shrink-0" size={18} />
                                                <p className="text-sm font-bold text-slate-200">Do NOT click SMS links. <span className="text-red-400 block font-normal mt-1">Do not click PAN/KYC update links received from random mobile numbers.</span></p>
                                            </li>
                                        </ul>
                                    </motion.div>

                                    {/* WHAT TO DO */}
                                    <motion.div variants={itemVariants} className="bg-[#000802] border border-emerald-500/30 rounded-3xl p-8 shadow-xl flex flex-col">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                                                <CheckCircle size={24} />
                                            </div>
                                            <h3 className="text-xl font-black text-emerald-500 uppercase tracking-tight">Safe Actions To Take</h3>
                                        </div>
                                        <ul className="space-y-4 flex-grow">
                                            <li className="flex items-start gap-3 p-4">
                                                <CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                                                <p className="text-sm font-bold text-slate-200">Block the sender / Disconnect the call immediately.</p>
                                            </li>
                                            <li className="flex items-start gap-3 p-4">
                                                <CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                                                <p className="text-sm font-bold text-slate-200">Contact your bank's official customer care number from the back of your debit card.</p>
                                            </li>
                                        </ul>

                                        <div className="mt-8 space-y-3">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Official Report Links</p>
                                            <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="flex items-center justify-between w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors group">
                                                <span className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">cybercrime.gov.in (Call 1930)</span>
                                                <ExternalLink size={16} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
                                            </a>
                                            <a href="https://sachet.rbi.org.in" target="_blank" rel="noreferrer" className="flex items-center justify-between w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors group">
                                                <span className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">sachet.rbi.org.in (RBI Portal)</span>
                                                <ExternalLink size={16} className="text-slate-500 group-hover:text-amber-400 transition-colors" />
                                            </a>
                                        </div>
                                    </motion.div>
                                </div>
                            )}

                            <motion.div variants={itemVariants} className="text-center pt-8">
                                <button onClick={resetScan} className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors underline underline-offset-4 pointer-events-auto">
                                    Analyze Another Message
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
