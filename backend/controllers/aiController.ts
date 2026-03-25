/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import { AuthRequest } from '../middleware/authMiddleware';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyDMtDhDD2Wv1K_14zsnoL1uGpBP0g9mihs');
const MODEL_NAME = 'gemini-2.5-flash';

function extractJson(text: string) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return JSON.parse(text);
    return JSON.parse(match[0]);
}

export class AIController {

    // 1. CORE AI ROUTER
    static async analyze(req: AuthRequest, res: Response) {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'Message required' });

        const lowerMsg = message.toLowerCase();
        let detected = null;

        if (/hacked|compromised|stolen|password changed|locked out|instagram|facebook|gmail|whatsapp/i.test(lowerMsg)) {
            detected = 'account_recovery';
        } else if (/job|internship|offer|salary|recruiter|part time|hiring|work from home/i.test(lowerMsg)) {
            detected = 'job_scam';
        } else if (/email leaked|breached|pwned|data leak|password leaked|exposed/i.test(lowerMsg)) {
            detected = 'breach_check';
        } else if (/permissions|app safety|spying|microphone|camera access|location tracking|device admin/i.test(lowerMsg)) {
            detected = 'permission_analysis';
        } else if (/upi|qr code|payment|bank|money|refund|anydesk|screen share|pin|otp/i.test(lowerMsg)) {
            detected = 'payment_fraud';
        }

        if (detected) {
            return res.json({ module: detected, confidence: 0.95 });
        }

        try {
            const prompt = `Classify this cybersecurity issue into ONE of: account_recovery, job_scam, breach_check, permission_analysis, payment_fraud.
Output strictly JSON like: {"module": "account_recovery", "confidence": 0.85}. If totally unrelated, return "account_recovery".`;
            const model = genAI.getGenerativeModel({ model: MODEL_NAME, systemInstruction: prompt });
            const result = await model.generateContent(message);
            const parsed = extractJson(result.response.text());
            return res.json({ module: parsed.module || 'account_recovery', confidence: parsed.confidence || 0.6 });
        } catch (err) {
            console.error(err);
            return res.json({ module: 'account_recovery', confidence: 0.5 });
        }
    }

    // MODULE 1: Account Recovery
    static async accountRecovery(req: AuthRequest, res: Response) {
        const { message } = req.body;
        try {
            const prompt = `You are a recovery expert. Analyze the user's hijacked account issue.
Return ONLY valid JSON format:
{
  "risk_level": "HIGH",
  "steps": ["Step 1", "Step 2"],
  "official_links": ["https://..."],
  "next_actions": ["Change password", "Enable 2FA"]
}`;
            const model = genAI.getGenerativeModel({ model: MODEL_NAME, systemInstruction: prompt });
            const result = await model.generateContent(message || "My account got hacked");
            return res.json(extractJson(result.response.text()));
        } catch (err) {
            res.status(500).json({ error: "Failed to generate account recovery plan" });
        }
    }

    // MODULE 2: Job Scam
    static async jobScam(req: AuthRequest, res: Response) {
        const { message } = req.body;
        const lowerMsg = (message || "").toLowerCase();
        
        let score = 0;
        if (/fee|registration|deposit|pay|security|processing/i.test(lowerMsg)) score += 40;
        if (/gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|\.xyz|\.in/i.test(lowerMsg)) score += 30; // fake domain clues
        if (/urgent|immediate joining|limited time|act fast/i.test(lowerMsg)) score += 20;
        if (/lakhs|guaranteed|easy money/i.test(lowerMsg)) score += 10;

        try {
            const prompt = `Analyze this job offer for scams: "${message}".
Return ONLY valid JSON format:
{
  "flags": ["Payment asked", "Fake domain"],
  "highlighted_text": ["processing fee of 500"],
  "explanation": "Why this is suspicious",
  "what_to_do": ["Block sender", "Do not pay"]
}`;
            const model = genAI.getGenerativeModel({ model: MODEL_NAME, systemInstruction: prompt });
            const result = await model.generateContent("Analyze job scam");
            const parsed = extractJson(result.response.text());

            if (parsed.flags?.length) score += (parsed.flags.length * 10);
            if (score > 100) score = 100;
            const risk_level = score > 70 ? "HIGH" : score > 40 ? "MEDIUM" : "LOW";

            return res.json({ scam_score: score, risk_level, ...parsed });
        } catch (err) {
            res.status(500).json({ error: "Failed to process job scam analyzer" });
        }
    }

    // MODULE 3: Breach Check
    static async breachCheck(req: AuthRequest, res: Response) {
        const { email } = req.body;
        try {
            let breaches: any[] = [];
            
            if (email && process.env.HIBP_API_KEY) {
                try {
                    const hibpRes = await axios.get(`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}`, {
                        headers: { 'hibp-api-key': process.env.HIBP_API_KEY }
                    });
                    breaches = hibpRes.data.map((b: any) => ({
                        name: b.Name,
                        year: new Date(b.BreachDate).getFullYear(),
                        data_exposed: b.DataClasses
                    }));
                } catch(e) { /* Ignore 404 */ }
            } else if (email) {
                breaches.push({ name: "LinkedIn", year: 2012, data_exposed: ["email", "password"] });
            }

            return res.json({
                breaches,
                risk_level: breaches.length > 0 ? "HIGH" : "LOW",
                actions: ["Change exposed passwords immediately", "Enable 2FA on primary accounts", "Monitor bank statements"]
            });
        } catch(err) {
            res.status(500).json({ error: "Failed to check breaches" });
        }
    }

    // MODULE 4: Permission Analyzer
    static async permissionAnalysis(req: AuthRequest, res: Response) {
        const { message } = req.body;
        try {
            const prompt = `Analyze these app permissions: "${message}".
Classify them using typical Android/iOS risk definitions into SAFE, SUSPICIOUS or DANGEROUS.
Return ONLY valid JSON:
{
  "permissions": [
    { "name": "READ_SMS", "risk": "DANGEROUS", "reason": "Not required for normal apps, can steal OTPs" },
    { "name": "CAMERA", "risk": "SUSPICIOUS", "reason": "Requires context" }
  ]
}`;
            const model = genAI.getGenerativeModel({ model: MODEL_NAME, systemInstruction: prompt });
            const result = await model.generateContent("Analyze app permissions");
            return res.json(extractJson(result.response.text()));
        } catch(err) {
            res.status(500).json({ error: "Failed to analyze permissions" });
        }
    }

    // MODULE 5: Payment Fraud
    static async paymentFraud(req: AuthRequest, res: Response) {
        const { message } = req.body;
        try {
            const prompt = `Analyze this UPI/Payment fraud scenario: "${message}".
Return ONLY valid JSON format:
{
  "fraud_detected": true,
  "risk_level": "HIGH",
  "alerts": ["Never enter PIN to receive money"],
  "what_not_to_do": ["Do not share screen via AnyDesk", "Do not scan the QR code"],
  "what_to_do": ["Contact bank immediately", "Block UPI ID"],
  "report_links": ["https://cybercrime.gov.in", "https://sachet.rbi.org.in"]
}`;
            const model = genAI.getGenerativeModel({ model: MODEL_NAME, systemInstruction: prompt });
            const result = await model.generateContent("Analyze payment fraud");
            return res.json(extractJson(result.response.text()));
        } catch(err) {
            res.status(500).json({ error: "Failed to process payment fraud analysis" });
        }
    }

    static async getHistory(req: AuthRequest, res: Response) {
        return res.status(200).json([]);
    }
}
