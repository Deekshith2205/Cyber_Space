"use client";

import React, { useState } from "react";
import { Link2, ShieldCheck, AlertTriangle, ShieldAlert, Activity, Server, Key, Info, HelpCircle, FileWarning } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

import { useAuth } from "@/context/AuthContext";

type ThreatChecks = {
    google_safe_browsing?: boolean;
    https_secure?: boolean;
    suspicious_keywords?: boolean;
    suspicious_tld?: boolean;
    dns_resolved?: boolean;
    domain_age_days?: number;
};

type ThreatResult = {
    url: string;
    risk_score: number;
    status: "Safe" | "Suspicious" | "High Risk" | "Malicious" | "INVALID URL" | "INVALID DOMAIN";
    reason?: string | string[]; // Can now be array of penalty reasons, or a single reason if invalid
    checks: ThreatChecks;
};

export default function PhishingChecker() {
    const [url, setUrl] = useState("");
    const [isChecking, setIsChecking] = useState(false);
    const [result, setResult] = useState<ThreatResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { token } = useAuth();

    const checkLink = async () => {
        if (!url) return;
        setIsChecking(true);
        setResult(null);
        setError(null);

        try {
            const response = await fetch("http://localhost:5000/api/phishing/check", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                throw new Error("Threat analysis failed. Please retry.");
            }

            const data = await response.json();
            setResult(data);
            
        } catch (err: any) {
            console.error("Phishing Checker Error:", err);
            setError("Threat analysis failed. Please retry.");
        } finally {
            setIsChecking(false);
        }
    };

    // Chart Data Preparation
    const getRiskColor = (score: number, status?: string) => {
        if (status && status.includes("INVALID")) return "#71717a"; // Gray
        if (score <= 20) return "#22c55e"; // Success Green
        if (score <= 50) return "#eab308"; // Yellow/Suspicious
        if (score <= 80) return "#f97316"; // Orange/High Risk
        return "#ef4444"; // Alert Red/Malicious
    };

    // Calculate passing/failing checks for Pie Chart
    const getPieData = () => {
        if (!result || !result.checks || Object.keys(result.checks).length === 0) return [];
        let passed = 0;
        let failed = 0;
        
        result.checks.google_safe_browsing ? passed++ : failed++;
        result.checks.https_secure ? passed++ : failed++;
        !result.checks.suspicious_keywords ? passed++ : failed++; // lack of keywords is a pass
        !result.checks.suspicious_tld ? passed++ : failed++; 
        result.checks.dns_resolved ? passed++ : failed++;
        
        // Age: pass if > 30 or if it's an IP (represented as -1 age usually)
        if (result.checks.domain_age_days !== undefined) {
             (result.checks.domain_age_days >= 30 || result.checks.domain_age_days === -1) ? passed++ : failed++;
        }

        return [
            { name: "Secure Signals", value: passed, color: "#22c55e" },
            { name: "Risk Vectors", value: failed, color: "#ef4444" }
        ];
    };
    
    const getBarData = () => {
        if (!result || !result.checks || Object.keys(result.checks).length === 0) return [];
        
        const data = [
             { name: 'Google API', penalty: !result.checks.google_safe_browsing ? 90 : 0 },
             { name: 'SSL Verify', penalty: !result.checks.https_secure ? 15 : 0 },
             { name: 'Lexical', penalty: result.checks.suspicious_keywords ? 20 : 0 },
             { name: 'TLD Status', penalty: result.checks.suspicious_tld ? 15 : 0 },
        ];

        if (result.checks.domain_age_days !== undefined && result.checks.domain_age_days !== -1) {
            data.push({ name: 'Domain Age', penalty: result.checks.domain_age_days < 30 ? 25 : 0 });
        }

        return data;
    };

    const isInvalidState = result?.status.includes("INVALID");

    return (
        <div className="space-y-8 pt-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-black text-white tracking-tight">Advanced Phishing Link Checker</h2>
                <p className="text-zinc-500 text-sm">Real-time threat intelligence and multi-vector AI risk scoring.</p>
            </div>

            <div className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] text-cyan-500 font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                        <Activity size={12} /> Deep Packet Inspection
                    </div>
                    <h3 className="text-xl font-bold text-white">Target URL for Analysis</h3>

                    <div className="flex gap-3">
                        <div className="relative flex-1 group">
                            <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-cyan-500 transition-colors" size={20} />
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://suspicious-website.com/login"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all text-sm font-mono"
                            />
                        </div>
                        <button
                            onClick={checkLink}
                            disabled={isChecking || !url}
                            className={cn(
                                "px-8 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 border border-transparent whitespace-nowrap",
                                isChecking
                                    ? "bg-white/5 text-zinc-500 cursor-not-allowed"
                                    : "bg-cyan-500/20 text-cyan-400 border-cyan-500/50 hover:bg-cyan-500 hover:text-white hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]"
                            )}
                        >
                            {isChecking ? "Scanning..." : "Initiate Scan"}
                        </button>
                    </div>
                    {error && (
                        <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-alert-red text-xs font-bold mt-2 bg-alert-red/10 border border-alert-red/20 py-2 rounded-lg"
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
                            exit={{ opacity: 0 }}
                            className="mt-12 flex flex-col items-center gap-4 py-8"
                        >
                            <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin shadow-[0_0_30px_rgba(6,182,212,0.3)]" />
                            <p className="text-xs font-bold text-cyan-500 uppercase tracking-widest animate-pulse">Running heuristic algorithms...</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="space-y-6"
                    >
                        {/* Title and Top Level Info */}
                        <div className="flex items-center justify-between">
                             <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Activity className="text-cyan-500" />
                                Threat Intelligence Report
                             </h2>
                             <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-mono">
                                 {new Date().toLocaleString()}
                             </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            
                            {/* Main Risk Gauge Card (Left) */}
                            <div className="glass p-8 rounded-3xl border border-white/10 flex flex-col items-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-0 pointer-events-none" />
                                <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center">
                                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 w-full text-left">Overall Risk Score</h3>
                                    
                                    <div className="relative w-48 h-48 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl">
                                            {/* Background Track */}
                                            <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                                            {/* Animated Progress */}
                                            <motion.circle
                                                cx="96" cy="96" r="80" stroke={getRiskColor(result.risk_score, result.status)} strokeWidth="12" fill="transparent"
                                                strokeDasharray={502}
                                                strokeLinecap="round"
                                                initial={{ strokeDashoffset: 502 }}
                                                animate={{ strokeDashoffset: 502 - (502 * (isInvalidState ? 0 : result.risk_score) / 100) }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <motion.span 
                                                className="text-5xl font-black"
                                                style={{ color: getRiskColor(result.risk_score, result.status) }}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.5, type: 'spring' }}
                                            >
                                                {isInvalidState ? "N/A" : result.risk_score}
                                            </motion.span>
                                            {!isInvalidState && <span className="text-[10px] font-bold text-zinc-500 uppercase mt-1">out of 100</span>}
                                        </div>
                                    </div>

                                    <div className="mt-8 text-center bg-black/40 px-6 py-3 rounded-2xl border border-white/5 backdrop-blur-md">
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Status</p>
                                        <div className="flex items-center justify-center gap-2">
                                            {result.status.includes("INVALID") ? (
                                                <HelpCircle size={18} className="text-zinc-500" />
                                            ) : result.status === "Safe" ? (
                                                <ShieldCheck size={18} className="text-success-green" />
                                            ) : result.status === "Suspicious" ? (
                                                <AlertTriangle size={18} className="text-yellow-500" />
                                            ) : result.status === "High Risk" ? (
                                                <AlertTriangle size={18} className="text-orange-500" />
                                            ) : (
                                                <ShieldAlert size={18} className="text-alert-red" />
                                            )}
                                            <span className="font-black tracking-widest text-lg" style={{ color: getRiskColor(result.risk_score, result.status) }}>
                                                {isInvalidState ? "UNKNOWN" : result.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Charts & Details Data (Middle & Right) */}
                            <div className="lg:col-span-2 space-y-6">
                                
                                {/* Target info row */}
                                <div className="glass p-6 rounded-3xl border border-white/10 relative overflow-hidden">
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Analyzed Target</p>
                                    <p className="text-sm font-medium text-white break-all font-mono">{result.url}</p>
                                    
                                    {/* Penalty Reasons Container */}
                                    {result.reason && (
                                        <div className="mt-4 pt-4 border-t border-white/10">
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Intelligence Reasons</p>
                                            
                                            {Array.isArray(result.reason) ? (
                                                <ul className="space-y-2">
                                                    {result.reason.map((r, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-xs font-bold text-orange-400">
                                                            <FileWarning size={14} className="shrink-0 mt-0.5" />
                                                            {r}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                                                    <Info size={14} className="text-zinc-500" />
                                                    {result.reason}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Charts Grid (Only render if NOT invalid) */}
                                {!isInvalidState && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        
                                        {/* Bar Chart: Threat Vectors */}
                                        <div className="glass p-5 rounded-3xl border border-white/10 h-64 flex flex-col">
                                            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Risk Penalties</h3>
                                            <div className="flex-1 w-full relative">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={getBarData()} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                                        <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
                                                        <YAxis tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
                                                        <Tooltip 
                                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                            contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '12px', fontSize: '12px' }}
                                                        />
                                                        <Bar dataKey="penalty" radius={[4, 4, 0, 0]}>
                                                            {getBarData().map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={entry.penalty > 0 ? '#ef4444' : '#22c55e'} />
                                                            ))}
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        {/* Security Breakdown Pie */}
                                        <div className="glass p-5 rounded-3xl border border-white/10 h-64 flex flex-col relative">
                                            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0 absolute top-5 left-5 z-10">Vector Integrity</h3>
                                            <div className="flex-1 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={getPieData()}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={50}
                                                            outerRadius={80}
                                                            paddingAngle={5}
                                                            dataKey="value"
                                                        >
                                                            {getPieData().map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip 
                                                            contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '12px', fontSize: '12px' }}
                                                        />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                        
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Security Indicators Table Bottom Area (Hide if Invalid) */}
                        {!isInvalidState && result.checks && Object.keys(result.checks).length > 0 && (
                            <div className="glass p-6 rounded-3xl border border-white/10">
                                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6">Security Indicator Breakdown</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    
                                    <div className={cn("p-4 rounded-2xl border flex items-center justify-between transition-colors", result.checks.dns_resolved ? "bg-success-green/5 border-success-green/20" : "bg-alert-red/5 border-alert-red/20")}>
                                        <div>
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Network</p>
                                            <p className="text-sm font-bold text-white mt-1">DNS Resolution</p>
                                        </div>
                                        {result.checks.dns_resolved ? <Activity className="text-success-green" /> : <AlertTriangle className="text-alert-red" />}
                                    </div>

                                    <div className={cn("p-4 rounded-2xl border flex items-center justify-between transition-colors", result.checks.https_secure ? "bg-success-green/5 border-success-green/20" : "bg-orange-500/5 border-orange-500/20")}>
                                        <div>
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Transport Security</p>
                                            <p className="text-sm font-bold text-white mt-1">SSL Certificate</p>
                                        </div>
                                        {result.checks.https_secure ? <Key size={20} className="text-success-green" /> : <AlertTriangle size={20} className="text-orange-500" />}
                                    </div>

                                    <div className={cn("p-4 rounded-2xl border flex items-center justify-between transition-colors", (result.checks.domain_age_days !== undefined && result.checks.domain_age_days >= 30) || result.checks.domain_age_days === -1 ? "bg-success-green/5 border-success-green/20" : "bg-orange-500/5 border-orange-500/20")}>
                                        <div>
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Domain Trust</p>
                                            <p className="text-sm font-bold text-white mt-1">
                                                {result.checks.domain_age_days === -1 ? "IP / Unknown Age" : `Age: ${result.checks.domain_age_days} Days`}
                                            </p>
                                        </div>
                                        {result.checks.domain_age_days === -1 || (result.checks.domain_age_days !== undefined && result.checks.domain_age_days >= 30) ? <ShieldCheck className="text-success-green" /> : <AlertTriangle className="text-orange-500" />}
                                    </div>


                                    <div className={cn("p-4 rounded-2xl border flex items-center justify-between transition-colors", result.checks.google_safe_browsing ? "bg-success-green/5 border-success-green/20" : "bg-alert-red/5 border-alert-red/20")}>
                                        <div>
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Threat DB</p>
                                            <p className="text-sm font-bold text-white mt-1">Google API Check</p>
                                        </div>
                                        {result.checks.google_safe_browsing ? <ShieldCheck className="text-success-green" /> : <ShieldAlert className="text-alert-red" />}
                                    </div>

                                </div>
                            </div>
                        )}

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
