"use client";

import React, { useState, useRef } from "react";
import {
    BrainCircuit,
    Cpu,
    ShieldAlert,
    AlertTriangle,
    CheckCircle2,
    Calendar,
    Globe,
    FileText,
    UploadCloud,
    Link as LinkIcon,
    Download,
    Send,
    ChevronRight,
    ChevronLeft,
    Loader2,
    X,
    FileSearch,
    Fingerprint
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function IncidentReportAssistant() {
    const [step, setStep] = useState(1);
    
    // --- Step 1 State ---
    const [aiInput, setAiInput] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiResult, setAiResult] = useState<{ type: string; risk: string; confidence: number; extractedDesc: string } | null>(null);

    // --- Step 2 State ---
    const [details, setDetails] = useState({
        type: "",
        description: "",
        platform: "Corporate Email",
        dateTime: new Date().toISOString().slice(0, 16)
    });

    // --- Step 3 State ---
    const [evidenceFiles, setEvidenceFiles] = useState<{name: string, size: number}[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [suspiciousLink, setSuspiciousLink] = useState("");
    const [savedLinks, setSavedLinks] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    // --- Step 4 State ---
    const [reportId, setReportId] = useState("");

    const handleAnalysis = () => {
        if (!aiInput.trim()) return;
        setIsAnalyzing(true);
        // Simulate AI Processing
        setTimeout(() => {
            const inputLower = aiInput.toLowerCase();
            let riskLevel = "Medium";
            let detectedType = "Suspicious Activity";

            if (inputLower.includes("password") || inputLower.includes("credential") || inputLower.includes("bank")) {
                riskLevel = "Critical";
                detectedType = "Phishing / Credential Theft";
            } else if (inputLower.includes("slow") || inputLower.includes("ddos")) {
                riskLevel = "High";
                detectedType = "Denial of Service (DDoS)";
            } else if (inputLower.includes("virus") || inputLower.includes("ransomware")) {
                riskLevel = "Critical";
                detectedType = "Malware Infection";
            }

            const result = {
                type: detectedType,
                risk: riskLevel,
                confidence: Math.floor(Math.random() * 8 + 92), // 92-99%
                extractedDesc: aiInput
            };
            
            setAiResult(result);
            setDetails(prev => ({
                ...prev,
                type: result.type,
                description: `[AI SUMMARY] The user reported the following incident: "${result.extractedDesc}". \n\n[RECOMMENDATION] This aligns with known vectors for ${result.type.toLowerCase()}. Immediate containment measures are suggested.`
            }));
            setIsAnalyzing(false);
        }, 2000);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files).map(f => ({ name: f.name, size: f.size }));
            setEvidenceFiles(prev => [...prev, ...newFiles]);
        }
    };

    const handleAddLink = () => {
        if (suspiciousLink.trim()) {
            setSavedLinks(prev => [...prev, suspiciousLink]);
            setSuspiciousLink("");
        }
    };

    const generateReportId = () => {
        const id = `INC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        setReportId(id);
    };

    const handleNext = () => {
        if (step === 3 && !reportId) {
            generateReportId();
        }
        setStep(s => Math.min(4, s + 1));
    };

    const getRiskColor = (risk: string) => {
        switch(risk) {
            case "Critical": return "text-red-500 border-red-500/30 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.3)]";
            case "High": return "text-orange-500 border-orange-500/30 bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.3)]";
            case "Medium": return "text-yellow-500 border-yellow-500/30 bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.3)]";
            default: return "text-green-500 border-green-500/30 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.3)]";
        }
    };

    const getRiskDot = (risk: string) => {
        switch(risk) {
            case "Critical": return "bg-red-500";
            case "High": return "bg-orange-500";
            case "Medium": return "bg-yellow-500";
            default: return "bg-green-500";
        }
    };

    const STEPS = [
        { num: 1, label: "AI Detection", icon: <BrainCircuit size={16} /> },
        { num: 2, label: "Smart Details", icon: <FileText size={16} /> },
        { num: 3, label: "Evidence", icon: <UploadCloud size={16} /> },
        { num: 4, label: "Report", icon: <ShieldAlert size={16} /> }
    ];

    return (
        <div className="space-y-8 pt-6 max-w-5xl mx-auto pb-12">
            
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2 relative">
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-cyan-400 rounded-r-md shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
                    <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        Incident Report Assistant
                        <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1 uppercase tracking-widest">
                            <Cpu size={12} /> AI-Powered
                        </div>
                    </h2>
                    <p className="text-zinc-400 text-sm">Intelligent real-time threat analysis and automated cybersecurity incident generation.</p>
                </div>
            </div>

            {/* Futuristic Stepper */}
            <div className="relative mb-12 mt-6">
                <div className="absolute top-1/2 left-4 right-4 h-[2px] bg-zinc-800 -translate-y-1/2 z-0" />
                <div className="flex justify-between relative z-10">
                    {STEPS.map((s, idx) => {
                        const isActive = step === s.num;
                        const isPast = step > s.num;
                        return (
                            <div key={s.num} className="flex flex-col items-center gap-3 relative group">
                                {/* Flow line active state */}
                                {idx !== 0 && (
                                    <div className={cn(
                                        "absolute top-1/2 right-full w-full h-[2px] -translate-y-1/2 origin-left transition-all duration-700 ease-in-out",
                                        isPast || isActive ? "bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)] scale-x-100" : "scale-x-0"
                                    )} style={{ width: "calc(100vw - 200px)" /* Arbitrary hack for line fill, using standard div overlay is safer */}} />
                                )}

                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-500 border-2 backdrop-blur-md relative",
                                    isActive ? "bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)] scale-110" :
                                    isPast ? "bg-zinc-800 border-zinc-700 text-white" : "bg-zinc-900/50 border-zinc-800 text-zinc-600"
                                )}>
                                    {isPast ? <CheckCircle2 size={20} className="text-cyan-400" /> : s.icon}
                                </div>
                                <span className={cn(
                                    "text-xs font-bold uppercase tracking-widest transition-colors duration-300",
                                    isActive ? "text-cyan-400" : isPast ? "text-zinc-300" : "text-zinc-600"
                                )}>
                                    {s.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-1 rounded-3xl relative shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden min-h-[500px] flex flex-col">
                {/* Decorative background gradients */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[100px] rounded-full point-events-none" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[100px] rounded-full point-events-none" />

                <div className="p-8 md:p-12 flex-1 relative z-10 flex flex-col">
                    <AnimatePresence mode="wait">
                        
                        {/* ------------------------------------------------------------------------- */}
                        {/* STEP 1: AI DETECTION */}
                        {/* ------------------------------------------------------------------------- */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8 flex-1 flex flex-col"
                            >
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                        <FileSearch className="text-cyan-400" /> Describe the Incident
                                    </h3>
                                    <p className="text-zinc-400 text-sm">Our AI will analyze your description to automatically detect the threat type, risk level, and extract key details for the report.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="relative group">
                                        <textarea
                                            value={aiInput}
                                            onChange={(e) => setAiInput(e.target.value)}
                                            placeholder="E.g., I received an email from 'admin@paypaI-security.com' asking me to reset my password using a linked button..."
                                            className="w-full h-36 bg-black/50 border border-zinc-800 rounded-2xl p-6 text-zinc-300 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none font-mono text-sm leading-relaxed"
                                        />
                                        <div className="absolute bottom-4 right-4">
                                            <button 
                                                onClick={handleAnalysis}
                                                disabled={!aiInput.trim() || isAnalyzing}
                                                className="bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-xs px-6 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                {isAnalyzing ? <><Loader2 size={16} className="animate-spin" /> Analyzing...</> : "Run AI Analysis"}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* AI Output Card */}
                                <AnimatePresence>
                                    {aiResult && !isAnalyzing && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="mt-6 border border-zinc-800 bg-zinc-900/40 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center"
                                        >
                                            <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 flex-shrink-0">
                                                <BrainCircuit size={32} className="text-cyan-400" />
                                            </div>
                                            <div className="flex-1 space-y-4 w-full">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-1">Detected Type</p>
                                                        <h4 className="text-white text-xl font-bold">{aiResult.type}</h4>
                                                    </div>
                                                    <div className={cn("px-4 py-2 rounded-lg border text-sm font-bold flex items-center gap-2", getRiskColor(aiResult.risk))}>
                                                        <div className={cn("w-2 h-2 rounded-full", getRiskDot(aiResult.risk))} />
                                                        {aiResult.risk} Risk
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm bg-black/40 border border-zinc-800 rounded-lg p-3">
                                                    <div className="flex items-center gap-2 text-zinc-300">
                                                        <Fingerprint size={16} className="text-cyan-500" /> Confidence Score:
                                                    </div>
                                                    <div className="flex-1 max-w-[200px] h-2 bg-zinc-800 rounded-full overflow-hidden">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${aiResult.confidence}%` }}
                                                            transition={{ duration: 1, ease: "easeOut" }}
                                                            className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" 
                                                        />
                                                    </div>
                                                    <span className="text-cyan-400 font-black">{aiResult.confidence}%</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                            </motion.div>
                        )}


                        {/* ------------------------------------------------------------------------- */}
                        {/* STEP 2: SMART DETAILS */}
                        {/* ------------------------------------------------------------------------- */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8 flex-1 flex flex-col"
                            >
                                <div className="space-y-3 flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                            <FileText className="text-cyan-400" /> Verify AI Details
                                        </h3>
                                        <p className="text-zinc-400 text-sm">Review and edit the fields automatically categorized and extracted by our AI engine.</p>
                                    </div>
                                    <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold rounded flex items-center gap-2 uppercase tracking-wide">
                                        <BrainCircuit size={14} /> Auto-filled by AI
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Incident Type</label>
                                        <div className="relative">
                                            <input 
                                                value={details.type}
                                                onChange={e => setDetails({...details, type: e.target.value})}
                                                className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 outline-none transition-colors"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-500/50 animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Target Platform / Asset</label>
                                        <div className="relative">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                            <input 
                                                value={details.platform}
                                                onChange={e => setDetails({...details, platform: e.target.value})}
                                                className="w-full bg-black/40 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white focus:border-cyan-500/50 outline-none transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Incident Description & AI Summary</label>
                                    <textarea
                                        value={details.description}
                                        onChange={e => setDetails({...details, description: e.target.value})}
                                        className="w-full h-40 bg-black/40 border border-zinc-800 rounded-xl px-4 py-4 text-zinc-300 focus:border-cyan-500/50 outline-none transition-colors resize-none text-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Occurred On</label>
                                    <div className="relative max-w-sm">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                        <input 
                                            type="datetime-local"
                                            value={details.dateTime}
                                            onChange={e => setDetails({...details, dateTime: e.target.value})}
                                            className="w-full bg-black/40 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white focus:border-cyan-500/50 outline-none transition-colors"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}


                        {/* ------------------------------------------------------------------------- */}
                        {/* STEP 3: EVIDENCE UPLOAD */}
                        {/* ------------------------------------------------------------------------- */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8 flex-1 flex flex-col"
                            >
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                        <UploadCloud className="text-cyan-400" /> Upload Evidence
                                    </h3>
                                    <p className="text-zinc-400 text-sm">Attach malicious files, phishing emails (.eml), or screenshots for the forensic team.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Upload Dropzone */}
                                    <div 
                                        className={cn(
                                            "border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-10 transition-all cursor-pointer min-h-[200px]",
                                            isDragging ? "border-cyan-400 bg-cyan-900/20" : "border-zinc-700 hover:border-zinc-500 bg-black/20"
                                        )}
                                        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={e => {
                                            e.preventDefault();
                                            setIsDragging(false);
                                            if (e.dataTransfer.files?.length > 0) {
                                                const newFiles = Array.from(e.dataTransfer.files).map(f => ({ name: f.name, size: f.size }));
                                                setEvidenceFiles(prev => [...prev, ...newFiles]);
                                            }
                                        }}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                                        <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4 text-zinc-400 shadow-inner group-hover:text-white transition-colors">
                                            <UploadCloud size={28} />
                                        </div>
                                        <p className="text-white font-bold mb-1">Click to upload or drag & drop</p>
                                        <p className="text-zinc-500 text-xs">JPEG, PNG, PDF, EML up to 50MB</p>
                                    </div>

                                    {/* Links & Previews */}
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Add Suspicious URLs</label>
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                                                    <input 
                                                        value={suspiciousLink}
                                                        onChange={e => setSuspiciousLink(e.target.value)}
                                                        placeholder="http://malicious-site.com"
                                                        className="w-full bg-black/40 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:border-cyan-500/50 outline-none"
                                                    />
                                                </div>
                                                <button 
                                                    onClick={handleAddLink} 
                                                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-colors"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Attached Evidence</label>
                                            <div className="max-h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                                {evidenceFiles.length === 0 && savedLinks.length === 0 && (
                                                    <p className="text-xs text-zinc-600 italic">No evidence uploaded yet.</p>
                                                )}
                                                
                                                {evidenceFiles.map((file, i) => (
                                                    <div key={i} className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-sm">
                                                        <div className="flex items-center gap-3 overflow-hidden">
                                                            <FileText size={14} className="text-zinc-400 flex-shrink-0" />
                                                            <span className="text-zinc-300 truncate text-xs">{file.name}</span>
                                                        </div>
                                                        <span className="text-zinc-500 text-[10px]">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                    </div>
                                                ))}

                                                {savedLinks.map((link, i) => (
                                                    <div key={`link-${i}`} className="flex items-center gap-3 p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-sm">
                                                        <AlertTriangle size={14} className="text-yellow-500 shrink-0" />
                                                        <span className="text-zinc-300 truncate text-xs font-mono">{link}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}


                        {/* ------------------------------------------------------------------------- */}
                        {/* STEP 4: REPORT PREVIEW */}
                        {/* ------------------------------------------------------------------------- */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8 flex-1 flex flex-col"
                            >
                                <div className="text-center space-y-2 mb-4">
                                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                                        <CheckCircle2 size={40} className="text-green-500" />
                                    </div>
                                    <h3 className="text-3xl font-black text-white">Report Compiled</h3>
                                    <p className="text-zinc-400 text-sm max-w-md mx-auto">The incident has been documented successfully and securely encrypted in the database.</p>
                                </div>

                                <div className="bg-black/60 border border-zinc-800 rounded-2xl p-8 max-w-3xl mx-auto w-full space-y-6">
                                    <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                                        <div>
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Case Reference</p>
                                            <p className="font-mono text-cyan-400 text-xl font-bold">{reportId}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Date Logged</p>
                                            <p className="text-zinc-300 text-sm">{details.dateTime.replace("T", " ")}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 pt-2">
                                        <div>
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Incident Type</p>
                                            <p className="text-white font-bold">{details.type || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Assessed Risk</p>
                                            <div className="inline-block">
                                                <span className={cn("px-3 py-1 rounded-md border text-xs font-bold", getRiskColor(aiResult?.risk || "Medium"))}>
                                                    {aiResult?.risk || "Medium"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Description & Analysis</p>
                                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-sm text-zinc-300 whitespace-pre-line leading-relaxed">
                                            {details.description || "No description provided."}
                                        </div>
                                    </div>

                                    <div className="bg-cyan-900/10 border border-cyan-500/20 rounded-lg p-4 flex gap-4">
                                        <ShieldAlert className="text-cyan-400 shrink-0 mt-1" size={20} />
                                        <div>
                                            <p className="font-bold text-cyan-400 text-sm mb-1">Recommended Action</p>
                                            <p className="text-zinc-400 text-xs leading-relaxed">Based on the AI assessment, it is recommended to invalidate active sessions for affected users and conduct a sweep of logs for the provided malicious indicators (URLs/Files).</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center gap-4 pt-4">
                                    <button className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">
                                        <Download size={16} /> Download PDF
                                    </button>
                                    <button className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all">
                                        Report to Authority <Send size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation Footer */}
                <div className="border-t border-white/5 p-6 bg-black/20 flex justify-between items-center relative z-20">
                    <button
                        onClick={() => setStep(s => Math.max(1, s - 1))}
                        disabled={step === 1 || step === 4}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors",
                            step === 1 || step === 4 ? "opacity-0 pointer-events-none" : "text-zinc-500 hover:text-white hover:bg-zinc-800"
                        )}
                    >
                        <ChevronLeft size={16} /> Back
                    </button>

                    {step < 4 && (
                        <button
                            onClick={handleNext}
                            disabled={(step === 1 && !aiResult) || isAnalyzing}
                            className={cn(
                                "flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                (step === 1 && !aiResult) || isAnalyzing
                                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed hidden" 
                                    : "bg-white text-black hover:bg-zinc-200"
                            )}
                        >
                            {step === 3 ? "Review Report" : "Continue"} <ChevronRight size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
