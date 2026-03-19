"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Send, Bot, Sparkles, ShieldCheck, MessageSquare, Info, AlertTriangle, Shield, Wifi } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/lib/hooks/use-user";
import { useAIAssistant } from "@/lib/hooks/use-ai-assistant";

const suggestions = [
    { text: "Explain phishing attack", icon: Sparkles },
    { text: "Recover hacked account", icon: ShieldCheck },
    { text: "Check suspicious email asking for OTP", icon: MessageSquare },
    { text: "Guide to report cybercrime", icon: Info },
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

const SEVERITY_STYLES: Record<string, string> = {
    Low: "bg-green-500/20 text-green-400 border-green-500/30",
    Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    High: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    Critical: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function AIAssistant() {
    const { user } = useUser();
    const firstName = user?.name?.split(' ')[0] || 'User';
    const { messages, isLoading, sendMessage } = useAIAssistant();
    const [input, setInput] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSend = () => {
        if (!input.trim() || isLoading) return;
        sendMessage(input);
        setInput("");
    };

    return (
        <div className="fixed top-16 right-0 bottom-0 w-80 glass-premium glow-pulse-blue flex flex-col z-30 transition-all duration-300">
            {/* Header */}
            <div className="p-4 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-cyber-blue/10 flex items-center justify-center text-cyber-blue shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                        <Bot size={18} />
                    </div>
                    <span className="font-bold text-sm text-white text-glow-blue">AI Cyber Assistant</span>
                </div>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-success-green animate-pulse" />
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {/* Welcome message */}
                {messages.length === 0 && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                        <div className="max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed bg-white/10 text-white shadow-depth">
                            Hello {firstName}! I'm CYBERSPACE AI. Ask me anything about cybersecurity threats, scams, malware, and more.
                        </div>
                    </motion.div>
                )}

                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            {msg.role === "user" ? (
                                <div className="max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed bg-cyber-blue/20 text-white shadow-depth">
                                    {msg.text}
                                </div>
                            ) : msg.isDomainBlocked ? (
                                /* Domain blocked */
                                <div className="max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed bg-yellow-500/10 text-yellow-400 flex gap-2 items-start shadow-depth">
                                    <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                                    {msg.text}
                                </div>
                            ) : msg.isError ? (
                                /* Error */
                                <div className="max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed bg-red-500/10 text-red-400 shadow-depth">
                                    {msg.text}
                                </div>
                            ) : msg.analysis ? (
                                /* Structured analysis card */
                                <div className="w-full space-y-1">
                                    <div className="rounded-xl overflow-hidden text-xs shadow-depth bg-white/[0.03]">
                                        <div className="bg-white/5 px-3 py-2 flex items-center gap-2">
                                            {(() => {
                                                const Icon = THREAT_ICONS[msg.analysis!.threat_type] || ShieldCheck;
                                                return <Icon size={12} className="text-cyber-blue drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]" />;
                                            })()}
                                            <span className="font-bold text-foreground">{msg.analysis.threat_type}</span>
                                            <span className={cn("ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold border-none",
                                                SEVERITY_STYLES[msg.analysis.severity] || SEVERITY_STYLES.Medium
                                            )}>
                                                {msg.analysis.severity}
                                            </span>
                                        </div>
                                        <div className="p-3 space-y-2 bg-[#F1F5F9] dark:bg-white/[0.02]">
                                            <p className="text-slate-600 dark:text-zinc-300 leading-relaxed">{msg.analysis.description}</p>
                                            <div>
                                                <p className="font-semibold text-foreground mb-1">🛡️ Solution</p>
                                                <p className="text-slate-500 dark:text-zinc-400 whitespace-pre-line">{msg.analysis.solution}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground mb-1">🔒 Prevention</p>
                                                <p className="text-slate-500 dark:text-zinc-400 whitespace-pre-line">{msg.analysis.prevention}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed bg-white/10 text-white shadow-depth">
                                    {msg.text}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Typing indicator */}
                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="bg-[#F1F5F9] dark:bg-white/5 p-3 rounded-2xl border border-border dark:border-white/10 flex gap-1 items-center">
                            <span className="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-bounce" />
                            <span className="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                    </motion.div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Suggestions + Input */}
            <div className="p-4 space-y-3 bg-white/[0.02]">
                <div className="grid grid-cols-1 gap-1.5">
                    {suggestions.map((s) => (
                        <button
                            key={s.text}
                            onClick={() => setInput(s.text)}
                            className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] text-left text-text-secondary hover:text-white transition-all flex items-center gap-2 group shadow-sm"
                        >
                            <s.icon size={12} className="text-cyber-blue group-hover:drop-shadow-[0_0_5px_rgba(0,229,255,0.5)] transition-all" />
                            {s.text}
                        </button>
                    ))}
                </div>

                <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Type your message..."
                            disabled={isLoading}
                            className="w-full bg-white/5 border-none rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-cyber-blue/20 transition-all text-xs text-foreground placeholder:text-text-secondary/50 shadow-inset-deep"
                        />
                    <div className="absolute right-2 top-1.5">
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="p-2 bg-cyber-blue text-white rounded-lg shadow-md hover:bg-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
