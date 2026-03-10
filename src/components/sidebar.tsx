"use client";

import React, { useState } from "react";
import {
    LayoutDashboard,
    ShieldAlert,
    Link2,
    Bot,
    FolderSearch,
    Activity,
    ClipboardList,
    GraduationCap,
    Settings,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", id: "dashboard", href: "/dashboard" },
    { icon: ShieldAlert, label: "Vulnerability Scanner", id: "scanner", href: "/vulnerability-scanner" },
    { icon: Link2, label: "Phishing Link Checker", id: "phishing", href: "/phishing-checker" },
    { icon: Bot, label: "AI Cyber Assistant", id: "ai-assistant", href: "/ai-assistant" },
    { icon: FolderSearch, label: "Resource Directory", id: "resources", href: "/resource-directory" },
    { icon: Activity, label: "Threat Intelligence", id: "intelligence", href: "/threat-intelligence" },
    { icon: ClipboardList, label: "Incident Report", id: "report", href: "/incident-report" },
    { icon: GraduationCap, label: "Cyber Awareness Hub", id: "awareness", href: "/awareness-hub" },
    { icon: Settings, label: "Settings", id: "settings", href: "/settings" },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "fixed left-0 top-16 bottom-0 z-40 glass border-r border-white/10 transition-all duration-300 ease-in-out",
                collapsed ? "w-20" : "w-64"
            )}
        >
            <div className="flex flex-col h-full py-6">
                <div className="flex-1 space-y-2 px-3">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative group",
                                    isActive
                                        ? "bg-cyber-blue/10 text-cyber-blue glow-blue border border-cyber-blue/20 backdrop-blur-md"
                                        : "text-zinc-500 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <item.icon size={22} className={cn(
                                    "transition-all",
                                    isActive ? "glow-blue" : "group-hover:scale-110"
                                )} />
                                {!collapsed && (
                                    <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                                )}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="absolute left-0 w-1 h-6 bg-cyber-blue rounded-r-full shadow-[0_0_10px_#00E5FF]"
                                    />
                                )}
                                {collapsed && (
                                    <div className="absolute left-full ml-4 px-3 py-2 bg-[#0B0F14] border border-white/10 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-xl">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </div>

                <div className="px-3 mt-auto">
                    <div className={cn(
                        "p-4 rounded-2xl glass mb-4 border border-white/5",
                        collapsed ? "hidden" : "block"
                    )}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Security Score</span>
                            <span className="text-xs font-bold text-success-green">92%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "92%" }}
                                className="h-full bg-success-green shadow-[0_0_10px_#00FF9C]"
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full flex items-center justify-center p-3 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                    >
                        {collapsed ? <ChevronRight size={20} /> : (
                            <div className="flex items-center gap-2">
                                <ChevronLeft size={20} />
                                <span className="text-sm font-medium">Collapse Menu</span>
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </aside>
    );
}
