"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Globe, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from 'axios';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type Attack = {
    id: number;
    ip?: string;
    country: string;
    type: string;
    severity: string;
    lat: number;
    lng: number;
    threatScore?: number;
};

export default function ThreatMap() {
    const [attacks, setAttacks] = useState<Attack[]>([]);
    const [hoveredPoint, setHoveredPoint] = useState<Attack | null>(null);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchThreats = async () => {
            try {
                // Fetch from the backend we just built
                // We'll use the environment base URL or a relative path
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
                const token = localStorage.getItem('token');
                
                const response = await axios.get(`${baseUrl}/threat/map`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // Ensure data falls back gracefully if array structure is unexpected
                if (Array.isArray(response.data)) {
                    setAttacks(response.data);
                } else {
                    setAttacks([]);
                }
                setIsError(false);
            } catch (error) {
                console.error("Error fetching threat map data:", error);
                setIsError(true);
            }
        };

        fetchThreats();
        const interval = setInterval(fetchThreats, 10000); // refresh every 10 seconds as requested

        return () => clearInterval(interval);
    }, []);

    const recentIncursions = useMemo(() => attacks.slice(0, 3), [attacks]);

    return (
        <div className="glass p-6 rounded-3xl shadow-depth border-none h-[400px] flex flex-col relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyber-blue/10 rounded-lg text-cyber-blue">
                        <Globe size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">Global Threat Map</h3>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Real-time IP threat intelligence</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full shadow-depth">
                    {isError ? (
                        <>
                            <span className="w-2 h-2 rounded-full bg-yellow-500" />
                            <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-wider">Data Unavailable</span>
                        </>
                    ) : (
                        <>
                            <span className="w-2 h-2 rounded-full bg-alert-red animate-ping" />
                            <span className="text-[10px] font-bold text-alert-red uppercase tracking-wider">Live System</span>
                        </>
                    )}
                </div>
            </div>

            <div className="flex-1 w-full relative h-[300px] my-auto overflow-hidden">
                <ComposableMap 
                    projectionConfig={{ scale: 140 }}
                    style={{
                        width: "100%",
                        height: "100%",
                        maskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 70%, transparent 100%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 70%, transparent 100%)'
                    }}
                >
                    <Geographies geography={geoUrl}>
                        {({ geographies }: { geographies: any[] }) =>
                            geographies.map((geo: any) => (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill="rgba(14, 165, 233, 0.1)" // subtle cyber-blue
                                    stroke="rgba(255, 255, 255, 0.05)"
                                    strokeWidth={0.5}
                                    style={{
                                        default: { outline: "none" },
                                        hover: { fill: "rgba(14, 165, 233, 0.2)", outline: "none" },
                                        pressed: { outline: "none" },
                                    }}
                                />
                            ))
                        }
                    </Geographies>

                    {attacks.map((attack) => (
                        <Marker 
                            key={attack.id} 
                            coordinates={[attack.lng, attack.lat]}
                            onMouseEnter={() => setHoveredPoint(attack)}
                            onMouseLeave={() => setHoveredPoint(null)}
                        >
                            <motion.circle
                                initial={{ r: 0, opacity: 0 }}
                                animate={{ r: 4, opacity: 1 }}
                                className={cn(
                                    "cursor-pointer",
                                    attack.severity === 'critical' ? 'fill-alert-red drop-shadow-[0_0_8px_#FF4C4C]' : 
                                    attack.severity === 'high' ? 'fill-orange-500 drop-shadow-[0_0_8px_#f97316]' : 'fill-yellow-400 drop-shadow-[0_0_8px_#facc15]'
                                )}
                            />
                            
                            {/* Pulse underlying circle */}
                            <motion.circle
                                animate={{ r: [4, 15], opacity: [0.6, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: attack.id * 0.1 }}
                                className={cn(
                                    "pointer-events-none fill-transparent stroke-[1.5px]",
                                    attack.severity === 'critical' ? 'stroke-alert-red' : 
                                    attack.severity === 'high' ? 'stroke-orange-500' : 'stroke-yellow-400'
                                )}
                            />
                        </Marker>
                    ))}
                </ComposableMap>

                {hoveredPoint && (
                    <div 
                        className="absolute bottom-4 left-4 p-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl text-xs z-20 shadow-xl"
                        style={{ pointerEvents: 'none' }}
                    >
                        <div className="font-bold text-white mb-1">IP: <span className="text-cyber-blue font-mono">{hoveredPoint.ip || 'Unknown'}</span></div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-zinc-400">
                            <div>Country: <span className="text-zinc-200">{hoveredPoint.country}</span></div>
                            <div>Score: <span className="text-alert-red font-bold">{hoveredPoint.threatScore}%</span></div>
                            <div>Type: <span className="text-zinc-200">{hoveredPoint.type}</span></div>
                            <div>Severity: <span className="uppercase text-orange-500 font-bold">{hoveredPoint.severity}</span></div>
                        </div>
                    </div>
                )}
            </div>

            <div className="absolute bottom-6 right-6 p-4 glass rounded-2xl shadow-depth border-none space-y-2 w-48 z-10 pointer-events-none">
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-2">
                    <Activity size={12} className="text-cyber-blue" />
                    Recent Intel
                </h4>
                <div className="space-y-1">
                    {recentIncursions.map((a) => (
                        <div key={a.id} className="flex items-center justify-between text-[10px]">
                            <span className="text-zinc-300 font-medium truncate max-w-[80px]" title={a.ip}>{a.ip || a.country}</span>
                            <span className={cn(
                                "font-bold",
                                a.severity === 'critical' ? 'text-alert-red' : 'text-orange-500'
                            )}>{a.type}</span>
                        </div>
                    ))}
                    {recentIncursions.length === 0 && !isError && (
                        <div className="text-[10px] text-zinc-500">Scanning for threats...</div>
                    )}
                </div>
            </div>
        </div>
    );
}
