"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Link2, Bot, ClipboardList, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
    {
        id: "scan",
        title: "Scan Website Vulnerabilities",
        desc: "Perform deep-packet inspection and port analysis on any domain.",
        icon: ShieldAlert,
        color: "blue"
    },
    {
        id: "link",
        title: "Check Suspicious Link",
        desc: "AI-powered URL checking for phishing and malicious redirects.",
        icon: Link2,
        color: "orange"
    },
    {
        id: "ask",
        title: "Ask AI Cyber Assistant",
        desc: "Get instant answers to complex security and compliance queries.",
        icon: Bot,
        color: "purple"
    },
    {
        id: "report",
        title: "Report Cyber Incident",
        desc: "Guided step-by-step assistant for formal incident documentation.",
        icon: ClipboardList,
        color: "red"
    }
];

export default function QuickActions() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {actions.map((action) => (
                <motion.div
                    key={action.id}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="glass p-5 rounded-3xl border border-white/10 group cursor-pointer relative overflow-hidden transition-all duration-300"
                >
                    <div className={cn(
                        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 opacity-0 transition-opacity",
                        action.color === 'blue' && "from-cyber-blue to-transparent",
                        action.color === 'orange' && "from-orange-500 to-transparent",
                        action.color === 'purple' && "from-neon-purple to-transparent",
                        action.color === 'red' && "from-alert-red to-transparent",
                    )} />

                    <div className="relative z-10 flex flex-col h-full">
                        <div className={cn(
                            "p-3 rounded-2xl bg-white/5 border border-white/10 w-fit mb-4 group-hover:border-current transition-colors",
                            action.color === 'blue' && "group-hover:text-cyber-blue",
                            action.color === 'orange' && "group-hover:text-orange-500",
                            action.color === 'purple' && "group-hover:text-neon-purple",
                            action.color === 'red' && "group-hover:text-alert-red",
                        )}>
                            <action.icon size={24} />
                        </div>

                        <h3 className="text-sm font-bold text-white mb-2 group-hover:translate-x-1 transition-transform">{action.title}</h3>
                        <p className="text-[10px] text-zinc-500 font-medium leading-relaxed mb-4">{action.desc}</p>

                        <div className="mt-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                            Initialize
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
