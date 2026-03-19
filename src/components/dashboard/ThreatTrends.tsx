"use client";

import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";
import { TrendingUp } from "lucide-react";

import { useEffect, useState } from "react";
import axios from 'axios';

export default function ThreatTrends() {
    const [data, setData] = useState<{name: string, threats: number}[]>([]);

    useEffect(() => {
        const fetchTrends = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/threat/trends');
                setData(response.data);
            } catch (error) {
                console.error("Error fetching threat trends:", error);
            }
        };

        fetchTrends();
    }, []);
    return (
        <div className="glass p-6 rounded-3xl shadow-depth border-none h-[300px] flex flex-col group">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-neon-purple/10 rounded-lg text-neon-purple shadow-[0_0_10px_rgba(122,92,255,0.2)]">
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white text-glow-primary">Monthly Threat Trends</h3>
                        <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold">Heuristic analysis projection</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full translate-y-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#7A5CFF" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#7A5CFF" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#A8C1D9', fontSize: 10, fontWeight: 600 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#A8C1D9', fontSize: 10, fontWeight: 600 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(11, 15, 20, 0.95)',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '10px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
                            }}
                            itemStyle={{ color: '#00E5FF' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="threats"
                            stroke="#7A5CFF"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorThreats)"
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
