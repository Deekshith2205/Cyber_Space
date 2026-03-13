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
            <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-foreground">{label}</h4>
                <span className={cn(
                    "text-[9px] font-black uppercase px-2 py-0.5 rounded border transition-all",
                    checked
                        ? "text-success-green border-success-green/30 bg-success-green/5"
                        : "text-slate-400 border-slate-200 bg-slate-50 dark:text-zinc-500 dark:border-white/10 dark:bg-white/5"
                )}>
                    {checked ? "Enabled" : "Disabled"}
                </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">{description}</p>
        </div>
        <button
            onClick={() => onCheckedChange(!checked)}
            className={cn(
                "w-12 h-6 rounded-full p-1 transition-all duration-300 relative border",
                checked
                    ? "bg-[#0EA5E9] border-[#0EA5E9] shadow-sm shadow-cyber-blue/20"
                    : "bg-[#CBD5F5] border-[#CBD5F5]"
            )}
        >
            <div className={cn(
                "w-4 h-4 rounded-full transition-all duration-300 transform bg-white shadow-sm",
                checked ? "translate-x-6" : "translate-x-0"
            )} />
        </button>
    </div>
);

interface SecuritySettingsProps {
    data: {
        twoFactorAuth: boolean;
        encryptedLogs: boolean;
        autoThreatPurge: boolean;
        secureSessionLock: boolean;
    };
    onChange: (field: string, value: boolean) => void;
}

export default function SecuritySettings({ data, onChange }: SecuritySettingsProps) {
    return (
        <section className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-3">
                <Switch
                    label="Two-Factor Authentication"
                    description="Require secondary verification for high-privilege actions."
                    checked={data.twoFactorAuth}
                    onCheckedChange={(val) => onChange("twoFactorAuth", val)}
                />
                <Switch
                    label="Encrypted Data Logs"
                    description="Encrypt all local terminal logs using AES-256 protocol."
                    checked={data.encryptedLogs}
                    onCheckedChange={(val) => onChange("encryptedLogs", val)}
                />
                <Switch
                    label="Automatic Threat Purge"
                    description="Instantly isolate and purge detected malicious payloads."
                    checked={data.autoThreatPurge}
                    onCheckedChange={(val) => onChange("autoThreatPurge", val)}
                />
                <Switch
                    label="Secure Session Lock"
                    description="Auto-lock terminal after 15 minutes of inactivity."
                    checked={data.secureSessionLock}
                    onCheckedChange={(val) => onChange("secureSessionLock", val)}
                />
            </div>
        </section>
    );
}
