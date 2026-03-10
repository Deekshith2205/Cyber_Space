"use client";

import React, { useState } from "react";
import {
    ClipboardList,
    FileText,
    Upload,
    Send,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    ShieldAlert,
    Search,
    Copy
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const incidentTypes = [
    "Phishing Attack",
    "Unauthorized Access",
    "Malware Infection",
    "Data Leak",
    "Ransomware",
    "DDoS Attack",
    "Identity Theft",
    "Social Engineering"
];

export default function IncidentReportAssistant() {
    const [step, setStep] = useState(1);
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [reportId, setReportId] = useState("");

    const generateReportId = () => {
        const id = `CSR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        setReportId(id);
        setStep(4);
    };

    return (
        <div className="space-y-8 pt-6 max-w-4xl mx-auto">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-black text-white tracking-tight">Incident Report Assistant</h2>
                <p className="text-zinc-500 text-sm">Guided documentation for formal cybersecurity incident reporting.</p>
            </div>

            <div className="flex justify-between relative px-2 mb-12">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 -translate-y-1/2 z-0" />
                {[1, 2, 3, 4].map((s) => (
                    <div key={s} className="relative z-10 flex flex-col items-center gap-2">
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all border-2",
                            step === s ? "bg-alert-red border-alert-red text-white glow-red" :
                                step > s ? "bg-success-green border-success-green text-white" : "bg-[#0B0F14] border-white/10 text-zinc-500"
                        )}>
                            {step > s ? <CheckCircle2 size={18} /> : s}
                        </div>
                        <span className={cn(
                            "text-[8px] font-bold uppercase tracking-widest",
                            step === s ? "text-white" : "text-zinc-500"
                        )}>
                            {s === 1 ? "Type" : s === 2 ? "Detail" : s === 3 ? "Evidence" : "Finalize"}
                        </span>
                    </div>
                ))}
            </div>

            <div className="glass p-10 rounded-[2rem] border border-white/10 relative overflow-hidden min-h-[450px] flex flex-col">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6 flex-1"
                        >
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">Select Incident Type</h3>
                                <p className="text-zinc-500 text-xs">Choose the primary category that best describes the event.</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {incidentTypes.map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setType(t)}
                                        className={cn(
                                            "p-4 rounded-2xl border text-xs font-bold transition-all text-left group",
                                            type === t
                                                ? "bg-alert-red/10 border-alert-red text-alert-red"
                                                : "bg-white/5 border-white/5 text-zinc-400 hover:border-white/20 hover:text-white"
                                        )}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6 flex-1"
                        >
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">Describe the Incident</h3>
                                <p className="text-zinc-500 text-xs">Provide a detailed chronological timeline of what happened.</p>
                            </div>

                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Start typing the incident details here..."
                                className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-6 text-sm focus:outline-none focus:border-alert-red focus:ring-1 focus:ring-alert-red/30 transition-all resize-none"
                            />
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6 flex-1 flex flex-col items-center justify-center text-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 mb-4 border border-dashed border-white/20">
                                <Upload size={32} />
                            </div>
                            <div className="space-y-2 max-w-md">
                                <h3 className="text-xl font-bold text-white">Upload Evidence</h3>
                                <p className="text-zinc-500 text-xs">Attach screenshots, logs, or any malicious files (max 10MB per file).</p>
                            </div>
                            <button className="mt-4 px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-all">
                                Select Files to Upload
                            </button>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8 flex-1 flex flex-col items-center justify-center text-center"
                        >
                            <div className="w-24 h-24 rounded-full bg-success-green/20 flex items-center justify-center text-success-green shadow-[0_0_30px_rgba(0,255,156,0.2)]">
                                <CheckCircle2 size={48} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-white">Report Generated</h3>
                                <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Secure Case Reference Number</p>
                                <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl mt-4">
                                    <span className="font-mono text-cyber-blue font-bold">{reportId}</span>
                                    <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>
                            <button className="px-10 py-4 bg-cyber-blue text-[#0B0F14] font-black rounded-2xl shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:scale-105 transition-all">
                                Download PDF Report
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-auto pt-8 flex items-center justify-between">
                    <button
                        onClick={() => setStep(s => Math.max(1, s - 1))}
                        disabled={step === 1 || step === 4}
                        className={cn(
                            "flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition-all",
                            step === 1 || step === 4 ? "opacity-0 pointer-events-none" : "text-zinc-500 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <ChevronLeft size={16} /> Back
                    </button>

                    {step < 3 ? (
                        <button
                            onClick={() => setStep(s => s + 1)}
                            disabled={step === 1 && !type}
                            className={cn(
                                "flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl transition-all",
                                step === 1 && !type ? "opacity-30 cursor-not-allowed" : "bg-white/5 border border-white/10 text-white hover:border-cyber-blue hover:text-cyber-blue"
                            )}
                        >
                            Next Step <ChevronRight size={16} />
                        </button>
                    ) : step === 3 ? (
                        <button
                            onClick={generateReportId}
                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-10 py-4 rounded-2xl bg-alert-red text-white glow-red shadow-[0_0_20px_rgba(255,76,76,0.4)] hover:scale-105 transition-all"
                        >
                            Submit & Generate <Send size={16} />
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
