/* eslint-disable @typescript-eslint/no-explicit-any */
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
            const response = await fetch("/api/phishing/check", {
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
        <div className="space-y-12 pt-20 pb-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                    <Link2 className="text-cyber-blue" />
                    Advanced Phishing Link Checker
                </h2>
                <p className="text-text-secondary text-sm font-medium">Real-time threat intelligence and multi-vector AI risk scoring.</p>
            </div>

            <div className="glass p-8 rounded-3xl border border-border relative overflow-hidden shadow-premium">
                <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-blue/10 border border-cyber-blue/20 text-[10px] text-cyber-blue font-black uppercase tracking-widest shadow-sm">
                        <Activity size={12} /> Deep Packet Inspection
                    </div>
                    <h3 className="text-xl font-black text-foreground transition-colors">Target URL for Analysis</h3>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1 group">
                            <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-cyber-blue transition-colors" size={20} />
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://suspicious-website.com/login"
                                className="w-full bg-foreground/5 border border-border rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-cyber-blue focus:ring-2 focus:ring-cyber-blue/20 transition-all text-sm font-mono text-foreground placeholder-text-muted/50"
                            />
                        </div>
                        <button
                            onClick={checkLink}
                            disabled={isChecking || !url}
                            className={cn(
                                "px-8 py-4 sm:py-0 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 border border-transparent whitespace-nowrap",
                                isChecking
                                    ? "bg-foreground/5 text-text-muted cursor-not-allowed"
                                    : "bg-cyber-blue/20 text-cyber-blue border-cyber-blue/50 hover:bg-cyber-blue hover:text-white hover:scale-105 active:scale-95 shadow-lg shadow-cyber-blue/10 hover:shadow-cyber-blue/30"
                            )}
                        >
                            {isChecking ? "Scanning..." : "Initiate Scan"}
                        </button>
                    </div>
                    {error && (
                        <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-alert-red text-xs font-black mt-2 bg-alert-red/5 border border-alert-red/20 py-3 rounded-xl"
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
                            <div className="w-16 h-16 border-4 border-cyber-blue/20 border-t-cyber-blue rounded-full animate-spin shadow-lg shadow-cyber-blue/20" />
                            <p className="text-xs font-black text-cyber-blue uppercase tracking-[0.2em] animate-pulse">Running heuristic algorithms...</p>
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
                        className="space-y-8"
                    >
                        {/* Title and Top Level Info */}
                        <div className="flex items-center justify-between">
                             <h2 className="text-xl font-black text-foreground flex items-center gap-2 tracking-tight">
                                <Activity className="text-cyber-blue" />
                                Threat Intelligence Report
                             </h2>
                             <span className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-black font-mono">
                                 {new Date().toLocaleString()}
                             </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            {/* Main Risk Gauge Card (Left) */}
                            <div className="glass p-8 rounded-3xl border border-border flex flex-col items-center relative overflow-hidden group shadow-premium">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 dark:to-black/50 z-0 pointer-events-none" />
                                <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center">
                                    <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-8 w-full text-left">Overall Risk Score</h3>
                                    
                                    <div className="relative w-48 h-48 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl">
                                            {/* Background Track */}
                                            <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="14" fill="transparent" className="text-foreground/5" />
                                            {/* Animated Progress */}
                                            <motion.circle
                                                cx="96" cy="96" r="80" stroke={getRiskColor(result.risk_score, result.status)} strokeWidth="14" fill="transparent"
                                                strokeDasharray={502}
                                                strokeLinecap="round"
                                                initial={{ strokeDashoffset: 502 }}
                                                animate={{ strokeDashoffset: 502 - (502 * (isInvalidState ? 0 : result.risk_score) / 100) }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <motion.span 
                                                className="text-6xl font-black text-glow-metric"
                                                style={{ color: getRiskColor(result.risk_score, result.status) }}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.5, type: 'spring' }}
                                            >
                                                {isInvalidState ? "N/A" : result.risk_score}
                                            </motion.span>
                                            {!isInvalidState && <span className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-2">out of 100</span>}
                                        </div>
                                    </div>

                                    <div className="mt-10 text-center bg-panel-secondary/60 px-8 py-4 rounded-2xl border border-border backdrop-blur-xl shadow-premium">
                                        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1.5">Threat Status</p>
                                        <div className="flex items-center justify-center gap-3">
                                            {result.status.includes("INVALID") ? (
                                                <HelpCircle size={20} className="text-text-muted" />
                                            ) : result.status === "Safe" ? (
                                                <ShieldCheck size={20} className="text-success-green" />
                                            ) : result.status === "Suspicious" ? (
                                                <AlertTriangle size={20} className="text-yellow-500" />
                                            ) : result.status === "High Risk" ? (
                                                <AlertTriangle size={20} className="text-orange-500" />
                                            ) : (
                                                <ShieldAlert size={20} className="text-alert-red" />
                                            )}
                                            <span className="font-black tracking-[0.1em] text-xl" style={{ color: getRiskColor(result.risk_score, result.status) }}>
                                                {isInvalidState ? "UNKNOWN" : result.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Charts & Details Data (Middle & Right) */}
                            <div className="lg:col-span-2 space-y-8">
                                
                                {/* Target info row */}
                                <div className="glass p-8 rounded-3xl border border-border relative overflow-hidden shadow-premium">
                                    <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-3">Analyzed Asset</p>
                                    <p className="text-sm font-bold text-foreground break-all font-mono bg-foreground/5 p-3 rounded-xl border border-border/10 tracking-tight">{result.url}</p>
                                    
                                    {/* Penalty Reasons Container */}
                                    {result.reason && (
                                        <div className="mt-6 pt-6 border-t border-border">
                                            <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-4">Intelligence Findings</p>
                                            
                                            {Array.isArray(result.reason) ? (
                                                <ul className="space-y-3">
                                                    {result.reason.map((r, i) => (
                                                        <li key={i} className="flex items-start gap-3 text-xs font-black text-orange-500/90 leading-relaxed">
                                                            <FileWarning size={16} className="shrink-0 mt-0.5 text-orange-500" />
                                                            {r}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="flex items-center gap-3 text-xs font-black text-text-muted">
                                                    <Info size={16} className="text-cyber-blue" />
                                                    {result.reason}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Charts Grid (Only render if NOT invalid) */}
                                {!isInvalidState && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        
                                        {/* Bar Chart: Threat Vectors */}
                                        <div className="glass p-6 rounded-3xl border border-border h-72 flex flex-col shadow-premium">
                                            <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-6">Risk Attribution</h3>
                                            <div className="flex-1 w-full relative">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={getBarData()} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                                        <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
                                                        <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
                                                        <Tooltip 
                                                            cursor={{ fill: 'var(--foreground)', opacity: 0.05 }}
                                                            contentStyle={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '16px', fontSize: '12px', fontWeight: 900, color: 'var(--foreground)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                                            itemStyle={{ color: 'var(--foreground)' }}
                                                        />
                                                        <Bar dataKey="penalty" radius={[6, 6, 0, 0]} barSize={30}>
                                                            {getBarData().map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={entry.penalty > 0 ? '#ef4444' : '#22c55e'} />
                                                            ))}
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        {/* Security Breakdown Pie */}
                                        <div className="glass p-6 rounded-3xl border border-border h-72 flex flex-col relative shadow-premium">
                                            <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-0 absolute top-7 left-7 z-10">Integrity Matrix</h3>
                                            <div className="flex-1 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={getPieData()}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={55}
                                                            outerRadius={85}
                                                            paddingAngle={8}
                                                            dataKey="value"
                                                            stroke="none"
                                                        >
                                                            {getPieData().map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip 
                                                            contentStyle={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '16px', fontSize: '12px', fontWeight: 900, color: 'var(--foreground)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                                            itemStyle={{ color: 'var(--foreground)' }}
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
                            <div className="glass p-8 rounded-3xl border border-border shadow-premium">
                                <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-8">Security Vector Breakdown</h3>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    
                                    <div className={cn("p-6 rounded-2xl border flex items-center justify-between transition-all shadow-premium group", result.checks.dns_resolved ? "bg-success-green/5 border-success-green/20" : "bg-alert-red/5 border-alert-red/20")}>
                                        <div>
                                            <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Network</p>
                                            <p className="text-sm font-black text-foreground mt-1.5 tracking-tight">DNS Resolution</p>
                                        </div>
                                        {result.checks.dns_resolved ? <Activity className="text-success-green group-hover:scale-110 transition-transform" /> : <AlertTriangle className="text-alert-red group-hover:scale-110 transition-transform" />}
                                    </div>

                                    <div className={cn("p-6 rounded-2xl border flex items-center justify-between transition-all shadow-premium group", result.checks.https_secure ? "bg-success-green/5 border-success-green/20" : "bg-orange-500/5 border-orange-500/20")}>
                                        <div>
                                            <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Encryption</p>
                                            <p className="text-sm font-black text-foreground mt-1.5 tracking-tight">SSL Certificate</p>
                                        </div>
                                        {result.checks.https_secure ? <Key size={20} className="text-success-green group-hover:scale-110 transition-transform" /> : <AlertTriangle size={20} className="text-orange-500 group-hover:scale-110 transition-transform" />}
                                    </div>

                                    <div className={cn("p-6 rounded-2xl border flex items-center justify-between transition-all shadow-premium group", (result.checks.domain_age_days !== undefined && result.checks.domain_age_days >= 30) || result.checks.domain_age_days === -1 ? "bg-success-green/5 border-success-green/20" : "bg-orange-500/5 border-orange-500/20")}>
                                        <div>
                                            <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Authority</p>
                                            <p className="text-sm font-black text-foreground mt-1.5 tracking-tight">
                                                {result.checks.domain_age_days === -1 ? "IP / Unknown Age" : `Age: ${result.checks.domain_age_days} Days`}
                                            </p>
                                        </div>
                                        {result.checks.domain_age_days === -1 || (result.checks.domain_age_days !== undefined && result.checks.domain_age_days >= 30) ? <ShieldCheck className="text-success-green group-hover:scale-110 transition-transform" /> : <AlertTriangle className="text-orange-500 group-hover:scale-110 transition-transform" />}
                                    </div>


                                    <div className={cn("p-6 rounded-2xl border flex items-center justify-between transition-all shadow-premium group", result.checks.google_safe_browsing ? "bg-success-green/5 border-success-green/20" : "bg-alert-red/5 border-alert-red/20")}>
                                        <div>
                                            <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Threat Intel</p>
                                            <p className="text-sm font-black text-foreground mt-1.5 tracking-tight">Google API</p>
                                        </div>
                                        {result.checks.google_safe_browsing ? <ShieldCheck className="text-success-green group-hover:scale-110 transition-transform" /> : <ShieldAlert className="text-alert-red group-hover:scale-110 transition-transform" />}
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
