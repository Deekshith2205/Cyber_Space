"use client";

import React, { useEffect, useState } from "react";
import ThreatMap from "@/components/dashboard/ThreatMap";
import ThreatTrends from "@/components/dashboard/ThreatTrends";
import VulnerabilityTable from "@/components/dashboard/VulnerabilityTable";
import { Activity, ShieldAlert, Globe, Server } from "lucide-react";
import axios from "axios";

type TopCVE = { id: string; target: string; risk: number; };

export default function ThreatIntelligencePage() {
    const [topCVEs, setTopCVEs] = useState<TopCVE[]>([]);
    
    useEffect(() => {
        const fetchCVEs = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/threat/cves');
                setTopCVEs(response.data);
            } catch (error) {
                console.error('Error fetching Top CVE Targets:', error);
            }
        };
        fetchCVEs();
    }, []);
    return (
        <div className="space-y-8 pt-6 pb-12">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                    <Activity className="text-cyber-blue" />
                    Threat Intelligence Dashboard
                </h2>
                <p className="text-text-secondary text-sm">Advanced heuristic analysis and real-time global attack monitoring.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass p-8 rounded-[2rem] border border-border shadow-premium">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-cyber-blue/10 rounded-2xl text-cyber-blue shadow-sm">
                                    <Globe size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-foreground">Advanced Global Threat Map</h3>
                                    <p className="text-[10px] text-text-muted uppercase tracking-widest font-black">Intercontinental Attack Vector Analysis</p>
                                </div>
                            </div>
                            <div className="px-4 py-2 rounded-xl bg-alert-red/10 border border-alert-red/20 text-xs text-alert-red font-black uppercase tracking-widest animate-pulse">
                                High Alert Tier 1
                            </div>
                        </div>

                        <div className="h-[500px] w-full bg-foreground/5 rounded-[1.5rem] border border-border/5 relative overflow-hidden shadow-inner">
                            <ThreatMap />
                        </div>
                    </div>

                    <VulnerabilityTable />
                </div>

                <div className="lg:col-span-1 space-y-8">
                    <div className="glass p-8 rounded-[2rem] border border-border shadow-premium">
                        <h3 className="text-sm font-bold text-foreground uppercase tracking-widest mb-6 px-2">Analysis Trends</h3>
                        <ThreatTrends />
                    </div>

                    <div className="glass p-8 rounded-[2rem] border border-border space-y-6 shadow-premium">
                        <h3 className="text-sm font-bold text-foreground uppercase tracking-widest px-2">Top CVE Targets</h3>
                        <div className="space-y-4">
                            {topCVEs.length > 0 ? (
                                topCVEs.map((cve) => (
                                    <div key={cve.id} className="p-4 rounded-2xl bg-foreground/5 border border-border/10 flex items-center justify-between group cursor-pointer hover:border-cyber-blue/20 transition-all shadow-sm">
                                        <div>
                                            <h4 className="text-xs font-bold text-cyber-blue">{cve.id}</h4>
                                            <p className="text-[10px] text-text-muted uppercase tracking-widest font-black mt-1">{cve.target}</p>
                                        </div>
                                        <span className="text-xs font-black text-alert-red">{cve.risk}/100 Risk</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-xs text-text-muted animate-pulse text-center mt-6">Loading vulnerability intelligence...</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
