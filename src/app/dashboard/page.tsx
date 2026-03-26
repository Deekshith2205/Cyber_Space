"use client";

import React, { useEffect, useState } from "react";
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
import VulnerabilityPreview from "@/components/dashboard/VulnerabilityPreview";
import ThreatTrends from "@/components/dashboard/ThreatTrends";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import axios from "axios";

interface ScanStats {
    vulnerabilities: {
        total: number;
        critical: number;
        medium: number;
        low: number;
        lastScan: string | null;
    };
    phishing: {
        total: number;
        malicious: number;
        safe: number;
        lastScan: string | null;
    };
}

interface LatestVuln {
    latest_target: string;
    severity: string;
    latest_result: string;
    createdAt: string;
}

interface LatestPhish {
    latest_url: string;
    status: string;
    result: string;
    detectedAt: string;
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<ScanStats>({
        vulnerabilities: { total: 0, critical: 0, medium: 0, low: 0, lastScan: null },
        phishing: { total: 0, malicious: 0, safe: 0, lastScan: null }
    });
    const [latestVuln, setLatestVuln] = useState<LatestVuln | null>(null);
    const [latestPhish, setLatestPhish] = useState<LatestPhish | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [vulnStats, phishStats, vulnLatest, phishLatest] = await Promise.all([
                axios.get('/api/vulnerabilities/stats', { headers }),
                axios.get('/api/phishing/stats', { headers }),
                axios.get('/api/vulnerabilities/latest', { headers }),
                axios.get('/api/phishing/latest', { headers })
            ]);

            setStats({
                vulnerabilities: {
                    total: vulnStats.data.total_vulnerabilities,
                    critical: vulnStats.data.critical_count,
                    medium: vulnStats.data.medium_count,
                    low: vulnStats.data.low_count,
                    lastScan: vulnStats.data.last_scanned_at
                },
                phishing: {
                    total: phishStats.data.total_links_scanned,
                    malicious: phishStats.data.malicious_links_count,
                    safe: phishStats.data.safe_links_count,
                    lastScan: phishStats.data.last_scanned_at
                }
            });

            setLatestVuln(vulnLatest.data);
            setLatestPhish(phishLatest.data);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // Poll every 10 seconds
        return () => clearInterval(interval);
    }, []);

    const getTimeAgo = (dateStr: string) => {
        if (!dateStr) return "";
        const diffMs = Date.now() - new Date(dateStr).getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        return `${Math.floor(diffMins / 60)}h ago`;
    };

    const getLastScanText = () => {
        const dates = [stats.vulnerabilities.lastScan, stats.phishing.lastScan]
            .filter(d => d !== null)
            .map(d => new Date(d!).getTime());
        
        if (dates.length === 0) return "No scans yet";
        
        const mostRecent = Math.max(...dates);
        const diffMs = Date.now() - mostRecent;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins} mins ago`;
        return `${Math.floor(diffMins / 60)} hours ago`;
    };

    return (
        <div className="space-y-6 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-3 text-glow-primary">
                        Security Overview
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-success-green/10 text-[10px] text-success-green font-bold uppercase tracking-widest shadow-premium border border-success-green/20">
                            {stats.vulnerabilities.critical > 0 ? 'Risk Detected' : 'System Secure'}
                        </span>
                    </h2>
                    <p className="text-text-secondary text-sm mt-1">
                        Welcome back, {user?.name || 'Agent'}. Your security posture is currently {stats.vulnerabilities.critical > 0 ? 'at risk' : 'optimal'}.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-text-secondary uppercase tracking-widest bg-foreground/5 px-4 py-2 rounded-2xl shadow-premium border border-border">
                    <History size={14} className="text-cyber-blue drop-shadow-[0_0_5px_rgba(0,180,255,0.2)]" />
                    Last Scan: {loading ? "..." : getLastScanText()}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Critical Vulnerabilities"
                    value={loading ? "..." : stats.vulnerabilities.critical.toLocaleString()}
                    icon={ShieldAlert}
                    trend="Real-time"
                    trendUp={false}
                    color="red"
                >
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold text-text-secondary">
                            <span>Latest Scan</span>
                            <span className="text-cyber-blue">{latestVuln ? getTimeAgo(latestVuln.createdAt) : ""}</span>
                        </div>
                        {latestVuln ? (
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-foreground truncate" title={latestVuln.latest_target}>
                                    {latestVuln.latest_target}
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter",
                                        latestVuln.severity.toLowerCase() === 'critical' ? 'bg-alert-red/20 text-alert-red' : 'bg-neon-purple/20 text-neon-purple'
                                    )}>
                                        {latestVuln.severity}
                                    </span>
                                    <span className="text-[10px] text-text-secondary truncate italic">
                                        {latestVuln.latest_result}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-[10px] text-text-secondary italic">No scans recorded yet</p>
                        )}
                    </div>
                </StatCard>

                <StatCard
                    label="Phishing Links Detected"
                    value={loading ? "..." : stats.phishing.malicious.toLocaleString()}
                    icon={Link2}
                    trend="Aggregated"
                    trendUp={true}
                    color="blue"
                >
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold text-text-secondary">
                            <span>Latest Analysis</span>
                            <span className="text-cyber-blue">{latestPhish ? getTimeAgo(latestPhish.detectedAt) : ""}</span>
                        </div>
                        {latestPhish ? (
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-foreground truncate" title={latestPhish.latest_url}>
                                    {latestPhish.latest_url}
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter",
                                        latestPhish.status.toLowerCase() === 'malicious' ? 'bg-alert-red/20 text-alert-red' : 'bg-success-green/20 text-success-green'
                                    )}>
                                        {latestPhish.status}
                                    </span>
                                    <span className="text-[10px] text-text-secondary truncate italic">
                                        {latestPhish.result}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-[10px] text-text-secondary italic">No links analyzed yet</p>
                        )}
                    </div>
                </StatCard>

                <StatCard
                    label="Active AI Queries"
                    value="3,211"
                    icon={Activity}
                    trend="Global"
                    trendUp={true}
                    color="purple"
                />
                <StatCard
                    label="Security Score"
                    value={stats.vulnerabilities.critical > 0 ? "78%" : "98%"}
                    icon={ShieldCheck}
                    trend="Auto-calc"
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
                <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest px-1">Quick Actions</h3>
                <QuickActions />
            </div>

            {/* Table Section */}
            <div className="pb-8">
                <VulnerabilityPreview />
            </div>
        </div>
    );
}
