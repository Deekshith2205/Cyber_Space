"use client";

import React from "react";
import { motion } from "framer-motion";
import { Globe, MapPin, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

import { useEffect, useState } from "react";
import axios from 'axios';

type Attack = {
    id: number;
    country: string;
    type: string;
    severity: string;
    top: string;
    left: string;
};

export default function ThreatMap() {
    const [attacks, setAttacks] = useState<Attack[]>([]);
    
    useEffect(() => {
        const fetchThreats = async () => {
            try {
                // Fetch from the backend we just built
                const response = await axios.get('http://localhost:5000/api/threat/map');
                setAttacks(response.data);
            } catch (error) {
                console.error("Error fetching threat map data:", error);
                setAttacks([]);
            }
        };

        fetchThreats();
        const interval = setInterval(fetchThreats, 60000); // refresh every minute

        return () => clearInterval(interval);
    }, []);
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

            <div className="flex-1 w-full relative h-[300px] my-auto">
                {/* Glowing Cyber Map Mask */}
                <div 
                    className="absolute inset-0 bg-cyber-blue/20"
                    style={{
                        maskImage: `url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')`,
                        WebkitMaskImage: `url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')`,
                        maskSize: 'contain',
                        WebkitMaskSize: 'contain',
                        maskPosition: 'center',
                        WebkitMaskPosition: 'center',
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat',
                    }}
                />
                
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            {/* Live Attack Points */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="relative w-full h-full max-w-[800px] mx-auto">
                    {attacks.map((attack) => (
                        <motion.div
                            key={attack.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 3, repeat: Infinity, delay: attack.id * 0.5, ease: "easeInOut" }}
                            className={`absolute w-3 h-3 rounded-full flex items-center justify-center ${attack.severity === 'critical' ? 'bg-alert-red/20 shadow-[0_0_10px_#FF4C4C]' :
                                attack.severity === 'high' ? 'bg-orange-500/20 shadow-[0_0_10px_#f97316]' : 'bg-yellow-400/20'
                                }`}
                            style={{ top: attack.top, left: attack.left, transform: 'translate(-50%, -50%)' }}
                        >
                            <div className={`w-1 h-1 rounded-full ${attack.severity === 'critical' ? 'bg-alert-red' : 'bg-orange-500'}`} />
                            
                            {/* Ripple Effect */}
                            <motion.div
                                animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: attack.id * 0.5 }}
                                className={`absolute inset-0 rounded-full border border-solid ${attack.severity === 'critical' ? 'border-alert-red bg-alert-red/20' : 'border-orange-500 bg-orange-500/20'
                                    }`}
                            />
                        </motion.div>
                    ))}
                </div>
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
