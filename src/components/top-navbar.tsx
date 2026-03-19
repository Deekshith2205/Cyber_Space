"use client";

import { Search, Bell, Mic, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-panel/80 backdrop-blur-md h-16 shadow-inset-deep flex items-center justify-between px-6 shadow-2xl">
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,229,255,0.15)] border-none">
          <img src="/cyberspacelogo.jpeg" alt="Cyberspace Logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-600 to-cyber-blue bg-clip-text text-transparent">
            CYBERSPACE
          </h1>
          <p className="text-[9px] text-text-muted uppercase tracking-[0.3em] font-bold leading-none mt-0.5">
            Next-Gen Security Command Center
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-8 relative">
        <div className="relative flex items-center group">
          <Search className="absolute left-3 text-text-muted group-focus-within:text-cyber-blue transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search CVEs, threats, resources..."
            className="w-full bg-panel-secondary border-none rounded-xl py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-cyber-blue/10 transition-all text-sm text-foreground placeholder:text-text-muted shadow-inset-deep"
          />
          <button className="absolute right-3 text-slate-400 hover:text-cyber-blue transition-colors">
            <Mic size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:text-foreground transition-colors group">
          <Bell size={20} className="group-hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-[10px] text-white flex items-center justify-center rounded-full border-none shadow-depth">
            9
          </span>
        </button>

        {isAuthenticated && user ? (
          <div className="flex items-center gap-3 pl-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-foreground">{user.name}</p>
              <p className="text-[10px] text-cyber-blue font-bold uppercase tracking-wider">{user.designation || 'USER'}</p>
            </div>
            <div className="group relative">
              <div className="w-10 h-10 rounded-full border-none p-0.5 shadow-depth overflow-hidden cursor-pointer hover:scale-110 transition-all">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0EA5E9&color=FFFFFF`} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover shadow-[0_0_15px_rgba(0,229,255,0.3)]" 
                />
              </div>
              <div className="absolute top-12 right-0 bg-[#0B0F14]/95 backdrop-blur-md rounded-xl p-2 w-32 shadow-depth border-none opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all">
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut size={14} />
                  LOGOUT
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Link 
            href="/login" 
            className="bg-cyber-blue text-black font-bold text-xs px-6 py-2 rounded-xl hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all"
          >
            LOGIN
          </Link>
        )}
      </div>
    </nav>
  );
}
