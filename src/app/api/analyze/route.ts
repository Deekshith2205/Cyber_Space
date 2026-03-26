import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { analyzeAccountRecovery } from '@/lib/cyber-modules/accountRecovery';
import { analyzeJobScam } from '@/lib/cyber-modules/jobScam';
import { analyzeBreachCheck } from '@/lib/cyber-modules/breachCheck';
import { analyzePermission } from '@/lib/cyber-modules/permissionAnalysis';
import { analyzePaymentFraud } from '@/lib/cyber-modules/paymentFraud';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const INTENT_MODEL = "gemini-pro";

const MODULES = ["account_recovery", "job_scam", "breach_check", "permission_analysis", "payment_fraud"] as const;
type ModuleType = typeof MODULES[number];

type IntentResponse = {
    module: ModuleType;
    confidence: number;
};

// Keyword heuristics
function detectIntentKeywords(text: string): IntentResponse | null {
    const lower = text.toLowerCase();
    
    if (lower.match(/hacked|stolen|lost access|recover|forgot password|can't login/)) {
        return { module: "account_recovery", confidence: 0.85 };
    }
    if (lower.match(/job|offer|interview|salary|hired|recruiter|work from home/)) {
        return { module: "job_scam", confidence: 0.85 };
    }
    if (lower.match(/breach|pwned|leak|exposed|dark web|stolen data/)) {
        return { module: "breach_check", confidence: 0.85 };
    }
    if (lower.match(/permission|app wants to access|camera|microphone|location tracker|contacts access/)) {
        return { module: "permission_analysis", confidence: 0.85 };
    }
    if (lower.match(/pay|fraud|credit card|unauthorized charge|bank|transfer|crypto|wallet/)) {
        return { module: "payment_fraud", confidence: 0.85 };
    }
    return null;
}

// AI Intent Detection Fallback
async function detectIntentAI(text: string): Promise<IntentResponse> {
    try {
        const model = genAI.getGenerativeModel({ model: INTENT_MODEL });
        const prompt = `
Analyze the user's cybersecurity request and classify it into exactly ONE of the following modules:
1. account_recovery
2. job_scam
3. breach_check
4. permission_analysis
5. payment_fraud

User request: "${text}"

Respond ONLY with a valid JSON format like this, no markdown or text outside JSON:
{"module": "payment_fraud", "confidence": 0.95}
        `;
        const result = await model.generateContent(prompt);
        let respText = result.response.text().trim();
        if (respText.startsWith("\`\`\`json")) respText = respText.replace(/^\`\`\`json/,"").replace(/\`\`\`$/,"").trim();
        const parsed = JSON.parse(respText);
        
        if (MODULES.includes(parsed.module)) {
            return { module: parsed.module as ModuleType, confidence: parsed.confidence };
        }
    } catch (e) {
        console.error("AI Intent Detection failed", e);
    }
    // Default to a fallback if we really don't know
    return { module: "breach_check", confidence: 0.1 }; 
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { text } = body;
        
        if (!text || typeof text !== "string") {
            return NextResponse.json({ error: "Invalid or missing 'text' field" }, { status: 400 });
        }

        // 1. Detect Intent
        let intent = detectIntentKeywords(text);
        if (!intent || intent.confidence < 0.6) {
            intent = await detectIntentAI(text);
        }

        // 2. Dispatch to Module
        let moduleResult;
        switch (intent.module) {
            case "account_recovery":
                moduleResult = await analyzeAccountRecovery(text, genAI);
                break;
            case "job_scam":
                moduleResult = await analyzeJobScam(text, genAI);
                break;
            case "breach_check":
                moduleResult = await analyzeBreachCheck(text, genAI);
                break;
            case "permission_analysis":
                moduleResult = await analyzePermission(text, genAI);
                break;
            case "payment_fraud":
                moduleResult = await analyzePaymentFraud(text, genAI);
                break;
            default:
                return NextResponse.json({ error: "Unknown module" }, { status: 500 });
        }

        // 3. Return payload
        return NextResponse.json({
            intent,
            result: moduleResult
        }, { status: 200 });

    } catch (error: any) {
        console.error("Analyze API Route Error:", error);
        return NextResponse.json({ error: error.message || "Internal server error", stack: error.stack }, { status: 500 });
    }
}
