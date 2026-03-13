"use client";

import React from "react";
import TopNavbar from "@/components/top-navbar";
import Sidebar from "@/components/sidebar";
import AIAssistantPanel from "@/components/ai-assistant-panel";
import CyberBackground from "@/components/ui/CyberBackground";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative z-10 min-h-screen bg-background text-foreground transition-colors duration-300">
            <TopNavbar />
            <Sidebar />
            <main className="pl-64 pr-80 pt-16 min-h-screen transition-all duration-300 grid-background">
                <div className="max-w-[1600px] mx-auto px-8">
                    {children}
                </div>
            </main>
            <AIAssistantPanel />
            <CyberBackground />
        </div>
    );
}
