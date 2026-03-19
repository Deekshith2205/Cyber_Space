"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/login?mode=register');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#0B0F14] relative overflow-hidden">
            <div className="absolute inset-0 grid-background opacity-20 pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-cyber-blue animate-spin" />
                <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase">Redirecting to Secure Registration...</p>
            </div>
        </div>
    );
}
