"use client";

import React, { useEffect, useState } from "react";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";
import { TrendingUp, Activity } from "lucide-react";
import axios from 'axios';

export default function ThreatTrends() {
    const [data, setData] = useState<{name: string, threats: number}[]>([]);
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const fetchTrends = async () => {
            try {
                const token = localStorage.getItem('token');
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
                const response = await axios.get('/api/threat/trends', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(response.data);
            } catch (error) {
                console.error("Error fetching threat trends:", error);
            }
        };

        fetchTrends();
        const interval = setInterval(fetchTrends, 15000); // 15-second polling 

        // Check for theme
        const checkTheme = () => {
            setIsDark(document.documentElement.getAttribute('data-theme') === 'dark' || document.documentElement.classList.contains('dark'));
        };
        checkTheme();

        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
        
        return () => {
            clearInterval(interval);
            observer.disconnect();
        };
    }, []);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className={`p-3 rounded-xl shadow-xl text-xs border backdrop-blur-md ${isDark ? 'bg-black/90 border-cyan-500/30' : 'bg-white/90 border-zinc-200'}`}>
                    <p className={`font-bold ${isDark ? 'text-white' : 'text-zinc-800'}`}>
                        {label}: <span className="text-[#00FFFF]">{payload[0].value} threats</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="glass p-6 rounded-3xl shadow-sm border border-border h-[300px] flex flex-col group relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-lg text-[#00FFFF] shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]">Monthly Threat Trends</h3>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00FFFF] animate-pulse" /> Live Analysis
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full translate-y-2 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00FFFF" stopOpacity={isDark ? 0.4 : 0.2} />
                                <stop offset="95%" stopColor="#00FFFF" stopOpacity={0} />
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#ffffff08" : "#00000008"} vertical={false} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: isDark ? '#A8C1D9' : '#5B6B8C', fontSize: 10, fontWeight: 600 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: isDark ? '#A8C1D9' : '#5B6B8C', fontSize: 10, fontWeight: 600 }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0, 255, 255, 0.2)', strokeWidth: 2, strokeDasharray: '4 4' }} />
                        <Area
                            type="monotone"
                            dataKey="threats"
                            stroke="#00FFFF"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorThreats)"
                            animationDuration={1500}
                            style={{ filter: 'url(#glow)' }}
                            activeDot={{ r: 6, fill: "#00FFFF", stroke: "#fff", strokeWidth: 2, className: "drop-shadow-[0_0_8px_rgba(0,255,255,1)]" }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
