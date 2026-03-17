"use client";

import React, { useState, useEffect } from "react";
import { Settings, User, Bell, Shield, Eye, Database, Save, ChevronRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Import Settings Components
import ProfileSettings from "@/components/settings/profile-settings";
import NotificationSettings from "@/components/settings/notification-settings";
import SecuritySettings from "@/components/settings/security-settings";
import AppearanceSettings from "@/components/settings/appearance-settings";
import DataManagementSettings from "@/components/settings/data-management-settings";

import { useAuth } from "@/context/AuthContext";

const TABS = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security & Privacy", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Eye },
    { id: "data", label: "Data Management", icon: Database }
];

const DEFAULT_SETTINGS = {
    profile: {
        displayName: "",
        email: "",
        designation: "user"
    },
    notifications: {
        threatAlerts: true,
        scanCompletion: true,
        weeklyReports: false,
        cveUpdates: true
    },
    security: {
        twoFactorAuth: true,
        encryptedLogs: true,
        autoThreatPurge: false,
        secureSessionLock: true
    },
    appearance: {
        systemTheme: true // true = dark
    }
};

export default function SettingsPage() {
    const { user, updateProfile } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");
    const [isSaving, setIsSaving] = useState(false);
    const [settings, setSettings] = useState({
        ...DEFAULT_SETTINGS,
        profile: {
            displayName: user?.name || "",
            email: user?.email || "",
            designation: user?.designation || "user"
        }
    });
    const [showToast, setShowToast] = useState(false);

    // Sync settings with user data when it loads
    useEffect(() => {
        if (user) {
            setSettings(prev => ({
                ...prev,
                profile: {
                    displayName: user.name,
                    email: user.email,
                    designation: user.designation || "user"
                }
            }));
        }
    }, [user]);

    // Load settings from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("cyberspace_settings");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSettings(prev => ({
                    ...prev,
                    ...parsed,
                    profile: {
                        displayName: user?.name || prev.profile.displayName,
                        email: user?.email || prev.profile.email,
                        designation: user?.designation || prev.profile.designation || "user"
                    }
                }));
            } catch (e) {
                console.error("Failed to parse settings", e);
            }
        }

        // Initialize theme
        const theme = localStorage.getItem("theme");
        if (theme === "light") {
            document.documentElement.classList.remove("dark");
            document.documentElement.classList.add("light");
        } else {
            document.documentElement.classList.add("dark");
            document.documentElement.classList.remove("light");
        }
    }, [user]);

    const isDirty = user && (
        settings.profile.displayName !== user.name || 
        settings.profile.email !== user.email ||
        settings.profile.designation !== (user.designation || "user")
    );

    const handleSettingChange = (category: string, field: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category as keyof typeof prev],
                [field]: value
            }
        }));
    };

    const saveSettings = async () => {
        if (!settings.profile.displayName.trim()) {
            alert("Name cannot be empty");
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(settings.profile.email)) {
            alert("Please enter a valid email address");
            return;
        }

        if (settings.profile.designation.length < 3) {
            alert("Designation must be at least 3 characters long");
            return;
        }

        setIsSaving(true);
        try {
            await updateProfile(
                settings.profile.displayName, 
                settings.profile.email, 
                settings.profile.designation
            );
            localStorage.setItem("cyberspace_settings", JSON.stringify(settings));
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (error: any) {
            alert(error.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "cyberspace_settings_backup.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleClearCache = () => {
        localStorage.removeItem("scan_cache");
        alert("Local scan cache cleared.");
    };

    const handleReset = () => {
        if (confirm("Are you sure you want to reset all settings to defaults?")) {
            setSettings(DEFAULT_SETTINGS);
            // Since we can't easily "reset" backend without a specific endpoint,
            // we'll just alert the user or implement a reset profile if needed.
            // For now, satisfy the UI reset.
            localStorage.setItem("cyberspace_settings", JSON.stringify(DEFAULT_SETTINGS));
            localStorage.setItem("theme", "dark");
            document.documentElement.classList.add("dark");
            document.documentElement.classList.remove("light");
            alert("Settings reset successfully.");
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case "profile":
                return <ProfileSettings data={settings.profile} onChange={(f, v) => handleSettingChange("profile", f, v)} />;
            case "notifications":
                return <NotificationSettings data={settings.notifications} onChange={(f, v) => handleSettingChange("notifications", f, v)} />;
            case "security":
                return <SecuritySettings data={settings.security} onChange={(f, v) => handleSettingChange("security", f, v)} />;
            case "appearance":
                return <AppearanceSettings data={settings.appearance} onChange={(f, v) => handleSettingChange("appearance", f, v)} />;
            case "data":
                return <DataManagementSettings onExport={handleExport} onClearCache={handleClearCache} onReset={handleReset} />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-8 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-12">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-semibold text-foreground tracking-tight">
                    {TABS.find(t => t.id === activeTab)?.label || "System Settings"}
                </h2>
                <p className="text-zinc-500 text-sm">Configure your analyst terminal and security preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Tabs Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "w-full flex items-center justify-between p-4 rounded-xl text-xs font-bold transition-all relative overflow-hidden group",
                                activeTab === tab.id
                                    ? "bg-[#E0F2FE] dark:bg-cyber-blue/10 text-[#0369A1] dark:text-cyber-blue border border-cyber-blue/20 shadow-sm"
                                    : "text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent"
                            )}
                        >
                            <div className="flex items-center gap-3 relative z-10">
                                <tab.icon size={16} className={activeTab === tab.id ? "text-cyber-blue" : "text-slate-400"} />
                                {tab.label}
                            </div>
                            {activeTab === tab.id && <ChevronRight size={14} className="relative z-10" />}
                        </button>
                    ))}
                </div>

                {/* Content Panel */}
                <div className="lg:col-span-3 space-y-8 max-w-3xl relative">
                    <div className="min-h-[460px] glass p-8 shadow-sm">
                        {renderContent()}
                    </div>

                    <div className="pt-6 flex justify-end items-center gap-4">
                        <button
                            onClick={() => user && setSettings(prev => ({
                                ...prev,
                                profile: {
                                    displayName: user.name,
                                    email: user.email,
                                    designation: user.designation || "user"
                                }
                            }))}
                            className="px-6 py-3 text-sm font-semibold text-slate-500 hover:text-foreground transition-all"
                        >
                            Discard Changes
                        </button>
                        <button
                            onClick={saveSettings}
                            disabled={!isDirty || isSaving}
                            className={cn(
                                "px-10 py-3.5 text-white font-semibold rounded-[12px] shadow-md transition-all flex items-center gap-2",
                                isDirty && !isSaving
                                    ? "bg-gradient-to-b from-[#0EA5E9] to-[#0284C7] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                                    : "bg-slate-300 dark:bg-zinc-800 text-slate-500 dark:text-zinc-600 cursor-not-allowed shadow-none"
                            )}
                        >
                            {isSaving ? "Updating Parameters..." : "Save Parameters"} <Save size={18} className={isSaving ? "animate-spin" : ""} />
                        </button>
                    </div>

                    {/* Toast Notification */}
                    {showToast && (
                        <div className="fixed bottom-8 right-8 animate-in slide-in-from-right-10 duration-500 z-50">
                            <div className="bg-panel border-2 border-success-green p-4 rounded-xl shadow-xl flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-success-green/20 flex items-center justify-center">
                                    <CheckCircle2 className="text-success-green" />
                                </div>
                                <div>
                                    <h5 className="text-foreground font-bold text-sm">System Update</h5>
                                    <p className="text-slate-500 dark:text-zinc-500 text-xs">Settings updated successfully.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
