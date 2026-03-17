"use client";

import React from "react";
import {
    ShieldCheck,
    ShieldAlert,
    Link2,
    Activity,
    History
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import QuickActions from "@/components/dashboard/QuickActions";
import ThreatMap from "@/components/dashboard/ThreatMap";
import VulnerabilityTable from "@/components/dashboard/VulnerabilityTable";
import ThreatTrends from "@/components/dashboard/ThreatTrends";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
    const { user } = useAuth();
    return (
        <div className="space-y-6 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                        Security Overview
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success-green/10 border border-success-green/20 text-[10px] text-success-green font-bold uppercase tracking-widest">
                            System Secure
                        </span>
                    </h2>
                    <p className="text-zinc-500 text-sm mt-1">
                        Welcome back, {user?.name || 'Agent'}. Your security posture is currently optimal.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                    <History size={14} className="text-cyber-blue" />
                    Last Scan: 2 mins ago
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Critical Vulnerabilities"
                    value="1,248"
                    icon={ShieldAlert}
                    trend="18%"
                    trendUp={false}
                    color="red"
                />
                <StatCard
                    label="Phishing Links Detected"
                    value="5,932"
                    icon={Link2}
                    trend="12%"
                    trendUp={true}
                    color="blue"
                />
                <StatCard
                    label="Active Security Alerts"
                    value="3,211"
                    icon={Activity}
                    trend="26%"
                    trendUp={true}
                    color="purple"
                />
                <StatCard
                    label="System Security Score"
                    value="92%"
                    icon={ShieldCheck}
                    trend="4%"
                    trendUp={true}
                    color="green"
                />
            </div>

            {/* Map and Feed Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ThreatMap />
                </div>
                <div className="lg:col-span-1">
                    <ThreatTrends />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest px-1">Quick Actions</h3>
                <QuickActions />
            </div>

            {/* Table Section */}
            <div className="pb-8">
                <VulnerabilityTable />
            </div>
        </div>
    );
}
