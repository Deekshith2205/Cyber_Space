"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Send, User, Bot, Mic, Sparkles, MessageSquare, ShieldCheck, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/lib/hooks/use-user";

const suggestions = [
    { text: "Explain phishing attack", icon: Sparkles },
    { text: "Recover hacked account", icon: ShieldCheck },
    { text: "Check suspicious email", icon: MessageSquare },
    { text: "Guide to report cybercrime", icon: Info },
];

export default function AIAssistant() {
    const { user } = useUser();
    const firstName = user.name.split(' ')[0];
    
    const [messages, setMessages] = useState([
        { id: 1, role: "assistant", text: `Hello ${firstName}! I'm CYBERSPACE AI. How can I help you today?` }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = () => {
        if (!input.trim()) return;

        const newUserMsg = { id: Date.now(), role: "user", text: input };
        setMessages(prev => [...prev, newUserMsg]);
        setInput("");
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            setIsTyping(false);
            const aiResponse = {
                id: Date.now() + 1,
                role: "assistant",
                text: "I've analyzed your query. This appears to be a common security concern. I recommend checking our verified resource directory for official mitigation steps."
            };
            setMessages(prev => [...prev, aiResponse]);
        }, 1500);
    };

    return (
        <div className="fixed top-16 right-0 bottom-0 w-80 bg-panel border-l border-border flex flex-col z-30 shadow-sm transition-colors duration-300">
            <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#E0F2FE] flex items-center justify-center text-cyber-blue shadow-sm">
                        <Bot size={18} />
                    </div>
                    <span className="font-bold text-sm text-foreground">AI Cyber Assistant</span>
                </div>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-success-green animate-pulse" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div className={cn(
                                "max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm border",
                                msg.role === "user"
                                    ? "bg-[#E0F2FE] dark:bg-cyber-blue/20 text-[#0F172A] dark:text-white border-cyber-blue/20"
                                    : "bg-[#F1F5F9] dark:bg-white/5 text-[#0F172A] dark:text-zinc-300 border-border dark:border-white/10"
                            )}>
                                {msg.text}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="bg-[#F1F5F9] dark:bg-white/5 p-3 rounded-2xl border border-border dark:border-white/10 flex gap-1">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="p-4 border-t border-border space-y-4">
                <div className="grid grid-cols-1 gap-2">
                    {suggestions.map((s) => (
                        <button
                            key={s.text}
                            onClick={() => setInput(s.text)}
                            className="px-3 py-2 bg-panel-secondary hover:bg-slate-200 border border-border rounded-xl text-[10px] text-left text-slate-500 hover:text-foreground transition-all flex items-center gap-2 group shadow-sm"
                        >
                            <s.icon size={12} className="text-cyber-blue group-hover:scale-110 transition-transform" />
                            {s.text}
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Type your message..."
                        className="w-full bg-panel border border-border rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-cyber-blue focus:ring-2 focus:ring-cyber-blue/10 transition-all text-xs text-foreground placeholder:text-slate-400"
                    />
                    <div className="absolute right-2 top-1.5">
                        <button
                            onClick={handleSend}
                            className="p-2 bg-cyber-blue text-white rounded-lg shadow-md hover:bg-blue-600 transition-all"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
