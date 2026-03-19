"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Send, Bot, Sparkles, ShieldCheck, MessageSquare, Info, AlertTriangle, Shield, Wifi, X } from "lucide-react";
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
    const [isOpen, setIsOpen] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoading, isOpen]);

    const handleSend = () => {
        if (!input.trim() || isLoading) return;
        sendMessage(input);
        setInput("");
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                    "fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-premium",
                    isOpen 
                        ? "bg-alert-red text-white rotate-90 shadow-lg shadow-alert-red/20" 
                        : "bg-cyber-blue text-white shadow-lg shadow-cyber-blue/30 pulse-glow"
                )}
            >
                {isOpen ? <X size={24} /> : <Bot size={28} />}
                
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-alert-red text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-background shadow-sm">
                        1
                    </span>
                )}
            </motion.button>

            {/* Chat Popup Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className={cn(
                            "fixed z-50 glass flex flex-col shadow-premium border border-border overflow-hidden transition-all duration-300",
                            "inset-0 w-full h-full rounded-none", // Mobile (default)
                            "sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[380px] sm:h-[550px] sm:rounded-3xl" // Desktop/Tablet
                        )}
                    >
                        {/* Header */}
                        <div className="p-4 flex items-center justify-between border-b border-border bg-panel-secondary/40 backdrop-blur-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-cyber-blue/10 flex items-center justify-center text-cyber-blue shadow-sm ring-1 ring-cyber-blue/20">
                                    <Bot size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-black text-sm text-foreground tracking-tight">AI Cyber Assistant</span>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-success-green animate-pulse shadow-[0_0_5px_rgba(0,255,156,0.6)]" />
                                        <span className="text-[10px] text-success-green font-black uppercase tracking-widest">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-text-muted hover:text-foreground hover:bg-foreground/5 rounded-xl transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth">
                            {/* Welcome message */}
                            {messages.length === 0 && (
                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                                    <div className="max-w-[90%] p-4 rounded-2xl rounded-tl-none text-xs leading-relaxed bg-panel-secondary text-foreground shadow-sm border border-border font-medium">
                                        Hello {firstName}! I'm CYBERSPACE AI. How can I help you secure your digital environment today?
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
                                            <div className="max-w-[85%] p-4 rounded-2xl rounded-tr-none text-xs leading-relaxed bg-cyber-blue text-white shadow-lg shadow-cyber-blue/10 font-bold">
                                                {msg.text}
                                            </div>
                                        ) : msg.isDomainBlocked ? (
                                            <div className="max-w-[85%] p-4 rounded-2xl rounded-tl-none text-xs leading-relaxed bg-alert-red/10 text-alert-red flex gap-3 items-start border border-alert-red/20 shadow-sm font-medium">
                                                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                                                {msg.text}
                                            </div>
                                        ) : msg.isError ? (
                                            <div className="max-w-[85%] p-4 rounded-2xl rounded-tl-none text-xs leading-relaxed bg-alert-red/5 text-alert-red border border-alert-red/10 shadow-sm font-medium">
                                                {msg.text}
                                            </div>
                                        ) : msg.analysis ? (
                                            <div className="w-full space-y-2">
                                                <div className="rounded-2xl overflow-hidden text-xs border border-border shadow-premium">
                                                    <div className="bg-panel-secondary px-4 py-3 flex items-center gap-3 border-b border-border">
                                                        {(() => {
                                                            const Icon = THREAT_ICONS[msg.analysis!.threat_type] || ShieldCheck;
                                                            return <Icon size={16} className="text-cyber-blue" />;
                                                        })()}
                                                        <span className="font-black text-foreground uppercase tracking-tight">{msg.analysis.threat_type}</span>
                                                        <span className={cn("ml-auto px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase",
                                                            SEVERITY_STYLES[msg.analysis.severity] || SEVERITY_STYLES.Medium
                                                        )}>
                                                            {msg.analysis.severity}
                                                        </span>
                                                    </div>
                                                    <div className="p-4 space-y-3 bg-panel/30">
                                                        <p className="text-text-secondary leading-relaxed font-medium">{msg.analysis.description}</p>
                                                        <div className="space-y-1.5 p-3 bg-success-green/5 rounded-xl border border-success-green/10">
                                                            <p className="font-black text-success-green text-[10px] uppercase tracking-widest">🛡️ Actionable Solution</p>
                                                            <p className="text-text-secondary whitespace-pre-line font-medium">{msg.analysis.solution}</p>
                                                        </div>
                                                        <div className="space-y-1.5 p-3 bg-cyber-blue/5 rounded-xl border border-cyber-blue/10">
                                                            <p className="font-black text-cyber-blue text-[10px] uppercase tracking-widest">🔒 Prevention Strategy</p>
                                                            <p className="text-text-secondary whitespace-pre-line font-medium">{msg.analysis.prevention}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="max-w-[85%] p-4 rounded-2xl rounded-tl-none text-xs leading-relaxed bg-panel-secondary text-foreground border border-border shadow-sm font-medium">
                                                {msg.text}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {isLoading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                    <div className="bg-panel-secondary px-4 py-3 rounded-2xl rounded-tl-none border border-border flex gap-1.5 items-center shadow-sm">
                                        <div className="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-bounce" />
                                        <div className="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </motion.div>
                            )}
                            <div ref={bottomRef} className="h-2" />
                        </div>

                        {/* Input Area */}
                        <div className="p-5 space-y-4 bg-panel-secondary/30 backdrop-blur-xl border-t border-border">
                            {messages.length === 0 && (
                                <div className="grid grid-cols-1 gap-1.5">
                                    {suggestions.map((s) => (
                                        <button
                                            key={s.text}
                                            onClick={() => setInput(s.text)}
                                            className="px-3 py-2.5 bg-panel/50 hover:bg-cyber-blue/10 border border-border rounded-xl text-[10px] text-left text-text-secondary hover:text-cyber-blue transition-all duration-200 flex items-center gap-3 group shadow-sm font-bold uppercase tracking-tight"
                                        >
                                            <s.icon size={14} className="text-cyber-blue/60 group-hover:text-cyber-blue transition-all" />
                                            {s.text}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="relative group">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Type your security query..."
                                    disabled={isLoading}
                                    className="w-full bg-panel border border-border rounded-2xl py-4 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-cyber-blue/20 transition-all text-xs text-foreground placeholder:text-text-muted/50 shadow-inner font-medium"
                                />
                                <div className="absolute right-2 top-2">
                                    <button
                                        onClick={handleSend}
                                        disabled={isLoading || !input.trim()}
                                        className="p-3 bg-cyber-blue text-white rounded-xl shadow-lg shadow-cyber-blue/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 disabled:shadow-none"
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
