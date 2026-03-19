"use client";

import React from "react";
import { Download, Trash2, RefreshCw } from "lucide-react";

interface DataManagementSettingsProps {
    onExport: () => void;
    onClearCache: () => void;
    onReset: () => void;
}

export default function DataManagementSettings({ onExport, onClearCache, onReset }: DataManagementSettingsProps) {
    return (
        <section className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-4">
                <div className="p-6 bg-panel border border-border rounded-2xl flex items-center justify-between shadow-premium">
                    <div className="space-y-1">
                        <h4 className="text-sm font-medium text-foreground">Export Security Logs</h4>
                        <p className="text-xs text-text-muted font-medium">Download all recent scan activities and threat detections in JSON format.</p>
                    </div>
                    <button
                        onClick={onExport}
                        className="flex items-center gap-2 px-4 py-2 bg-panel-secondary hover:bg-foreground/10 border border-border rounded-xl text-xs font-bold text-text-secondary hover:text-foreground transition-all shadow-sm"
                    >
                        <Download size={14} /> Export JSON
                    </button>
                </div>

                <div className="p-6 bg-panel border border-border rounded-2xl flex items-center justify-between shadow-premium">
                    <div className="space-y-1">
                        <h4 className="text-sm font-medium text-foreground">Clear Local Scan Cache</h4>
                        <p className="text-xs text-text-muted font-medium">Remove locally stored scan data to free up memory.</p>
                    </div>
                    <button
                        onClick={onClearCache}
                        className="flex items-center gap-2 px-4 py-2 bg-alert-red/10 border border-alert-red/20 rounded-xl text-xs font-bold text-alert-red hover:bg-alert-red/20 transition-all shadow-sm"
                    >
                        <Trash2 size={14} /> Clear Cache
                    </button>
                </div>

                <div className="p-6 bg-panel border border-border rounded-2xl flex items-center justify-between shadow-premium">
                    <div className="space-y-1">
                        <h4 className="text-sm font-medium text-foreground">Reset System Settings</h4>
                        <p className="text-xs text-text-muted font-medium">Restore all preferences to default factory configuration.</p>
                    </div>
                    <button
                        onClick={onReset}
                        className="flex items-center gap-2 px-4 py-2 bg-panel-secondary hover:bg-foreground/10 border border-border rounded-xl text-xs font-bold text-text-secondary hover:text-foreground transition-all shadow-sm"
                    >
                        <RefreshCw size={14} /> Reset Defaults
                    </button>
                </div>
            </div>
        </section>
    );
}
