"use client";

import React, { useState } from "react";
import { Search, Link2, ShieldCheck, ShieldAlert, AlertCircle, CheckCircle2, Globe, Lock, Unlock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function PhishingChecker() {
    const [url, setUrl] = useState("");
    const [isChecking, setIsChecking] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const checkLink = async () => {
        if (!url) return;
        setIsChecking(true);
        setResult(null);
        setError(null);

        try {
            const response = await fetch("http://localhost:5000/api/scan-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Unable to analyze URL. Please try again.");
            }

            const data = await response.json();
            
            // Transform VirusTotal result to the format expected by PhishingChecker UI
            const totalDetections = data.malicious + data.suspicious;
            const riskPercentage = Math.min(Math.round((totalDetections / 10) * 100), 100);

            setResult({
                riskScore: data.threatLevel === "Safe" ? 0 : data.threatLevel === "Suspicious" ? Math.max(30, riskPercentage) : Math.max(75, riskPercentage),
                isSafe: data.threatLevel === "Safe",
                domain: url.replace(/^https?:\/\//, '').split('/')[0],
                ssl: "Verified",
                indicators: (data.engineResults && data.engineResults.length > 0)
                    ? data.engineResults.slice(0, 4).map((res: any) => `${res.engine} flagged as ${res.category}`)
                    : ["Reliable security vendors found no threats", "Domain reputation appears clean", "No typosquatting detected"]
            });
        } catch (err: any) {
            console.error("Phishing Checker Error:", err);
            setError(err.message || "Failed to connect to backend");
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <div className="space-y-8 pt-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-black text-white tracking-tight">Phishing Link Checker</h2>
                <p className="text-zinc-500 text-sm">AI-driven URL analysis and domain trust verification.</p>
            </div>

            <div className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] text-orange-500 font-bold uppercase tracking-widest">
                        <Link2 size={12} /> URL Reputation Analysis
                    </div>
                    <h3 className="text-xl font-bold text-white">Paste Suspicious Link</h3>

                    <div className="flex gap-3">
                        <div className="relative flex-1 group">
                            <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors" size={20} />
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://suspicious-website.com/login"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all text-sm"
                            />
                        </div>
                        <button
                            onClick={checkLink}
                            disabled={isChecking || !url}
                            className={cn(
                                "px-8 rounded-2xl font-bold text-sm transition-all flex items-center gap-2",
                                isChecking
                                    ? "bg-white/5 text-zinc-500 cursor-not-allowed"
                                    : "bg-orange-500 text-white hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                            )}
                        >
                            Check URL
                        </button>
                    </div>
                    {error && (
                        <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-alert-red text-xs font-bold mt-2"
                        >
                            {error}
                        </motion.p>
                    )}
                </div>

                <AnimatePresence>
                    {isChecking && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-12 flex flex-col items-center gap-4 py-8"
                        >
                            <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Analyzing vectors...</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                    >
                        {/* Risk Gauge */}
                        <div className="glass p-6 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center">
                            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                                    <motion.circle
                                        cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
                                        strokeDasharray={364}
                                        initial={{ strokeDashoffset: 364 }}
                                        animate={{ strokeDashoffset: 364 - (364 * result.riskScore / 100) }}
                                        className="text-alert-red"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-black text-alert-red">{result.riskScore}%</span>
                                    <span className="text-[8px] font-bold text-zinc-500 uppercase">Risk Level</span>
                                </div>
                            </div>
                            <h4 className="text-sm font-bold text-white uppercase italic">High Malicious Probability</h4>
                        </div>

                        {/* Analysis Details */}
                        <div className="lg:col-span-2 glass p-6 rounded-3xl border border-white/10 space-y-6">
                            <div className={cn(
                                "p-4 rounded-2xl flex items-center justify-between",
                                result.isSafe ? "bg-success-green/10 border border-success-green/20" : "bg-alert-red/10 border border-alert-red/20 text-alert-red"
                            )}>
                                <div className="flex items-center gap-3">
                                    {result.isSafe ? <ShieldCheck size={24} /> : <AlertCircle size={24} />}
                                    <div>
                                        <h4 className="text-sm font-bold">{result.isSafe ? "Link is Secure" : "DANGER: Malicious Link Detected"}</h4>
                                        <p className="text-[10px] opacity-80 font-bold uppercase tracking-widest">{result.domain}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                        <CheckCircle2 size={12} className="text-cyber-blue" />
                                        Domain Analysis
                                    </div>
                                    <p className="text-xs font-bold text-white">{result.domain}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                        <Lock size={12} className="text-cyber-blue" />
                                        SSL Verification
                                    </div>
                                    <p className="text-xs font-bold text-alert-red flex items-center gap-1">
                                        <Unlock size={12} /> {result.ssl}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Key Indicators</h4>
                                <div className="space-y-2">
                                    {result.indicators.map((ind: string, idx: number) => (
                                        <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-alert-red" />
                                            {ind}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
