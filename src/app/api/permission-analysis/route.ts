import { NextResponse } from 'next/server';

type RiskLevel = "SAFE" | "SUSPICIOUS" | "DANGEROUS" | "UNKNOWN";

interface PermissionDetails {
    risk: RiskLevel;
    reason: string;
}

interface PermissionResult {
    name: string;
    risk: RiskLevel;
    reason: string;
}

interface AnalysisResponse {
    permissions: PermissionResult[];
    summary: string;
}

const PERMISSION_DB: Record<string, PermissionDetails> = {
    // Dangerous
    "READ_SMS": { risk: "DANGEROUS", reason: "Can read all your personal text messages, including 2FA codes." },
    "RECEIVE_SMS": { risk: "DANGEROUS", reason: "Can intercept text messages as they arrive." },
    "SEND_SMS": { risk: "DANGEROUS", reason: "Can send text messages, potentially costing you money or messaging premium numbers." },
    "RECORD_AUDIO": { risk: "DANGEROUS", reason: "Can secretly listen to and record your private conversations." },
    "READ_CALL_LOG": { risk: "DANGEROUS", reason: "Can see exactly who you call and when." },
    "ANSWER_PHONE_CALLS": { risk: "DANGEROUS", reason: "Can answer incoming phone calls without your permission." },
    "PROCESS_OUTGOING_CALLS": { risk: "DANGEROUS", reason: "Can monitor, redirect, or prevent outgoing calls." },
    "SYSTEM_ALERT_WINDOW": { risk: "DANGEROUS", reason: "Can draw screens over other apps, often used to steal passwords." },
    "REQUEST_INSTALL_PACKAGES": { risk: "DANGEROUS", reason: "Can secretly install malware or other unwanted applications." },

    // Suspicious
    "ACCESS_FINE_LOCATION": { risk: "SUSPICIOUS", reason: "Tracks your exact pinpoint physical location." },
    "ACCESS_COARSE_LOCATION": { risk: "SUSPICIOUS", reason: "Tracks your general physical location." },
    "READ_CONTACTS": { risk: "SUSPICIOUS", reason: "Can copy your entire address book of friends and family." },
    "WRITE_CONTACTS": { risk: "SUSPICIOUS", reason: "Can modify or add fake contacts to your phone." },
    "READ_CALENDAR": { risk: "SUSPICIOUS", reason: "Can see all your personal events and appointments." },
    "CAMERA": { risk: "SUSPICIOUS", reason: "Can take photos or record videos. Safe for camera apps, risky for others." },
    "GET_ACCOUNTS": { risk: "SUSPICIOUS", reason: "Can see which online accounts are saved on your phone." },
    "READ_EXTERNAL_STORAGE": { risk: "SUSPICIOUS", reason: "Can read personal files and photos stored on your device." },

    // Safe / Normal
    "INTERNET": { risk: "SAFE", reason: "Standard permission to connect to the internet." },
    "ACCESS_NETWORK_STATE": { risk: "SAFE", reason: "Allows the app to see if you have an active Wi-Fi or data connection." },
    "ACCESS_WIFI_STATE": { risk: "SAFE", reason: "Allows the app to view information about Wi-Fi networks." },
    "VIBRATE": { risk: "SAFE", reason: "Allows the app to make the phone vibrate for notifications." },
    "WAKE_LOCK": { risk: "SAFE", reason: "Prevents the screen from turning off while you use the app." },
    "RECEIVE_BOOT_COMPLETED": { risk: "SAFE", reason: "Allows the app to start up automatically when you turn on your phone." },
    "BLUETOOTH": { risk: "SAFE", reason: "Allows the app to connect to paired bluetooth devices." }
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { app_name, permissions } = body;

        if (!permissions || !Array.isArray(permissions)) {
            return NextResponse.json({ error: "Missing or invalid 'permissions' array" }, { status: 400 });
        }

        const results: PermissionResult[] = [];
        let hasDangerous = false;
        let hasSuspicious = false;

        for (const perm of permissions) {
            const normalized = typeof perm === "string" ? perm.trim().toUpperCase() : "";
            
            // Try to match strict or loose e.g., android.permission.READ_SMS -> READ_SMS
            const stripped = normalized.split('.').pop() || normalized;
            
            if (PERMISSION_DB[stripped]) {
                const classification = PERMISSION_DB[stripped];
                results.push({
                    name: stripped,
                    risk: classification.risk,
                    reason: classification.reason
                });

                if (classification.risk === "DANGEROUS") hasDangerous = true;
                if (classification.risk === "SUSPICIOUS") hasSuspicious = true;
            } else {
                results.push({
                    name: stripped,
                    risk: "UNKNOWN",
                    reason: "This is an uncommon or custom permission. Treat with caution."
                });
                hasSuspicious = true; // Count unknown as suspicious just in case
            }
        }

        let summaryStr = "This application looks mostly safe and requests standard permissions.";
        const appIdentifier = app_name ? `The app "${app_name}"` : "This app";

        if (hasDangerous) {
             summaryStr = `${appIdentifier} requests HIGH-RISK permissions that can severely compromise your privacy or money. Do not install unless completely necessary.`;
        } else if (hasSuspicious) {
             summaryStr = `${appIdentifier} requests access to sensitive personal data (like location or contacts). Ensure these permissions make sense for what the app actually does.`;
        }

        const responsePayload: AnalysisResponse = {
            permissions: results,
            summary: summaryStr
        };

        return NextResponse.json(responsePayload, { status: 200 });

    } catch (error: any) {
        console.error("Permission Analysis API Error:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
