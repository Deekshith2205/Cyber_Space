"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Shield, CheckCircle2, XCircle, Loader2, ChevronRight } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your Agent credentials...");

  useEffect(() => {
    if (!token) {
      Promise.resolve().then(() => {
        setStatus("error");
        setMessage("No verification token provided. Security clearance denied.");
      });
      return;
    }

    const verify = async () => {
      try {
        const response = await axios.get(`/api/auth/verify/${token}`);
        if (response.data.status === "success") {
          setStatus("success");
          setMessage(response.data.message);
        } else {
          setStatus("error");
          setMessage(response.data.message || "Verification failed.");
        }
      } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        setStatus("error");
        setMessage(err.response?.data?.message || "Server error during verification.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-background">
      
      <div className="relative z-10 w-full max-w-md glass-premium rounded-[30px] p-10 text-center shadow-2xl border border-white/10 animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-cyber-blue/10 flex items-center justify-center border border-cyber-blue/20 shadow-[0_0_30px_rgba(0,163,255,0.2)]">
            <Shield className="text-cyber-blue w-10 h-10" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-foreground mb-4 tracking-tight">
          Clearance Check
        </h1>

        <div className={cn(
          "p-6 rounded-2xl border transition-all duration-500",
          status === "loading" ? "bg-white/5 border-white/10" :
          status === "success" ? "bg-success-green/10 border-success-green/30" :
          "bg-red-500/10 border-red-500/30"
        )}>
          {status === "loading" && <Loader2 className="w-10 h-10 text-cyber-blue animate-spin mx-auto mb-4" />}
          {status === "success" && <CheckCircle2 className="w-12 h-12 text-success-green mx-auto mb-4" />}
          {status === "error" && <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />}

          <p className={cn(
            "text-sm font-bold leading-relaxed",
            status === "success" ? "text-success-green" : 
            status === "error" ? "text-red-500" : "text-text-secondary"
          )}>
            {message}
          </p>
        </div>

        {status !== "loading" && (
          <button 
            onClick={() => router.push("/login")}
            className="w-full mt-8 bg-gradient-to-br from-[#3BA4FF] to-[#0066FF] text-white font-black py-4 rounded-full hover:shadow-[0_0_20px_rgba(0,163,255,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2 group shadow-lg"
          >
            {status === "success" ? "PROCEED TO SIGN IN" : "BACK TO LOGIN"}
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}

        <div className="mt-8 pt-8 border-t border-white/5">
          <p className="text-[10px] text-text-muted font-black tracking-[0.2em] uppercase">
            CyberSpace Protocol v2.0 • Security Verified
          </p>
        </div>
      </div>
    </div>
  );
}
