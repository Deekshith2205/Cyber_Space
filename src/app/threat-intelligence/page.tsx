"use client";

import React from "react";
import ThreatMap from "@/components/dashboard/ThreatMap";
import ThreatTrends from "@/components/dashboard/ThreatTrends";
import VulnerabilityTable from "@/components/dashboard/VulnerabilityTable";
import { Activity, ShieldAlert, Globe, Server } from "lucide-react";

export default function ThreatIntelligencePage() {
    return (
        <div className="space-y-8 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-12">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-black text-white tracking-tight">Threat Intelligence Dashboard</h2>
                <p className="text-zinc-500 text-sm">Advanced heuristic analysis and real-time global attack monitoring.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass p-8 rounded-[2rem] border border-white/10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-cyber-blue/10 rounded-2xl text-cyber-blue glow-blue">
                                    <Globe size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Advanced Global Threat Map</h3>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Intercontinental Attack Vector Analysis</p>
                                </div>
                            </div>
                            <div className="px-4 py-2 rounded-xl bg-alert-red/10 border border-alert-red/20 text-xs text-alert-red font-black uppercase tracking-widest animate-pulse">
                                High Alert Tier 1
                            </div>
                        </div>

                        <div className="h-[500px] w-full bg-white/5 rounded-[1.5rem] border border-white/5 relative overflow-hidden">
                            <ThreatMap />
                        </div>
                    </div>

                    <VulnerabilityTable />
                </div>

                <div className="lg:col-span-1 space-y-8">
                    <div className="glass p-8 rounded-[2rem] border border-white/10">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 px-2">Analysis Trends</h3>
                        <ThreatTrends />
                    </div>

                    <div className="glass p-8 rounded-[2rem] border border-white/10 space-y-6">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest px-2">Top CVE Targets</h3>
                        <div className="space-y-4">
                            {[
                                { id: "CVE-2025-001", target: "Web Infrastructure", risk: "98/100" },
                                { id: "CVE-2025-002", target: "Kubernetes Cluster", risk: "92/100" },
                                { id: "CVE-2025-003", target: "DDoS Mitigation", risk: "89/100" }
                            ].map((cve) => (
                                <div key={cve.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group cursor-pointer hover:border-cyber-blue/20 transition-all">
                                    <div>
                                        <h4 className="text-xs font-bold text-cyber-blue">{cve.id}</h4>
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">{cve.target}</p>
                                    </div>
                                    <span className="text-xs font-black text-alert-red">{cve.risk} Risk</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
