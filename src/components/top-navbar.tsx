"use client";

import React from "react";
import { Search, Bell, Mic, Shield } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass h-16 border-b border-white/10 flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 rounded-xl overflow-hidden glow-blue border border-cyber-blue/20">
          <img src="/cyberspacelogo.jpeg" alt="Cyberspace Logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-600 via-cyber-blue to-emerald-400 bg-clip-text text-transparent">
            CYBERSPACE
          </h1>
          <p className="text-[9px] text-zinc-500 uppercase tracking-[0.3em] font-bold leading-none mt-0.5">
            Next-Gen Security Command Center
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-8 relative">
        <div className="relative flex items-center group">
          <Search className="absolute left-3 text-zinc-500 group-focus-within:text-cyber-blue transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search CVEs, threats, resources..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-10 focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue/30 transition-all text-sm"
          />
          <button className="absolute right-3 text-zinc-500 hover:text-cyber-blue transition-colors">
            <Mic size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-zinc-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-alert-red text-[10px] text-white flex items-center justify-center rounded-full border-2 border-[#0B0F14]">
            9
          </span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">Anjan Majumdar</p>
            <p className="text-xs text-cyber-blue font-medium">Level 4 Analyst</p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-cyber-blue p-0.5 glow-blue overflow-hidden cursor-pointer hover:scale-105 transition-transform">
            <img src="https://ui-avatars.com/api/?name=Anjan+Majumdar&background=00E5FF&color=0B0F14" alt="Profile" className="w-full h-full rounded-full object-cover" />
          </div>
        </div>
      </div>
    </nav>
  );
}
