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
}

const colorMap = {
    blue: "from-cyber-blue/20 to-transparent text-cyber-blue border-cyber-blue/20",
    purple: "from-neon-purple/20 to-transparent text-neon-purple border-neon-purple/20",
    red: "from-alert-red/20 to-transparent text-alert-red border-alert-red/20",
    green: "from-success-green/20 to-transparent text-success-green border-success-green/20",
};

const glowMap = {
    blue: "group-hover:shadow-[0_0_20px_rgba(0,229,255,0.2)]",
    purple: "group-hover:shadow-[0_0_20px_rgba(122,92,255,0.2)]",
    red: "group-hover:shadow-[0_0_20px_rgba(255,76,76,0.2)]",
    green: "group-hover:shadow-[0_0_20px_rgba(0,255,156,0.2)]",
};

export default function StatCard({ label, value, icon: Icon, trend, trendUp, color }: StatCardProps) {
    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className={cn(
                "glass p-6 rounded-3xl border border-white/10 group transition-all duration-300 relative overflow-hidden",
                glowMap[color]
            )}
        >
            <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity",
                colorMap[color]
            )} />

            <div className="relative z-10 flex items-start justify-between mb-4">
                <div className={cn(
                    "p-3 rounded-2xl bg-white/5 border border-white/10 transition-colors group-hover:border-current",
                    color === 'blue' && "group-hover:text-cyber-blue",
                    color === 'purple' && "group-hover:text-neon-purple",
                    color === 'red' && "group-hover:text-alert-red",
                    color === 'green' && "group-hover:text-success-green",
                )}>
                    <Icon size={24} />
                </div>
                <div className={cn(
                    "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-white/5 border border-white/10",
                    trendUp ? "text-success-green" : "text-alert-red"
                )}>
                    {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {trend}
                </div>
            </div>

            <div className="relative z-10">
                <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</h3>
                <p className="text-3xl font-black text-white tracking-tight">{value}</p>
            </div>

            {/* Modern cyber line effect */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5 overflow-hidden">
                <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className={cn(
                        "w-1/3 h-full",
                        color === 'blue' && "bg-cyber-blue shadow-[0_0_10px_#00E5FF]",
                        color === 'purple' && "bg-neon-purple shadow-[0_0_10px_#7A5CFF]",
                        color === 'red' && "bg-alert-red shadow-[0_0_10px_#FF4C4C]",
                        color === 'green' && "bg-success-green shadow-[0_0_10px_#00FF9C]",
                    )}
                />
            </div>
        </motion.div>
    );
}
