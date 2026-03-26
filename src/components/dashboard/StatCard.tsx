"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend: string;
    trendUp?: boolean;
    color: "blue" | "purple" | "red" | "green";
    children?: React.ReactNode;
}

const colorMap = {
    blue: "from-cyber-blue/20 to-transparent text-cyber-blue shadow-[0_0_15px_rgba(0,229,255,0.1)]",
    purple: "from-neon-purple/20 to-transparent text-neon-purple shadow-[0_0_15px_rgba(122,92,255,0.1)]",
    red: "from-alert-red/20 to-transparent text-alert-red shadow-[0_0_15px_rgba(255,76,76,0.1)]",
    green: "from-success-green/20 to-transparent text-success-green shadow-[0_0_15px_rgba(0,255,156,0.1)]",
};

const glowMap = {
    blue: "group-hover:shadow-[0_0_20px_rgba(0,229,255,0.2)]",
    purple: "group-hover:shadow-[0_0_20px_rgba(122,92,255,0.2)]",
    red: "group-hover:shadow-[0_0_20px_rgba(255,76,76,0.2)]",
    green: "group-hover:shadow-[0_0_20px_rgba(0,255,156,0.2)]",
};

export default function StatCard({ label, value, icon: Icon, trend, trendUp, color, children }: StatCardProps) {
    return (
        <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            className={cn(
                "glass p-6 rounded-3xl group transition-all duration-400 relative overflow-hidden shadow-depth border-none",
                glowMap[color]
            )}
        >
            <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 dark:group-hover:opacity-100 transition-opacity",
                colorMap[color]
            )} />

            <div className="relative z-10 flex items-start justify-between mb-4">
                <div className={cn(
                    "p-3 rounded-2xl bg-foreground/5 transition-all shadow-sm group-hover:scale-110",
                    color === 'blue' && "group-hover:text-cyber-blue",
                    color === 'purple' && "group-hover:text-neon-purple",
                    color === 'red' && "group-hover:text-alert-red",
                    color === 'green' && "group-hover:text-success-green",
                )}>
                    <Icon size={24} />
                </div>
                <div className={cn(
                    "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-foreground/5 shadow-sm",
                    trendUp ? "text-success-green" : "text-alert-red"
                )}>
                    {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {trend}
                </div>
            </div>

            <div className="relative z-10">
                <h3 className="text-text-secondary text-xs font-bold uppercase tracking-widest mb-1">{label}</h3>
                <p className="text-4xl font-black text-foreground tracking-tight text-glow-metric">{value}</p>
                {children && (
                    <div className="mt-4 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-500">
                        {children}
                    </div>
                )}
            </div>

            {/* Modern cyber line effect */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground/5 overflow-hidden">
                <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className={cn(
                        "w-1/3 h-full",
                        color === 'blue' && "bg-cyber-blue shadow-[0_0_15px_var(--cyber-blue)]",
                        color === 'purple' && "bg-neon-purple shadow-[0_0_15px_#7A5CFF]",
                        color === 'red' && "bg-alert-red shadow-[0_0_15px_#FF4C4C]",
                        color === 'green' && "bg-success-green shadow-[0_0_15px_#00FF9C]",
                    )}
                />
            </div>
        </motion.div>
    );
}
