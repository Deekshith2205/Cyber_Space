"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';

const PUBLIC_ROUTES = ['/login', '/register'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (!isAuthenticated && !token && !PUBLIC_ROUTES.includes(pathname)) {
            router.push('/login');
        } else if (isAuthenticated && token && PUBLIC_ROUTES.includes(pathname)) {
            router.push('/dashboard');
        } else {
            setIsChecking(false);
        }
    }, [isAuthenticated, token, pathname, router]);

    if (isChecking && !PUBLIC_ROUTES.includes(pathname)) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0B0F14]">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-cyber-blue border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-cyber-blue font-mono animate-pulse">VERIFYING CREDENTIALS...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
