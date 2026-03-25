"use client";

import React from "react";
import TopNavbar from "@/components/top-navbar";
import Sidebar from "@/components/sidebar";
import AIAssistantPanel from "@/components/ai-assistant-panel";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const isPublicRoute = ['/login', '/register'].includes(pathname);

    if (isPublicRoute) {
        return (
            <div className="relative z-10 min-h-screen bg-background text-foreground">
                {children}
            </div>
        );
    }
    return (
        <div className="relative z-10 min-h-screen bg-background text-foreground transition-colors duration-300">
            <TopNavbar />
            <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
            <main className={cn(
                "pt-16 min-h-screen transition-all duration-300 grid-background",
                isCollapsed ? "pl-20" : "pl-64"
            )}>
                <div className="max-w-[1600px] mx-auto px-8">
                    {children}
                </div>
            </main>
            <AIAssistantPanel />
        </div>
    );
}
