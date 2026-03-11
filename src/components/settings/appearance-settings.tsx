import { Moon, Sun, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppearanceSettingsProps {
    data: {
        systemTheme: boolean; // true = dark, false = light
    };
    onChange: (field: string, value: boolean) => void;
}

export default function AppearanceSettings({ data, onChange }: AppearanceSettingsProps) {

    const handleThemeChange = (isDark: boolean) => {
        onChange("systemTheme", isDark);
        if (isDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    return (
        <section className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-3">
                <div className="p-6 bg-panel border border-border rounded-2xl shadow-sm space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h4 className="text-sm font-medium text-foreground">System Theme</h4>
                            <p className="text-xs text-slate-500">Switch between terminal dark mode and high-visibility light mode.</p>
                        </div>
                        <button
                            onClick={() => handleThemeChange(!data.systemTheme)}
                            className={cn(
                                "w-14 h-7 rounded-full p-1 transition-all duration-500 relative flex items-center border",
                                data.systemTheme
                                    ? "bg-slate-900 border-slate-700"
                                    : "bg-amber-50 border-amber-200"
                            )}
                        >
                            <div className={cn("absolute transition-all duration-500", data.systemTheme ? "left-1.5 opacity-100" : "left-4 opacity-0")}>
                                <Moon size={12} className="text-blue-400" />
                            </div>
                            <div className={cn("absolute transition-all duration-500", !data.systemTheme ? "right-1.5 opacity-100" : "right-4 opacity-0")}>
                                <Sun size={12} className="text-amber-500" />
                            </div>
                            <div className={cn(
                                "w-5 h-5 rounded-full transition-all duration-500 transform z-10 shadow-sm",
                                data.systemTheme
                                    ? "translate-x-7 bg-blue-500"
                                    : "translate-x-0 bg-amber-500"
                            )} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div
                            onClick={() => handleThemeChange(true)}
                            className={cn(
                                "cursor-pointer group relative overflow-hidden rounded-2xl border-2 transition-all p-4",
                                data.systemTheme
                                    ? "border-cyber-blue bg-cyber-blue/5 shadow-md"
                                    : "border-border bg-panel-secondary hover:border-slate-300"
                            )}
                        >
                            <div className="w-full h-24 bg-[#0B0F14] rounded-xl mb-4 border border-white/10 flex flex-col p-3 gap-2 shadow-inner">
                                <div className="w-1/2 h-2 bg-white/10 rounded-full" />
                                <div className="w-full h-10 bg-white/5 rounded-lg border border-white/5" />
                                <div className="w-2/3 h-2 bg-cyber-blue/20 rounded-full" />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-foreground">Dark Protocol</span>
                                {data.systemTheme && <div className="w-2 h-2 rounded-full bg-cyber-blue shadow-[0_0_8px_#00E5FF]" />}
                            </div>
                        </div>

                        <div
                            onClick={() => handleThemeChange(false)}
                            className={cn(
                                "cursor-pointer group relative overflow-hidden rounded-2xl border-2 transition-all p-4",
                                !data.systemTheme
                                    ? "border-cyber-blue bg-cyber-blue/5 shadow-md"
                                    : "border-border bg-panel-secondary hover:border-slate-300"
                            )}
                        >
                            <div className="w-full h-24 bg-[#F5F7FA] rounded-xl mb-4 border border-slate-200 flex flex-col p-3 gap-2 shadow-inner">
                                <div className="w-1/2 h-2 bg-slate-300 rounded-full" />
                                <div className="w-full h-10 bg-white rounded-lg border border-slate-200" />
                                <div className="w-2/3 h-2 bg-cyber-blue/20 rounded-full" />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-foreground">Light Terminal</span>
                                {!data.systemTheme && <div className="w-2 h-2 rounded-full bg-cyber-blue shadow-[0_0_8px_#0EA5E9]" />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
