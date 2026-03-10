"use client";

import React from "react";
import { Settings, User, Bell, Shield, Eye, Database, Save, ChevronRight } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-8 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-12">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-black text-white tracking-tight">System Settings</h2>
                <p className="text-zinc-500 text-sm">Configure your analyst terminal and security preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 border-r border-white/5 pr-8 space-y-2">
                    {[
                        { label: "Profile", icon: User, active: true },
                        { label: "Notifications", icon: Bell },
                        { label: "Security & Privacy", icon: Shield },
                        { label: "Appearance", icon: Eye },
                        { label: "Data Management", icon: Database }
                    ].map((item, idx) => (
                        <button
                            key={idx}
                            className={cn(
                                "w-full flex items-center justify-between p-4 rounded-xl text-xs font-bold transition-all",
                                item.active
                                    ? "bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20"
                                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={16} />
                                {item.label}
                            </div>
                            {item.active && <ChevronRight size={14} />}
                        </button>
                    ))}
                </div>

                <div className="lg:col-span-3 space-y-12 max-w-2xl">
                    <section className="space-y-6">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest px-1">Profile Configuration</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-6 p-6 glass rounded-2xl border border-white/10">
                                <div className="w-20 h-20 rounded-full border-4 border-cyber-blue p-1 glow-blue relative group cursor-pointer overflow-hidden">
                                    <img src="https://ui-avatars.com/api/?name=Anjan+Majumdar&background=00E5FF&color=0B0F14" alt="Profile" className="w-full h-full rounded-full object-cover" />
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-black text-white uppercase">Upload</span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white">Anjan Majumdar</h4>
                                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Level 4 Senior Security Analyst</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest px-1">Display Name</label>
                                    <input type="text" defaultValue="Anjan Majumdar" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyber-blue transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest px-1">Email Terminal</label>
                                    <input type="text" defaultValue="anjan@cyberspace.ai" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyber-blue transition-all" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest px-1">Security Preferences</h3>
                        <div className="space-y-3">
                            {[
                                { label: "Two-Factor Authentication", desc: "Require biometric verification for all deep scans.", enabled: true },
                                { label: "Encrypted Data Logs", desc: "All local session logs are AES-256 encrypted.", enabled: true },
                                { label: "Automatic Threat Purge", desc: "Instantly delete identified malicious files.", enabled: false }
                            ].map((pref, idx) => (
                                <div key={idx} className="p-5 glass rounded-2xl border border-white/10 flex items-center justify-between group">
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-bold text-white">{pref.label}</h4>
                                        <p className="text-xs text-zinc-500 font-medium">{pref.desc}</p>
                                    </div>
                                    <div className={cn(
                                        "w-12 h-6 rounded-full p-1 transition-all cursor-pointer",
                                        pref.enabled ? "bg-success-green/20 border border-success-green/40 flex justify-end" : "bg-white/5 border border-white/10 flex justify-start"
                                    )}>
                                        <div className={cn(
                                            "w-4 h-4 rounded-full",
                                            pref.enabled ? "bg-success-green glow-green" : "bg-white/10"
                                        )} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="pt-8 border-t border-white/5 flex justify-end gap-3">
                        <button className="px-6 py-3 rounded-xl text-xs font-bold text-zinc-500 hover:text-white transition-all">Discard Changes</button>
                        <button className="px-8 py-3 bg-cyber-blue text-[#0B0F14] font-black rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:scale-105 transition-all flex items-center gap-2">
                            Save Parameters <Save size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { cn } from "@/lib/utils";
