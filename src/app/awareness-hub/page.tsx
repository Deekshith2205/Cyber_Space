"use client";

import React from "react";
import { GraduationCap, PlayCircle, BookOpen, ShieldCheck, FileText, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const modules = [
    {
        title: "Phishing Fundamentals",
        desc: "Learn to identify suspicious patterns and malicious social engineering tactics.",
        duration: "15 mins",
        level: "Beginner",
        icon: PlayCircle
    },
    {
        title: "Secure Device Management",
        desc: "Hardening your mobile and workstation endpoints against common exploits.",
        duration: "25 mins",
        level: "Intermediate",
        icon: ShieldCheck
    },
    {
        title: "Network Defense 101",
        desc: "Understanding firewalls, VPNs, and encrypted communications.",
        duration: "40 mins",
        level: "Advanced",
        icon: BookOpen
    }
];

export default function AwarenessHubPage() {
    return (
        <div className="space-y-8 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-12">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-black text-white tracking-tight">Cyber Awareness Hub</h2>
                <p className="text-zinc-500 text-sm">Interactive training and educational resources for next-generation defense.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {modules.map((mod, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ y: -6 }}
                        className="glass p-8 rounded-[2rem] border border-white/10 group cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <mod.icon size={100} />
                        </div>

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-12 h-12 rounded-2xl bg-cyber-blue/10 flex items-center justify-center text-cyber-blue mb-6 group-hover:scale-110 transition-transform glow-blue">
                                <mod.icon size={24} />
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2">{mod.title}</h3>
                            <p className="text-xs text-zinc-500 font-medium leading-relaxed mb-6">{mod.desc}</p>

                            <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{mod.duration}</span>
                                    <span className="text-[10px] text-cyber-blue font-black uppercase tracking-widest">{mod.level}</span>
                                </div>
                                <button className="p-3 bg-white/5 rounded-xl text-zinc-400 group-hover:bg-cyber-blue group-hover:text-[#0B0F14] transition-all">
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="glass p-10 rounded-[2.5rem] border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                    <h3 className="text-3xl font-black text-white leading-tight">Ready to test your <br /> defensive skills?</h3>
                    <p className="text-zinc-400 text-sm max-w-md">Complete our monthly Cyber Defense Simulation to earn your Level 5 Analyst badge and unlock advanced AI features.</p>
                    <button className="px-10 py-4 bg-cyber-blue text-[#0B0F14] font-black rounded-2xl shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:scale-105 transition-all flex items-center gap-3">
                        Start Simulation <GraduationCap size={20} />
                    </button>
                </div>
                <div className="w-full md:w-80 h-60 bg-white/5 rounded-[2rem] border border-white/5 relative flex items-center justify-center group cursor-pointer overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center grayscale opacity-20 group-hover:scale-110 transition-transform duration-1000" />
                    <PlayCircle size={60} className="text-white relative z-10 opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>
        </div>
    );
}
