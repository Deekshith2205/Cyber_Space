"use client";

import React from "react";
import AIAssistantPanel from "@/components/ai-assistant-panel";

export default function AIAssistantPage() {
    return (
        <div className="space-y-6 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 h-[calc(100vh-8rem)]">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-black text-white tracking-tight">AI Cyber Assistant</h2>
                <p className="text-zinc-500 text-sm">Full-screen dedicated AI security analysis and research interface.</p>
            </div>

            <div className="glass rounded-[2rem] border border-white/10 h-full overflow-hidden relative">
                <div className="absolute inset-0 flex flex-col">
                    {/* We reuse the component logic or just embed it here for a full-screen feel */}
                    <div className="flex-1 p-8">
                        <div className="max-w-4xl mx-auto h-full flex flex-col border border-white/5 rounded-3xl bg-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple glow-purple">
                                        <Bot size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">CYBERSPACE Intelligence Engine</h3>
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Neural Security Model v4.2</p>
                                    </div>
                                </div>
                                <div className="px-4 py-1.5 rounded-full bg-success-green/10 border border-success-green/20 text-[10px] text-success-green font-bold uppercase tracking-widest">
                                    Online
                                </div>
                            </div>

                            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-zinc-600 border border-dashed border-white/20">
                                    <MessageSquare size={32} />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-lg font-bold text-white">Start a High-Level Consultation</h4>
                                    <p className="text-sm text-zinc-500 max-w-sm">I can assist with real-time threat analysis, secure code reviews, and incident response strategies.</p>
                                </div>
                            </div>

                            <div className="p-8 border-t border-white/5">
                                <div className="relative max-w-2xl mx-auto">
                                    <input
                                        type="text"
                                        placeholder="Describe your security concern or upload a log file..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-6 pr-20 focus:outline-none focus:border-neon-purple transition-all text-sm"
                                    />
                                    <button className="absolute right-3 top-2 bottom-2 px-6 bg-neon-purple text-white rounded-xl shadow-[0_0_20px_rgba(122,92,255,0.4)] font-bold text-xs">
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Bot, MessageSquare } from "lucide-react";
