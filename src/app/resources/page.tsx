"use client";

import React from "react";
import {
    ShieldCheck,
    ExternalLink,
    Search,
    BookOpen,
    Scale,
    AlertCircle,
    FileCheck,
    CheckCircle2,
    Lock,
    MessageSquare,
    Globe
} from "lucide-react";
import { motion } from "framer-motion";

const resources = [
    {
        category: "Report Cybercrime",
        items: [
            { name: "IC3 (FBI)", role: "Government", trust: "99%", badge: "Official", link: "https://ic3.gov" },
            { name: "CERT-In", role: "National", trust: "98%", badge: "Official", link: "https://cert-in.org.in" },
            { name: "Europol EC3", role: "European", trust: "99%", badge: "Official", link: "https://europol.europa.eu" }
        ]
    },
    {
        category: "Recover Accounts",
        items: [
            { name: "Have I Been Pwned", role: "Global", trust: "99%", badge: "Verified", link: "https://haveibeenpwned.com" },
            { name: "IdentityTheft.gov", role: "US Govt", trust: "100%", badge: "Official", link: "https://identitytheft.gov" },
            { name: "Google Security Checkup", role: "Global", trust: "100%", badge: "Verified", link: "https://myaccount.google.com" }
        ]
    },
    {
        category: "Learn Cyber Safety",
        items: [
            { name: "NIST Framework", role: "Standard", trust: "100%", badge: "Official", link: "https://nist.gov" },
            { name: "OWASP Top 10", role: "Educational", trust: "99%", badge: "Verified", link: "https://owasp.org" },
            { name: "SANS Newsletters", role: "Industry", trust: "97%", badge: "Verified", link: "https://sans.org" }
        ]
    }
];

export default function ResourceDirectory() {
    return (
        <div className="space-y-8 pt-6 pb-12">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                    <BookOpen className="text-cyber-blue" />
                    Cyber Resource Directory
                </h2>
                <p className="text-text-secondary text-sm">Verified sources for reporting, recovery, and cybersecurity education.</p>
            </div>

            <div className="relative group max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-cyber-blue transition-colors" size={20} />
                <input
                    type="text"
                    placeholder="Search resources, websites, or categories..."
                    className="w-full bg-foreground/5 border border-border rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue/30 transition-all text-sm text-foreground placeholder:text-text-muted/50 shadow-sm"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {resources.map((cat, idx) => (
                    <div key={idx} className="space-y-4">
                        <h3 className="text-sm font-black text-zinc-500 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                            <BookOpen size={16} className="text-cyber-blue" />
                            {cat.category}
                        </h3>
                        <div className="space-y-3">
                            {cat.items.map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ x: 4 }}
                                    className="glass p-5 rounded-2xl border border-border group cursor-pointer hover:border-cyber-blue/30 transition-all shadow-premium"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center text-text-muted group-hover:text-cyber-blue transition-colors shadow-sm">
                                                <Globe size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-foreground mb-0.5 group-hover:text-cyber-blue transition-colors">{item.name}</h4>
                                                <span className="text-[10px] text-text-muted font-black uppercase tracking-widest">{item.role}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-1 text-[8px] font-black text-success-green bg-success-green/10 px-1.5 py-0.5 rounded border border-success-green/20">
                                                <CheckCircle2 size={8} /> {item.badge}
                                            </div>
                                            <span className="text-[8px] text-text-muted font-black uppercase">{item.trust} Trust</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-4 text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-cyber-blue">
                                        Visit Official Site
                                        <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
