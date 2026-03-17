"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Shield, Lock, Mail, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(email, password);
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#0B0F14] relative overflow-hidden">
            {/* Cyber Background Effects */}
            <div className="absolute inset-0 grid-background opacity-20 pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-blue/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-purple/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyber-blue to-cyber-purple p-[1px] mb-6 shadow-[0_0_30px_rgba(0,243,255,0.2)]">
                        <div className="w-full h-full bg-[#0B0F14] rounded-[15px] flex items-center justify-center">
                            <Shield className="w-10 h-10 text-cyber-blue" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2">CYBERSPACE</h1>
                    <p className="text-gray-400 font-mono text-sm tracking-widest uppercase">Command Center Login</p>
                </div>

                <div className="bg-[#15191E] border border-white/5 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 animate-shake">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-200">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-mono uppercase text-gray-500 tracking-wider">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cyber-blue transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#0B0F14] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-cyber-blue/50 focus:ring-1 focus:ring-cyber-blue/30 transition-all font-sans"
                                    placeholder="agent@cyberspace.ai"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono uppercase text-gray-500 tracking-wider">Security Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cyber-blue transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#0B0F14] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-cyber-blue/50 focus:ring-1 focus:ring-cyber-blue/30 transition-all font-sans"
                                    placeholder="••••••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-cyber-blue to-cyber-purple text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 group hover:shadow-[0_0_25px_rgba(0,243,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    ACCESS COMMAND CENTER
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-gray-500 text-sm">
                            New analyst?{" "}
                            <Link href="/register" className="text-cyber-blue hover:text-cyber-blue/80 transition-colors font-semibold">
                                Request clearance
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex justify-between px-2">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-gray-600">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        ENCRYPTED SESSION ACTIVE
                    </div>
                    <div className="text-[10px] font-mono text-gray-600">
                        VER 2.0.4 - SYSTEM SECURE
                    </div>
                </div>
            </div>
        </div>
    );
}
