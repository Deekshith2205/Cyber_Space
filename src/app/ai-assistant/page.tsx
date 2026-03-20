"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bot, Send, Sparkles, ShieldCheck, MessageSquare, Info,
    AlertTriangle, Shield, Wifi, Trash2, ChevronRight, Zap,
    Mic, MicOff, Clock, RefreshCw
} from "lucide-react";
import { useUser } from "@/lib/hooks/use-user";
import { useAIAssistant, AIAnalysisResult, AIHistoryRecord } from "@/lib/hooks/use-ai-assistant";
import { cn } from "@/lib/utils";

/* ─── Constants ──────────────────────────────────────────────────── */

const SUGGESTIONS = [
    { text: "I received a suspicious email asking for my OTP", icon: MessageSquare, tag: "Phishing" },
    { text: "My computer is running slow and showing ads", icon: AlertTriangle, tag: "Malware" },
    { text: "Someone is threatening to leak my private files", icon: Shield, tag: "Ransomware" },
    { text: "How to secure my public Wi-Fi connection?", icon: Wifi, tag: "Network" },
    { text: "Detect if my account was hacked", icon: Zap, tag: "Breach" },
    { text: "Guide to report cybercrime in India", icon: Info, tag: "Guide" },
];

const THREAT_ICONS: Record<string, React.ElementType> = {
    Phishing: MessageSquare,
    Malware: AlertTriangle,
    Ransomware: AlertTriangle,
    "Social Engineering": Bot,
    "Data Breach": Shield,
    "Network Attack": Wifi,
    Other: ShieldCheck,
};

const SEVERITY_CONFIG: Record<string, { badge: string; bar: string; glow: string }> = {
    Low: {
        badge: "bg-green-500/20 text-green-400 border-green-500/40",
        bar: "bg-green-400",
        glow: "shadow-[0_0_20px_rgba(74,222,128,0.15)]",
    },
    Medium: {
        badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
        bar: "bg-yellow-400",
        glow: "shadow-[0_0_20px_rgba(250,204,21,0.15)]",
    },
    High: {
        badge: "bg-orange-500/20 text-orange-400 border-orange-500/40",
        bar: "bg-orange-400",
        glow: "shadow-[0_0_20px_rgba(251,146,60,0.15)]",
    },
    Critical: {
        badge: "bg-red-500/20 text-red-400 border-red-500/40",
        bar: "bg-red-500",
        glow: "shadow-[0_0_20px_rgba(239,68,68,0.25)]",
    },
};

const SEVERITY_WIDTH: Record<string, number> = {
    Low: 25,
    Medium: 50,
    High: 75,
    Critical: 100,
};

/* ─── Keyword Highlighter ─────────────────────────────────────────── */
const KEYWORDS = ["phishing", "malware", "ransomware", "hack", "virus", "scam",
    "breach", "attack", "vulnerability", "fraud", "spyware", "trojan", "social engineering"];

function HighlightText({ text }: { text: string }) {
    const parts = text.split(new RegExp(`(${KEYWORDS.join("|")})`, "gi"));
    return (
        <>
            {parts.map((part, i) =>
                KEYWORDS.includes(part.toLowerCase())
                    ? <mark key={i} className="bg-neon-purple/20 text-neon-purple rounded px-0.5 not-italic font-semibold">{part}</mark>
                    : <span key={i}>{part}</span>
            )}
        </>
    );
}

/* ─── Typewriter Text ─────────────────────────────────────────────── */
function TypewriterText({ text, speed = 18 }: { text: string; speed?: number }) {
    const [displayed, setDisplayed] = useState("");
    const indexRef = useRef(0);

    useEffect(() => {
        indexRef.current = 0;
        Promise.resolve().then(() => setDisplayed(""));
        const id = setInterval(() => {
            indexRef.current++;
            setDisplayed(text.slice(0, indexRef.current));
            if (indexRef.current >= text.length) clearInterval(id);
        }, speed);
        return () => clearInterval(id);
    }, [text, speed]);

    return (
        <>
            <HighlightText text={displayed} />
            {displayed.length < text.length && (
                <span className="inline-block w-[2px] h-[13px] bg-cyber-blue ml-0.5 animate-pulse align-middle" />
            )}
        </>
    );
}

/* ─── Analysis Result Card ────────────────────────────────────────── */
function ThreatCard({ analysis }: { analysis: AIAnalysisResult }) {
    const Icon = THREAT_ICONS[analysis.threat_type] || ShieldCheck;
    const sev = SEVERITY_CONFIG[analysis.severity] || SEVERITY_CONFIG.Medium;
    const barWidth = SEVERITY_WIDTH[analysis.severity] ?? 50;
    const [tab, setTab] = useState<"solution" | "prevention">("solution");

    return (
        <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35 }}
            className={cn(
                "rounded-2xl border border-border overflow-hidden bg-panel/30 backdrop-blur shadow-premium",
                sev.glow
            )}
        >
            {/* Top bar */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border/10 ring-1 ring-inset ring-foreground/2">
                <div className="w-9 h-9 rounded-xl bg-foreground/5 flex items-center justify-center text-cyber-blue shadow-sm">
                    <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-text-muted uppercase tracking-widest font-black">Threat Detected</p>
                    <h3 className="font-bold text-foreground truncate text-glow-primary">{analysis.threat_type}</h3>
                </div>
                <span className={cn("px-3 py-1 rounded-full text-[11px] font-black border uppercase tracking-wider shadow-sm", sev.badge)}>
                    {analysis.severity}
                </span>
            </div>

            {/* Severity bar */}
            <div className="px-5 py-2 bg-foreground/5">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] text-text-muted uppercase tracking-widest font-black w-16 shrink-0">Risk Level</span>
                    <div className="flex-1 h-1.5 bg-foreground/10 rounded-full overflow-hidden shadow-inner">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${barWidth}%` }}
                            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
                            className={cn("h-full rounded-full", sev.bar)}
                        />
                    </div>
                    <span className="text-[10px] text-text-secondary font-bold shrink-0 max-w-[140px] truncate">{analysis.risk_level}</span>
                </div>
            </div>

            {/* Description with typewriter */}
            <div className="px-5 py-4 border-b border-white/5">
                <p className="text-sm text-white leading-relaxed">
                    <TypewriterText text={analysis.description} />
                </p>
            </div>

            {/* Tabs: Solution / Prevention */}
            <div className="flex border-b border-border/10">
                {(["solution", "prevention"] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={cn(
                            "flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all",
                            tab === t
                                ? "text-cyber-blue border-b-2 border-cyber-blue bg-cyber-blue/5"
                                : "text-text-muted hover:text-text-secondary"
                        )}
                    >
                        {t === "solution" ? "🛡️ Solution" : "🔒 Prevention"}
                    </button>
                ))}
            </div>

            <div className="px-5 py-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={tab}
                        initial={{ opacity: 0, x: tab === "solution" ? -8 : 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: tab === "solution" ? 8 : -8 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm text-text-secondary leading-relaxed whitespace-pre-line"
                    >
                        {tab === "solution" ? analysis.solution : analysis.prevention}
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

/* ─── History Panel ───────────────────────────────────────────────── */
function HistoryPanel({
    history,
    isLoading,
    onSelect,
    onRefresh,
}: {
    history: AIHistoryRecord[];
    isLoading: boolean;
    onSelect: (q: string) => void;
    onRefresh: () => void;
}) {
    const sev = (s: string) => ({
        Low: "text-green-400 bg-green-500/10",
        Medium: "text-yellow-400 bg-yellow-500/10",
        High: "text-orange-400 bg-orange-500/10",
        Critical: "text-red-400 bg-red-500/10",
    }[s] ?? "text-zinc-400 bg-white/5");

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Clock size={12} className="text-cyber-blue" />
                    <p className="text-[10px] font-black text-foreground uppercase tracking-widest">Past Queries</p>
                </div>
                <button
                    onClick={onRefresh}
                    className="text-text-muted hover:text-foreground transition-colors"
                    title="Refresh history"
                >
                    <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
                </button>
            </div>
            {isLoading && (
                <p className="text-xs text-zinc-600 text-center py-3">Loading...</p>
            )}
            {!isLoading && history.length === 0 && (
                <p className="text-xs text-zinc-600 text-center py-3">No history yet</p>
            )}
            <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
                {history.map((item) => {
                    const Icon = THREAT_ICONS[item.threat_type] || ShieldCheck;
                    return (
                        <button
                            key={item._id}
                            onClick={() => onSelect(item.input)}
                            className="w-full text-left px-3 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/8 hover:border-neon-purple/30 transition-all group"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <Icon size={10} className="text-zinc-500 group-hover:text-neon-purple transition-colors shrink-0" />
                                {item.isDomainBlocked ? (
                                    <span className="text-[9px] font-bold text-yellow-500/80 uppercase tracking-wider">Blocked</span>
                                ) : (
                                    <span className={cn("text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full", sev(item.severity))}>
                                        {item.severity || item.threat_type || "Other"}
                                    </span>
                                )}
                                <span className="text-[9px] text-zinc-700 ml-auto shrink-0">
                                    {new Date(item.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                                </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 group-hover:text-zinc-300 transition-colors leading-snug line-clamp-2">
                                {item.input}
                            </p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

/* ─── Main Page ───────────────────────────────────────────────────── */
export default function AIAssistantPage() {
    const { user } = useUser();
    const firstName = user?.name?.split(" ")[0] || "User";
    const { messages, isLoading, sendMessage, clearMessages, history, isHistoryLoading, fetchHistory } = useAIAssistant();
    const [input, setInput] = useState("");
    const [sideTab, setSideTab] = useState<"suggestions" | "history">("suggestions");
    const [isListening, setIsListening] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    // Fetch history on mount
    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const handleSend = () => {
        if (!input.trim() || isLoading) return;
        sendMessage(input);
        setInput("");
    };

    /* ── Voice Input ── */
    const toggleVoice = useCallback(() => {
        if (typeof window === "undefined") return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const w = window as any;
        const SR = w.SpeechRecognition || w.webkitSpeechRecognition;

        if (!SR) {
            alert("Voice input is not supported in your browser. Try Chrome.");
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        const recognition = new SR();
        recognition.lang = "en-IN";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (e: any) => {
            const transcript = e.results[0][0].transcript;
            setInput((prev: string) => (prev ? prev + " " + transcript : transcript));
        };
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);

        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
    }, [isListening]);

    const hasMessages = messages.length > 0;

    return (
        <div className="space-y-6 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                        <Bot className="text-cyber-blue" />
                        AI Cyber Assistant
                    </h2>
                    <p className="text-text-secondary text-sm">Powered by Google Gemini · Cybersecurity domain only</p>
                </div>
                {hasMessages && (
                    <button
                        onClick={() => { clearMessages(); fetchHistory(); }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border text-text-muted hover:text-foreground hover:bg-foreground/5 text-xs transition-all shadow-sm"
                    >
                        <Trash2 size={12} /> Clear Chat
                    </button>
                )}
            </div>

            <div className="flex gap-6 h-[calc(100vh-14rem)]">

                {/* ── Left: Chat area ── */}
                <div className="flex-1 flex flex-col glass rounded-3xl border border-border overflow-hidden min-w-0 shadow-premium">
                    {/* Chat header */}
                    <div className="px-6 py-4 border-b border-border/10 flex items-center gap-3 bg-foreground/[0.02]">
                        <div className="w-9 h-9 rounded-full bg-cyber-blue/10 border border-cyber-blue/20 flex items-center justify-center text-cyber-blue shadow-sm">
                            <Bot size={18} />
                        </div>
                        <div>
                            <p className="font-bold text-foreground text-sm tracking-tight">CYBERSPACE Intelligence Engine</p>
                            <p className="text-[10px] text-text-muted uppercase tracking-widest font-black">Gemini · Context-Aware · Neural Security Model</p>
                        </div>
                        <div className="ml-auto px-3 py-1 rounded-full bg-success-green/10 border border-success-green/20 text-[10px] text-success-green font-bold uppercase tracking-widest shadow-sm">
                            Online
                        </div>
                    </div>

                    {/* Messages scroll area */}
                    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                        {/* Empty state */}
                        {!hasMessages && (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-16">
                                <div className="w-16 h-16 rounded-2xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center text-neon-purple">
                                    <Bot size={28} />
                                </div>
                                <h4 className="text-lg font-bold text-white">Hello, {firstName}!</h4>
                                <p className="text-sm text-zinc-500 max-w-sm">
                                    I classify cyber threats, explain attacks, and give step-by-step solutions.
                                    Ask a follow-up and I&apos;ll remember our conversation. All responses are limited to cybersecurity.
                                </p>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                                        <Mic size={12} className="text-neon-purple" />
                                        <span>Voice input supported</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                                        <MessageSquare size={12} className="text-neon-purple" />
                                        <span>Follow-up questions work</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <AnimatePresence initial={false}>
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {msg.role === "user" ? (
                                        <div className="max-w-[75%] px-5 py-3 rounded-2xl rounded-br-md bg-cyber-blue/10 border border-cyber-blue/20 text-foreground text-sm leading-relaxed shadow-sm">
                                            {msg.text}
                                        </div>
                                    ) : msg.isDomainBlocked ? (
                                        <div className="max-w-[75%] px-5 py-3 rounded-2xl rounded-bl-md bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 dark:text-yellow-400 text-sm flex gap-2 items-start shadow-sm">
                                            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                                            <span>{msg.text}</span>
                                        </div>
                                    ) : msg.isError ? (
                                        <div className="max-w-[75%] px-5 py-3 rounded-2xl rounded-bl-md bg-red-500/10 border border-red-500/30 text-alert-red text-sm shadow-sm font-medium">
                                            {msg.text}
                                        </div>
                                    ) : msg.analysis ? (
                                        <div className="w-full max-w-2xl">
                                            <ThreatCard analysis={msg.analysis} />
                                        </div>
                                    ) : (
                                        <div className="max-w-[75%] px-5 py-3 rounded-2xl rounded-bl-md bg-foreground/5 border border-border/10 text-foreground text-sm leading-relaxed shadow-sm">
                                            {msg.text}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Typing animation */}
                        {isLoading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                <div className="px-5 py-3 rounded-2xl rounded-bl-md bg-white/5 border border-white/10 flex gap-1.5 items-center">
                                    <span className="text-xs text-zinc-500 mr-2">Analyzing threat…</span>
                                    <span className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce" />
                                    <span className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <span className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </motion.div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input area */}
                    <div className="px-6 py-4 border-t border-border/10 bg-foreground/[0.02]">
                        <div className="relative flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                disabled={isLoading}
                                placeholder={hasMessages ? "Ask a follow-up…" : "Describe your cybersecurity concern…"}
                                className="flex-1 bg-foreground/5 border border-border rounded-2xl py-4 pl-6 pr-4 focus:outline-none focus:border-cyber-blue/50 focus:ring-2 focus:ring-cyber-blue/20 transition-all text-sm text-foreground placeholder-text-muted/50 disabled:opacity-50 font-medium"
                            />
                            {/* Voice button */}
                            <button
                                onClick={toggleVoice}
                                title={isListening ? "Stop listening" : "Voice input"}
                                className={cn(
                                    "shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all",
                                    isListening
                                        ? "bg-alert-red text-white shadow-lg shadow-alert-red/20 animate-pulse"
                                        : "bg-foreground/5 border border-border text-text-muted hover:text-foreground hover:bg-foreground/10"
                                )}
                            >
                                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                            </button>
                            {/* Send button */}
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="shrink-0 h-11 px-5 bg-cyber-blue text-white rounded-xl shadow-lg shadow-cyber-blue/20 font-black text-[11px] uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Send size={14} /> Send
                            </button>
                        </div>
                        {isListening && (
                            <p className="text-[11px] text-alert-red mt-2 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 bg-alert-red rounded-full animate-ping inline-block" />
                                Listening… speak your query
                            </p>
                        )}
                    </div>
                </div>

                {/* ── Right: Sidebar ── */}
                <div className="hidden xl:flex flex-col gap-4 w-72 shrink-0">
                    <div className="glass rounded-2xl border border-white/10 p-5 flex flex-col gap-4 flex-1 min-h-0">
                        {/* Tab toggle */}
                        <div className="flex rounded-xl overflow-hidden border border-white/10">
                            <button
                                onClick={() => setSideTab("suggestions")}
                                className={cn(
                                    "flex-1 py-2 text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5",
                                    sideTab === "suggestions"
                                        ? "bg-neon-purple/20 text-neon-purple"
                                        : "text-zinc-600 hover:text-zinc-400"
                                )}
                            >
                                <Sparkles size={11} /> Quick
                            </button>
                            <button
                                onClick={() => { setSideTab("history"); fetchHistory(); }}
                                className={cn(
                                    "flex-1 py-2 text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5",
                                    sideTab === "history"
                                        ? "bg-neon-purple/20 text-neon-purple"
                                        : "text-zinc-600 hover:text-zinc-400"
                                )}
                            >
                                <Clock size={11} /> History
                            </button>
                        </div>

                        {/* Tab content */}
                        <AnimatePresence mode="wait">
                            {sideTab === "suggestions" ? (
                                <motion.div
                                    key="suggestions"
                                    initial={{ opacity: 0, x: -6 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 6 }}
                                    transition={{ duration: 0.15 }}
                                    className="space-y-2"
                                >
                                    {SUGGESTIONS.map((s) => (
                                        <button
                                            key={s.text}
                                            onClick={() => setInput(s.text)}
                                            className="w-full text-left px-4 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/8 hover:border-neon-purple/30 transition-all group"
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] text-neon-purple font-bold uppercase tracking-widest">{s.tag}</span>
                                                <ChevronRight size={10} className="text-zinc-600 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                            <p className="text-xs text-zinc-400 group-hover:text-white transition-colors leading-snug">{s.text}</p>
                                        </button>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="history"
                                    initial={{ opacity: 0, x: 6 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -6 }}
                                    transition={{ duration: 0.15 }}
                                    className="flex-1 min-h-0"
                                >
                                    <HistoryPanel
                                        history={history}
                                        isLoading={isHistoryLoading}
                                        onSelect={(q) => setInput(q)}
                                        onRefresh={fetchHistory}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Domain filter info */}
                    <div className="glass rounded-2xl border border-white/10 p-4 space-y-2">
                        <p className="text-xs font-bold text-white uppercase tracking-widest">Domain Filter</p>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                            Restricted to cybersecurity only. Off-topic queries are blocked automatically.
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {["Phishing", "Malware", "Ransomware", "Social Eng.", "Data Breach", "Network"].map(tag => (
                                <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-zinc-500">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
