"use client";

import { useUser } from "@/lib/hooks/use-user";

interface ProfileSettingsProps {
    data: {
        displayName: string;
        email: string;
    };
    onChange: (field: string, value: string) => void;
}

export default function ProfileSettings({ data, onChange }: ProfileSettingsProps) {
    const { user } = useUser();
    
    return (
        <section className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-4">
                <div className="flex items-center gap-6 p-6 bg-panel border border-border rounded-2xl shadow-sm">
                    <div className="w-20 h-20 rounded-full border-4 border-cyber-blue p-1 relative group cursor-pointer overflow-hidden shadow-sm">
                        <div className="w-full h-full rounded-full bg-cyber-blue/10 flex items-center justify-center text-cyber-blue font-black text-2xl">
                            {user.avatarInitials}
                        </div>
                        <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-black text-white uppercase">Upload</span>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-foreground">{user.name}</h4>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{user.role}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-500 px-1">Display Name</label>
                        <input
                            type="text"
                            value={data.displayName}
                            onChange={(e) => onChange("displayName", e.target.value)}
                            placeholder="e.g. Anjan Majumdar"
                            className="w-full bg-panel border-[#CBD5F5] border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyber-blue focus:ring-2 focus:ring-cyber-blue/10 transition-all text-foreground placeholder:text-slate-400 shadow-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-500 px-1">Email Terminal</label>
                        <input
                            type="text"
                            value={data.email}
                            onChange={(e) => onChange("email", e.target.value)}
                            placeholder="analyst@cyberspace.ai"
                            className="w-full bg-panel border-[#CBD5F5] border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyber-blue focus:ring-2 focus:ring-cyber-blue/10 transition-all text-foreground placeholder:text-slate-400 shadow-sm"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
