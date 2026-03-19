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
    ChevronRight,
    LogOut
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/lib/store/auth-slice";

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

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        router.push('/login');
    };

    return (
        <aside
            className={cn(
                "fixed left-0 top-16 bottom-0 z-40 bg-panel transition-all duration-300 ease-in-out shadow-depth",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            <div className="flex flex-col h-full py-6">
                <div className="flex-1 space-y-1.5 px-3">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative group",
                                    isActive
                                        ? "bg-cyber-blue/15 text-cyber-blue dark:shadow-[inset_0_0_20px_rgba(0,229,255,0.15),0_0_15px_rgba(0,229,255,0.1)] border-none"
                                        : "text-foreground/70 hover:text-cyber-blue hover:bg-foreground/5"
                                )}
                            >
                                <item.icon size={20} className={cn(
                                    "transition-all duration-200",
                                    isActive ? "filter drop-shadow-[0_0_5px_var(--cyber-blue)]" : "group-hover:scale-110"
                                )} />
                                {!isCollapsed && (
                                    <span className={cn(
                                        "text-sm font-medium whitespace-nowrap transition-all duration-200",
                                        isActive ? "text-cyber-blue font-semibold" : "group-hover:translate-x-1"
                                    )}>{item.label}</span>
                                )}
                                {isCollapsed && (
                                    <div className="absolute left-full ml-4 px-3 py-2 bg-panel backdrop-blur-md rounded-lg text-xs text-foreground opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-depth border border-border">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </div>

                <div className="px-3 mt-auto">
                    {!isCollapsed && (
                        <div className="p-4 rounded-2xl glass mb-4 shadow-depth border-none bg-panel-secondary/50">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Security Score</span>
                                <span className="text-xs font-bold text-success-green text-glow-blue">92%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden shadow-inset-deep">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "92%" }}
                                    className="h-full bg-success-green shadow-[0_0_15px_#00FF9C]"
                                />
                            </div>
                        </div>
                    )}
 
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-all mb-2 group"
                    >
                        <LogOut size={20} className="group-hover:drop-shadow-[0_0_8px_rgba(255,76,76,0.6)]" />
                        {!isCollapsed && <span className="text-sm font-medium">Clearance Exit (Logout)</span>}
                    </button>

                    <button
                        onClick={onToggle}
                        className="w-full flex items-center justify-center p-3 rounded-xl text-slate-500 hover:text-foreground hover:bg-panel-secondary transition-all"
                    >
                        {isCollapsed ? <ChevronRight size={20} /> : (
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
