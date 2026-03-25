"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck, Lock, Activity, CheckCircle2,
    Instagram, Facebook, Mail, MessageCircle, AlertTriangle, ChevronDown, ChevronRight, CheckSquare, Square
} from "lucide-react";
import { cn } from "@/lib/utils";

// Platforms supported
const PLATFORMS = [
    { id: "instagram", name: "Instagram", icon: Instagram, color: "hover:border-pink-500 hover:text-pink-400 group-data-[state=active]:border-pink-500 group-data-[state=active]:bg-pink-500/10 group-data-[state=active]:text-pink-400" },
    { id: "gmail", name: "Gmail", icon: Mail, color: "hover:border-red-500 hover:text-red-400 group-data-[state=active]:border-red-500 group-data-[state=active]:bg-red-500/10 group-data-[state=active]:text-red-400" },
    { id: "facebook", name: "Facebook", icon: Facebook, color: "hover:border-blue-500 hover:text-blue-400 group-data-[state=active]:border-blue-500 group-data-[state=active]:bg-blue-500/10 group-data-[state=active]:text-blue-400" },
    { id: "whatsapp", name: "WhatsApp", icon: MessageCircle, color: "hover:border-emerald-500 hover:text-emerald-400 group-data-[state=active]:border-emerald-500 group-data-[state=active]:bg-emerald-500/10 group-data-[state=active]:text-emerald-400" }
];

export default function AccountRecoveryPage() {
    // Form State
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
    const [description, setDescription] = useState("");
    const [hasAccess, setHasAccess] = useState<boolean>(false);
    
    // UI State
    const [isProcessing, setIsProcessing] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [expandedStep, setExpandedStep] = useState<number | null>(0);
    const [checklist, setChecklist] = useState<Record<string, boolean>>({});

    const handleStartRecovery = () => {
        if (!selectedPlatform) return;
        setIsProcessing(true);
        // Simulate network / AI delay
        setTimeout(() => {
            setIsProcessing(false);
            setShowResults(true);
        }, 2000);
    };

    const toggleChecklist = (id: string) => {
        setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const resetFlow = () => {
        setShowResults(false);
        setSelectedPlatform(null);
        setDescription("");
        setChecklist({});
        setExpandedStep(0);
    };

    // Simulated Steps based on platform and access
    const MOCK_STEPS = [
        {
            title: "Immediately Lock Active Sessions",
            desc: "The attacker might still be logged into your account. Force a global sign-out to kick them out before they make further changes.",
            actionText: "Go to Settings > Security > Login Activity and tap 'Log Out of All Devices'."
        },
        {
            title: "Initiate Official Recovery Flow",
            desc: "If your password was changed, you must use the platform's official identity verification process to prove ownership.",
            actionText: "Submit a video selfie or ID verification through the app's 'Need more help?' link on the login screen."
        },
        {
            title: "Reverse Contact Info Changes",
            desc: "Hackers often change your recovery email/phone number. You have 24 hours to reverse this via the original email sent to your inbox.",
            actionText: "Check your original email for an alert saying 'Email changed' and click 'Revert this change'."
        }
    ];

    const renderHeader = () => (
        <div className="text-center mb-12 space-y-4 pt-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase tracking-widest mb-2 shadow-sm">
                <ShieldCheck size={14} className="text-emerald-400" /> Secure Recovery Channel
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mx-auto max-w-3xl">
                Recover Your Account
            </h1>
            <p className="text-base text-slate-400 font-medium max-w-xl mx-auto">
                Don't panic. Follow strictly verified steps to regain access to your compromised account securely.
            </p>
        </div>
    );

    const renderInputSection = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto w-full space-y-8">
            {/* Platform Selector */}
            <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">1. Select Platform</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {PLATFORMS.map(p => (
                        <button
                            key={p.id}
                            data-state={selectedPlatform === p.id ? "active" : "inactive"}
                            onClick={() => setSelectedPlatform(p.id)}
                            className={cn(
                                "group flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300",
                                "bg-panel border-white/5 text-slate-400 shadow-sm",
                                p.color
                            )}
                        >
                            <p.icon size={28} className="mb-2 transition-transform group-hover:scale-110" />
                            <span className="text-xs font-bold tracking-wide">{p.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Access Toggle */}
            <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">2. Current Access Level</label>
                <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5">
                    <button 
                        onClick={() => setHasAccess(true)}
                        className={cn("flex-1 py-3 text-sm font-bold rounded-xl transition-colors", hasAccess ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-slate-500 hover:text-slate-300")}
                    >
                        I still have access
                    </button>
                    <button 
                        onClick={() => setHasAccess(false)}
                        className={cn("flex-1 py-3 text-sm font-bold rounded-xl transition-colors", !hasAccess ? "bg-red-500/20 text-red-400 border border-red-500/30" : "text-slate-500 hover:text-slate-300")}
                    >
                        I lost access
                    </button>
                </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">3. Briefly Describe What Happened</label>
                <textarea 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="e.g., I received a weird email and now my password doesn't work..."
                    className="w-full h-32 bg-panel/60 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none placeholder:text-slate-600 shadow-inner"
                />
            </div>

            <button
                onClick={handleStartRecovery}
                disabled={!selectedPlatform || isProcessing}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black uppercase tracking-widest text-sm hover:from-blue-500 hover:to-cyan-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3"
            >
                {isProcessing ? (
                    <><Activity className="animate-pulse" size={18} /> Generating Recovery Plan...</>
                ) : (
                    <><Lock size={18} /> Start Safe Recovery</>
                )}
            </button>
        </motion.div>
    );

    const renderResultSection = () => {
        const platformObj = PLATFORMS.find(p => p.id === selectedPlatform);

        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto w-full space-y-8 pb-20">
                
                {/* Result Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-panel border border-white/5 shadow-depth">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            {platformObj && <platformObj.icon size={24} className="text-slate-300" />}
                            <h2 className="text-2xl font-black text-white">{platformObj?.name} Recovery Plan</h2>
                        </div>
                        <p className="text-sm text-slate-400">Generated tailored steps based on your access level.</p>
                    </div>
                    {/* Simplified Risk Badge */}
                    <div className="flex items-center gap-3 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                        <AlertTriangle size={20} />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 leading-none">Status</p>
                            <p className="font-bold text-sm leading-none mt-1">CRITICAL</p>
                        </div>
                    </div>
                </div>

                {/* Main Stepper Timeline */}
                <div className="space-y-6">
                    <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest pl-2">Guided Recovery Steps</h3>
                    
                    <div className="relative pl-4 space-y-6">
                        {/* Vertical line connecting steps */}
                        <div className="absolute left-[33px] top-6 bottom-6 w-0.5 bg-white/5" />

                        {MOCK_STEPS.map((step, idx) => {
                            const isExpanded = expandedStep === idx;
                            const isCompleted = checklist[`step_${idx}`];

                            return (
                                <motion.div 
                                    key={idx}
                                    layout
                                    className={cn(
                                        "relative flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border transition-colors shadow-sm",
                                        isExpanded ? "bg-panel/80 border-blue-500/30" : "bg-panel/40 border-white/5 hover:border-white/10"
                                    )}
                                >
                                    {/* Step indicator circle */}
                                    <button 
                                        onClick={() => toggleChecklist(`step_${idx}`)}
                                        className={cn(
                                            "relative z-10 w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-black transition-all border-2",
                                            isCompleted ? "bg-emerald-500 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]" :
                                            isExpanded ? "bg-blue-600 border-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "bg-black border-slate-700 text-slate-400"
                                        )}
                                    >
                                        {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                                    </button>

                                    <div className="flex-1 cursor-pointer" onClick={() => setExpandedStep(isExpanded ? null : idx)}>
                                        <div className="flex items-center justify-between">
                                            <h4 className={cn("font-bold text-lg transition-colors", isExpanded ? "text-blue-400" : "text-white")}>
                                                {step.title}
                                            </h4>
                                            {isExpanded ? <ChevronDown size={18} className="text-slate-500" /> : <ChevronRight size={18} className="text-slate-500" />}
                                        </div>

                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div 
                                                    initial={{ height: 0, opacity: 0 }} 
                                                    animate={{ height: "auto", opacity: 1 }} 
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pt-4 space-y-4">
                                                        <p className="text-sm text-slate-300 leading-relaxed">{step.desc}</p>
                                                        
                                                        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                                            <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2">Action Required</p>
                                                            <p className="text-sm text-blue-100 font-medium">{step.actionText}</p>
                                                        </div>

                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); toggleChecklist(`step_${idx}`); setExpandedStep(idx + 1); }}
                                                            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-widest rounded-lg transition-colors"
                                                        >
                                                            Mark as Done & Continue
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
                    {/* Secure Next Checklist */}
                    <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl">
                        <h4 className="flex items-center gap-2 text-sm font-black text-emerald-400 uppercase tracking-widest mb-4">
                            <ShieldCheck size={18} /> Secure Next
                        </h4>
                        <div className="space-y-3">
                            {[
                                { id: "2fa", label: "Enable Two-Factor Authentication" },
                                { id: "devices", label: "Remove Unknown Logged Devices" },
                                { id: "pass", label: "Update Password Manager" }
                            ].map((item) => (
                                <button key={item.id} onClick={() => toggleChecklist(item.id)} className="flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors text-left w-full group">
                                    <div className="text-emerald-500/50 group-hover:text-emerald-400 transition-colors">
                                        {checklist[item.id] ? <CheckSquare size={18} className="text-emerald-400" /> : <Square size={18} />}
                                    </div>
                                    <span className={cn("transition-colors", checklist[item.id] && "text-slate-500 line-through")}>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Official Links */}
                    <div className="p-6 bg-slate-800/20 border border-white/5 rounded-3xl">
                        <h4 className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest mb-4">
                            <Activity size={18} /> Official Resources
                        </h4>
                        <div className="space-y-3">
                            <a href="#" className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 hover:underline">
                                <CheckCircle2 size={14} className="text-emerald-400" /> Official {platformObj?.name} Help Center
                            </a>
                            <a href="#" className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 hover:underline">
                                <CheckCircle2 size={14} className="text-emerald-400" /> Direct Identity Verification Link
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 text-center">
                    <button onClick={resetFlow} className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                        Restart Recovery Assessor
                    </button>
                </div>

            </motion.div>
        );
    };

    return (
        <div className="min-h-screen relative font-sans">
            {/* Top Navigation */}
            <nav className="w-full p-6 flex justify-between items-center relative z-20 max-w-7xl mx-auto">
                <div className="flex items-center">
                    <img 
                        src="/cyberspacelogo.jpeg" 
                        alt="Cyberspace Logo" 
                        className="h-10 w-auto object-contain" 
                    />
                </div>
                <button onClick={() => window.location.href = '/dashboard'} className="btn-secondary px-5 py-2.5 rounded-full font-bold text-xs tracking-widest uppercase">
                    Back to Dashboard
                </button>
            </nav>

            <AnimatePresence mode="wait">
                {!showResults ? (
                    <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-4 pb-20">
                        {renderHeader()}
                        {renderInputSection()}
                    </motion.div>
                ) : (
                    <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-4 pt-4">
                        {renderResultSection()}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
