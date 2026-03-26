import { NextResponse } from 'next/server';

type Platform = "Instagram" | "Gmail" | "Facebook" | "WhatsApp" | "Unknown";
type AccessStatus = "has_access" | "no_access" | "unknown";

interface RecoveryTemplate {
    risk_level: string;
    detected_platform: Platform;
    steps: string[];
    official_links: string[];
    next_actions: string[];
}

const TEMPLATES: Record<Exclude<Platform, "Unknown">, Record<Exclude<AccessStatus, "unknown">, RecoveryTemplate>> = {
    Instagram: {
        no_access: {
            risk_level: "HIGH",
            detected_platform: "Instagram",
            steps: [
                "Go to the Instagram login screen on your mobile device.",
                "Tap 'Get help logging in' or 'Forgot password'.",
                "Enter your username, email address, or phone number.",
                "Select 'Need more help?' if you cannot access the email or phone number.",
                "Follow the on-screen instructions to submit a support request with a video selfie."
            ],
            official_links: [
                "https://help.instagram.com/149494825257596",
                "https://www.instagram.com/hacked"
            ],
            next_actions: [
                "Enable Two-Factor Authentication (2FA) once recovered.",
                "Check connected accounts in the Accounts Center.",
                "Revoke access to suspicious third-party apps."
            ]
        },
        has_access: {
            risk_level: "MEDIUM",
            detected_platform: "Instagram",
            steps: [
                "Go to your Instagram profile and tap the menu (three lines).",
                "Navigate to 'Settings' > 'Security' > 'Password' and change your password.",
                "Go to 'Security' > 'Login Activity' and log out of all unrecognized devices.",
                "Review and update your recovery email and phone number."
            ],
            official_links: [
                "https://help.instagram.com/368191326593075"
            ],
            next_actions: [
                "Enable App-Based Two-Factor Authentication (2FA).",
                "Review accounts you follow or DMs sent recently for unauthorized activity."
            ]
        }
    },
    Gmail: {
         no_access: {
            risk_level: "HIGH",
            detected_platform: "Gmail",
            steps: [
                "Go to the Google Account Recovery page.",
                "Enter your email address and click 'Next'.",
                "Answer the recovery questions as accurately as possible.",
                "If possible, use a device and network location you've logged in from before.",
                "If requested, provide an alternate email address for Google to contact you."
            ],
            official_links: [
                "https://accounts.google.com/signin/recovery",
                "https://support.google.com/accounts/answer/7299973"
            ],
            next_actions: [
                "Enable 2-Step Verification immediately after recovery.",
                "Review recent security events in your Google Account.",
                "Check email forwarding rules and remove any unauthorized rules."
            ]
        },
        has_access: {
            risk_level: "MEDIUM",
            detected_platform: "Gmail",
            steps: [
                "Go to your Google Account (myaccount.google.com).",
                "Navigate to 'Security' and change your password immediately.",
                "Review 'Your devices' and sign out of any unrecognized sessions.",
                "Check 'Third-party apps with account access' and remove suspicious apps."
            ],
            official_links: [
                "https://myaccount.google.com/security-checkup"
            ],
            next_actions: [
                "Enable Google Prompt or Authenticator app for 2-Step Verification.",
                "Verify your recovery email and phone number are up to date."
            ]
        }
    },
    Facebook: {
        no_access: {
            risk_level: "HIGH",
            detected_platform: "Facebook",
            steps: [
                "Go to the Facebook Hacked account recovery page.",
                "Click 'My Account Is Compromised'.",
                "Enter your email, phone number, full name, or username.",
                "If you can't access your email/phone, click 'No longer have access to these?'",
                "Follow the steps to submit ID or use trusted contacts if previously set up."
            ],
            official_links: [
                "https://www.facebook.com/hacked",
                "https://www.facebook.com/login/identify"
            ],
            next_actions: [
                "Set up Two-Factor Authentication.",
                "Review Page roles and Ad account access if you manage pages.",
                "Tell friends to ignore suspicious links originating from your account."
            ]
        },
        has_access: {
             risk_level: "MEDIUM",
             detected_platform: "Facebook",
             steps: [
                "Go to 'Settings & Privacy' > 'Settings' > 'Security and Login'.",
                "Change your password immediately.",
                "Review the 'Where You're Logged In' section and select 'Log Out Of All Sessions'.",
                "Check for any unauthorized email addresses or phone numbers added to your account."
             ],
             official_links: [
                 "https://www.facebook.com/settings?tab=security"
             ],
             next_actions: [
                 "Enable Two-Factor Authentication.",
                 "Review recent posts and messages for unauthorized spam."
             ]
        }
    },
    WhatsApp: {
        no_access: {
            risk_level: "HIGH",
            detected_platform: "WhatsApp",
            steps: [
                "Re-register your phone number on WhatsApp.",
                "Enter the 6-digit SMS code you receive. This will automatically log out the attacker.",
                "If asked for a Two-Step Verification PIN you didn't set, you must wait 7 days to access the account.",
                "Notify your contacts via SMS or calls that your WhatsApp was compromised."
            ],
            official_links: [
                "https://faq.whatsapp.com/113162051992143"
            ],
            next_actions: [
                "Set up a Two-Step Verification PIN immediately upon regaining access.",
                "Do not share your 6-digit SMS registration code with anyone."
            ]
        },
        has_access: {
            risk_level: "LOW", // Given phone number tying, if they have access, risk is lower
            detected_platform: "WhatsApp",
            steps: [
                "Go to WhatsApp Settings > 'Linked Devices'.",
                "Log out of all unrecognized Web, Desktop, or Portal sessions.",
                "Go to Settings > Account > Two-Step Verification and ensure it is enabled and you know the PIN."
            ],
            official_links: [
                "https://faq.whatsapp.com/1317564962315842"
            ],
            next_actions: [
                "Add an email address to your Two-Step Verification to reset the PIN if forgotten.",
                "Be wary of 'verification codes' sent to you by friends (it might be their account hacked)."
            ]
        }
    }
};

const GENERIC_TEMPLATE: RecoveryTemplate = {
     risk_level: "HIGH",
     detected_platform: "Unknown",
     steps: [
        "Attempt to locate the official 'Forgot Password' or 'Account Recovery' page for the service.",
        "Check your email and phone for any login alerts or password reset links.",
        "Contact the service's official customer support directly.",
        "If financial info is linked, contact your bank to monitor or block transactions."
     ],
     official_links: [],
     next_actions: [
         "Do not pay 'hackers' or 'recovery experts' claiming they can get your account back (this is a SCAM).",
         "Enable Two-Factor Authentication on all other important accounts.",
         "Ensure your email account controlling other passwords is secure."
     ]
}


function detectPlatform(input: string): Platform {
    const text = input.toLowerCase();
    if (text.includes("instagram") || text.includes("ig") || text.includes("insta")) return "Instagram";
    if (text.includes("gmail") || text.includes("google") || text.includes("youtube")) return "Gmail";
    if (text.includes("facebook") || text.includes("fb") || text.includes("meta")) return "Facebook";
    if (text.includes("whatsapp") || text.includes("wa")) return "WhatsApp";
    return "Unknown";
}

function detectAccessStatus(input: string): AccessStatus {
    const text = input.toLowerCase();
    if (text.match(/can't login|locked out|hacked and changed password|no access|lost access|stolen/)) return "no_access";
    if (text.match(/someone logged in|weird activity|suspicious login|still have access|device i don't recognize/)) return "has_access";
    return "no_access"; // Default to worst case scenario
}


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { input, platform: reqPlatform, access_status: reqAccessStatus } = body;

        if (!input || typeof input !== "string") {
            return NextResponse.json({ error: "Missing required 'input' field" }, { status: 400 });
        }

        // 1. Determine Platform
        let finalPlatform: Platform = "Unknown";
        if (reqPlatform) {
             const normalized = reqPlatform.charAt(0).toUpperCase() + reqPlatform.slice(1).toLowerCase();
             if (["Instagram", "Gmail", "Facebook", "WhatsApp"].includes(normalized)) {
                 finalPlatform = normalized as Platform;
             }
        }
        if (finalPlatform === "Unknown") {
            finalPlatform = detectPlatform(input);
        }

        // 2. Determine Access Status
        let finalAccessStatus: AccessStatus = "unknown";
        if (reqAccessStatus && ["has_access", "no_access"].includes(reqAccessStatus.toLowerCase())) {
            finalAccessStatus = reqAccessStatus.toLowerCase() as AccessStatus;
        } else {
            finalAccessStatus = detectAccessStatus(input);
        }

        // 3. Select Template
        let responsePayload: RecoveryTemplate;
        if (finalPlatform !== "Unknown" && finalAccessStatus !== "unknown") {
            responsePayload = TEMPLATES[finalPlatform][finalAccessStatus as Exclude<AccessStatus, "unknown">];
        } else {
            responsePayload = { ...GENERIC_TEMPLATE };
            if (finalPlatform !== "Unknown") {
                 responsePayload.detected_platform = finalPlatform;
                 responsePayload.steps.unshift(`Search for official ${finalPlatform} support or hacked account articles.`);
            }
        }

        return NextResponse.json(responsePayload, { status: 200 });

    } catch (error: any) {
        console.error("Account Recovery API Error:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
