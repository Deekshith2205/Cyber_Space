"use client";

import React, { useState } from "react";
import { Send, User, Bot, Mic, Sparkles, MessageSquare, ShieldCheck, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const suggestions = [
    { text: "Explain phishing attack", icon: Sparkles },
    { text: "Recover hacked account", icon: ShieldCheck },
    { text: "Check suspicious email", icon: MessageSquare },
    { text: "Guide to report cybercrime", icon: Info },
];

export default function AIAssistant() {
    const [messages, setMessages] = useState([
        { id: 1, role: "assistant", text: "Hello! I'm CYBERSPACE AI. How can I help you today?" }
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
        <div className="fixed top-16 right-0 bottom-0 w-80 glass border-l border-white/10 flex flex-col z-30">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple shadow-[0_0_10px_rgba(122,92,255,0.3)]">
                        <Bot size={18} />
                    </div>
                    <span className="font-bold text-sm">AI Cyber Assistant</span>
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
                            <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${msg.role === "user"
                                ? "bg-cyber-blue/20 text-white border border-cyber-blue/30"
                                : "bg-white/5 text-zinc-300 border border-white/10"
                                }`}>
                                {msg.text}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex gap-1">
                            <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
                            <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="p-4 border-t border-white/10 space-y-4">
                <div className="grid grid-cols-1 gap-2">
                    {suggestions.map((s) => (
                        <button
                            key={s.text}
                            onClick={() => setInput(s.text)}
                            className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] text-left text-zinc-400 hover:text-white transition-all flex items-center gap-2 group"
                        >
                            <s.icon size={12} className="text-neon-purple group-hover:scale-110 transition-transform" />
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
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-20 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/30 transition-all text-xs"
                    />
                    <div className="absolute right-2 top-1.5 flex gap-1">
                        <button className="p-1.5 text-zinc-500 hover:text-cyber-blue transition-colors">
                            <Mic size={16} />
                        </button>
                        <button
                            onClick={handleSend}
                            className="p-1.5 bg-neon-purple text-white rounded-lg shadow-[0_0_10px_rgba(122,92,255,0.5)] hover:bg-neon-purple/80 transition-all"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
