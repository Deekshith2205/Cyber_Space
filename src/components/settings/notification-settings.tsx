"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    label: string;
    description: string;
}

const Switch = ({ checked, onCheckedChange, label, description }: SwitchProps) => (
    <div className="p-5 bg-panel border border-border rounded-2xl flex items-center justify-between group transition-all hover:border-cyber-blue/30 shadow-sm">
        <div className="space-y-1">
            <h4 className="text-sm font-medium text-foreground">{label}</h4>
            <p className="text-xs text-text-muted transition-colors">{description}</p>
        </div>
        <button
            onClick={() => onCheckedChange(!checked)}
            className={cn(
                "w-12 h-6 rounded-full p-1 transition-all duration-300 relative border",
                checked
                    ? "bg-cyber-blue border-cyber-blue shadow-md shadow-cyber-blue/20"
                    : "bg-foreground/10 border-border"
            )}
        >
            <div className={cn(
                "w-4 h-4 rounded-full transition-all duration-300 transform bg-white shadow-md",
                checked ? "translate-x-6" : "translate-x-0"
            )} />
        </button>
    </div>
);

interface NotificationSettingsProps {
    data: {
        threatAlerts: boolean;
        scanCompletion: boolean;
        weeklyReports: boolean;
        cveUpdates: boolean;
    };
    onChange: (field: string, value: boolean) => void;
}

export default function NotificationSettings({ data, onChange }: NotificationSettingsProps) {
    return (
        <section className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-3">
                <Switch
                    label="Threat Alerts"
                    description="Real-time alerts for identified security threats."
                    checked={data.threatAlerts}
                    onCheckedChange={(val) => onChange("threatAlerts", val)}
                />
                <Switch
                    label="Scan Completion"
                    description="Notify when automated vulnerability scans finish."
                    checked={data.scanCompletion}
                    onCheckedChange={(val) => onChange("scanCompletion", val)}
                />
                <Switch
                    label="Weekly Reports"
                    description="Receive a summary of system security every Monday."
                    checked={data.weeklyReports}
                    onCheckedChange={(val) => onChange("weeklyReports", val)}
                />
                <Switch
                    label="Critical CVE Updates"
                    description="Immediate notification for high-severity vulnerabilities."
                    checked={data.cveUpdates}
                    onCheckedChange={(val) => onChange("cveUpdates", val)}
                />
            </div>
        </section>
    );
}
