"use client";

import React, { Suspense } from 'react';
import SlidingAuth from '@/components/auth/sliding-auth';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#0B0F14] relative overflow-hidden">
            {/* Cyber Background Effects */}
            <div className="absolute inset-0 grid-background opacity-20 pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-blue/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-purple/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 w-full flex flex-col items-center">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2 text-glow-primary">CYBERSPACE</h1>
                    <p className="text-zinc-500 font-mono text-[10px] tracking-[0.2em] uppercase">Command Center Authorization</p>
                </div>
                
                <Suspense fallback={
                    <div className="glass-premium w-full max-w-4xl h-[600px] rounded-[30px] flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-cyber-blue animate-spin" />
                    </div>
                }>
                    <SlidingAuth />
                </Suspense>

                <div className="mt-8 flex justify-between w-full max-w-4xl px-2">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-success-green animate-pulse" />
                        SECURE PROTOCOL ACTIVE
                    </div>
                    <div className="text-[10px] font-mono text-zinc-600">
                        ESTABLISHING HANDSHAKE...
                    </div>
                </div>
            </div>
        </div>
    );
}
