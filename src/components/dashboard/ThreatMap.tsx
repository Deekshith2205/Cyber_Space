"use client";

import React from "react";
import { motion } from "framer-motion";
import { Globe, MapPin, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const attacks = [
    { id: 1, country: "USA", type: "Malware", severity: "high", top: "35%", left: "20%" },
    { id: 2, country: "China", type: "DDoS", severity: "critical", top: "45%", left: "75%" },
    { id: 3, country: "Germany", type: "Phishing", severity: "medium", top: "38%", left: "48%" },
    { id: 4, country: "Russia", type: "Ransomware", severity: "critical", top: "32%", left: "65%" },
    { id: 5, country: "India", type: "Exploit", severity: "high", top: "55%", left: "68%" },
];

export default function ThreatMap() {
    return (
        <div className="glass p-6 rounded-3xl border border-white/10 h-[400px] flex flex-col relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyber-blue/10 rounded-lg text-cyber-blue">
                        <Globe size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">Global Threat Map</h3>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Real-time attack vector monitoring</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-alert-red animate-ping" />
                    <span className="text-[10px] font-bold text-alert-red uppercase tracking-wider">Live tracking</span>
                </div>
            </div>

            <div className="flex-1 relative bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-contain bg-center bg-no-repeat opacity-20 filter invert brightness-200">
                <div className="absolute inset-0 grid-background pointer-events-none" />
            </div>

            {/* Simulated attack points */}
            <div className="absolute inset-0 pointer-events-none">
                {attacks.map((attack) => (
                    <motion.div
                        key={attack.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: attack.id * 0.4 }}
                        className={`absolute w-3 h-3 rounded-full flex items-center justify-center p-1 ${attack.severity === 'critical' ? 'bg-alert-red shadow-[0_0_10px_#FF4C4C]' :
                            attack.severity === 'high' ? 'bg-orange-500 shadow-[0_0_10px_#f97316]' : 'bg-yellow-400'
                            }`}
                        style={{ top: attack.top, left: attack.left }}
                    >
                        <div className="w-1 h-1 bg-white rounded-full" />
                        <motion.div
                            animate={{ scale: [1, 4], opacity: [0.5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className={`absolute inset-0 rounded-full ${attack.severity === 'critical' ? 'bg-alert-red' : 'bg-orange-500'
                                }`}
                        />
                    </motion.div>
                ))}
            </div>

            <div className="absolute bottom-6 right-6 p-4 glass rounded-2xl border border-white/5 space-y-2 w-48 z-10">
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-2">
                    <Activity size={12} className="text-cyber-blue" />
                    Recent Incursions
                </h4>
                <div className="space-y-1">
                    {attacks.slice(0, 3).map((a) => (
                        <div key={a.id} className="flex items-center justify-between text-[10px]">
                            <span className="text-zinc-300 font-medium">{a.country}</span>
                            <span className={cn(
                                "font-bold",
                                a.severity === 'critical' ? 'text-alert-red' : 'text-orange-500'
                            )}>{a.type}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
