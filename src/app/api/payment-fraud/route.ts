import { NextResponse } from 'next/server';

interface FraudResponse {
    fraud_detected: boolean;
    risk_level: "HIGH" | "MEDIUM" | "LOW";
    scam_type: string;
    alerts: string[];
    what_not_to_do: string[];
    action_plan: string[];
}

// Fraud pattern indicators
const PATTERNS = {
    QR_SCAM: /(?:scan).*?(?:qr|code).*?(?:receive|get|accept|claim|refund)/i,
    PIN_SCAM: /(?:enter|put|provide).*?(?:pin|mpin).*?(?:receive|refund|claim|accept)/i,
    SCREEN_SHARE_SCAM: /(?:anydesk|teamviewer|quicksupport|screen share|share screen|download app to verify)/i,
    COLLECT_REQUEST_SCAM: /(?:received a request to pay|upi payment request|money request on phonepe|gpay request)/i,
    CUSTOMER_CARE_SCAM: /(?:called customer care.*google|search customer care.*google)/i
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { input } = body;

        if (!input || typeof input !== "string") {
            return NextResponse.json({ error: "Missing required 'input' field" }, { status: 400 });
        }

        const text = input.toLowerCase();
        let scam_type = "Unknown or No Detectable Fraud";
        let fraud_detected = false;
        const alerts: string[] = [];
        const what_not_to_do: string[] = [];
        const action_plan: string[] = [];
        let risk_level: "HIGH" | "MEDIUM" | "LOW" = "LOW";

        // Logic Matching
        if (text.match(PATTERNS.QR_SCAM)) {
            fraud_detected = true;
            risk_level = "HIGH";
            scam_type = "QR Code Scam";
            alerts.push("QR codes are strictly used to SEND money, never to RECEIVE money.");
            what_not_to_do.push("Do NOT scan unknown or unexpected QR codes.");
            what_not_to_do.push("Do NOT enter your UPI PIN after scanning a code if you expect to receive money.");
        } 
        else if (text.match(PATTERNS.PIN_SCAM)) {
            fraud_detected = true;
            risk_level = "HIGH";
            scam_type = "UPI PIN/Refund Scam";
            alerts.push("Your UPI PIN is only required to deduct money from your account, not to receive refunds.");
            what_not_to_do.push("Do NOT enter your UPI PIN to claim a refund or receive cash.");
        } 
        else if (text.match(PATTERNS.SCREEN_SHARE_SCAM)) {
            fraud_detected = true;
            risk_level = "HIGH";
            scam_type = "Remote Access Scam";
            alerts.push("Scammers use screen sharing apps (like AnyDesk) to view your OTPs and banking passwords.");
            what_not_to_do.push("Do NOT download AnyDesk, TeamViewer, or QuickSupport on the instruction of strangers.");
            what_not_to_do.push("Do NOT share a 9-digit code from these apps with anyone calling you.");
            action_plan.push("Uninstall the remote sharing application immediately if already downloaded.");
        } 
        else if (text.match(PATTERNS.COLLECT_REQUEST_SCAM)) {
            fraud_detected = true;
            risk_level = "HIGH";
            scam_type = "Collect Request Fraud";
            alerts.push("Fraudsters send UPI collect requests disguised as incoming payments or refunds.");
            what_not_to_do.push("Do NOT approve unexpected payment requests on PhonePe, GPay, or Paytm.");
            what_not_to_do.push("Do NOT enter your PIN on a screen saying 'Decline / Pay'.");
        }
        else if (text.match(PATTERNS.CUSTOMER_CARE_SCAM)) {
             fraud_detected = true;
             risk_level = "HIGH";
             scam_type = "Fake Customer Care Scam";
             alerts.push("Many customer support numbers found via Google Search are manipulated by scammers.");
             what_not_to_do.push("Do NOT call numbers found in random Google searches for bank or app support.");
             what_not_to_do.push("Do NOT follow their instructions to download apps or send small 'verification' payments.");
             action_plan.push("Find the true customer care number only inside the official app or on the back of your credit/debit card.");
        }

        // Generic fallback if user expresses financial distress but didn't hit regex exactly
        if (!fraud_detected && text.match(/(?:scam|fraud|money deducted|lost money|unauthorized transaction|hacked my bank)/i)) {
             fraud_detected = true;
             risk_level = "HIGH";
             scam_type = "Unspecified Financial Fraud";
             alerts.push("The scenario indicates an unauthorized transaction or fraud has occurred.");
             what_not_to_do.push("Do NOT panic and search for 'helplines' on Google. Scammers intercept those calls.");
             what_not_to_do.push("Do NOT trust anyone calling you claiming to be from the Cyber Police offering to recover your money for a fee.");
             action_plan.push("Call 1930 (National Cyber Crime Helpline) immediately.");
             action_plan.push("Contact your bank to freeze your account or block the card.");
        }

        // Standard Actions for all frauds
        if (fraud_detected) {
            action_plan.push("Block the sender or caller's phone number.");
            action_plan.push("Report the incident on cybercrime.gov.in or dial 1930.");
        } else {
            alerts.push("No immediate payment fraud patterns detected in the text.");
            what_not_to_do.push("Never share OTPs, PINs, or CVV numbers with anyone.");
            action_plan.push("Continue with caution and verify the recipient's identity before sending money.");
        }

        const responsePayload: FraudResponse = {
            fraud_detected,
            risk_level,
            scam_type,
            alerts,
            what_not_to_do,
            action_plan
        };

        return NextResponse.json(responsePayload, { status: 200 });

    } catch (error: any) {
        console.error("Payment Fraud API Error:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
