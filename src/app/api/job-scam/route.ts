import { NextResponse } from 'next/server';

interface JobScamResponse {
    scam_score: number;
    risk_level: "HIGH" | "MEDIUM" | "LOW";
    flags: string[];
    highlighted_phrases: string[];
    explanation: string;
    action_plan: string[];
}

// Regex Patterns
const PAYMENT_PATTERN = /(?:pay|fee|deposit|registration|crypto|wallet|refundable|taxes).{0,20}\$?(\d+)|(?:send).{0,10}(?:money|fees)|(?:buy).{0,10}(?:equipment)/i;
const UNREALISTIC_SALARY_PATTERN = /\$[\d]{2,3},[\d]{3}.{0,20}(?:per week|per day|weekly|daily)|earn.{0,10}\$[\d]{2,3}.{0,10}(?:an hour|hourly)|part.time.{0,20}\$[\d]{3,4}/i;
const URGENCY_PATTERN = /(?:urgent|immediate|right away|act now|hurry|only [\d]+ spots left|limited time|before it's too late|ASAP|start today)/i;
const FAKE_DOMAIN_PATTERN = /[a-zA-Z0-9_\-\.]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|aol\.com|protonmail\.com)/i;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { input } = body;

        if (!input || typeof input !== "string") {
            return NextResponse.json({ error: "Missing required 'input' field" }, { status: 400 });
        }

        let score = 0;
        const flags: string[] = [];
        const highlighted_phrases: string[] = [];
        
        // 1. Payment Request Check (+40)
        const paymentMatch = input.match(PAYMENT_PATTERN);
        if (paymentMatch) {
            score += 40;
            flags.push("Payment request detected");
            highlighted_phrases.push(paymentMatch[0].trim());
        } else if (input.match(/(?:equipment fee|onboarding cost|processing fee)/i)) {
             // Fallback
             score += 40;
             flags.push("Payment request detected");
             const m = input.match(/(?:equipment fee|onboarding cost|processing fee)/i);
             if (m) highlighted_phrases.push(m[0]);
        }

        // 2. Fake Domain Check (+30)
        const domainMatch = input.match(FAKE_DOMAIN_PATTERN);
        if (domainMatch) {
            score += 30;
            flags.push("Unverified email domain");
            highlighted_phrases.push(domainMatch[0].trim());
        }

        // 3. Urgency Check (+20)
        const urgencyMatch = input.match(URGENCY_PATTERN);
        if (urgencyMatch) {
            score += 20;
            flags.push("High urgency tactics");
            highlighted_phrases.push(urgencyMatch[0].trim());
        }

        // 4. Unrealistic Salary Check (+10)
        const salaryMatch = input.match(UNREALISTIC_SALARY_PATTERN);
        if (salaryMatch) {
            score += 10;
            flags.push("Unrealistic salary claims");
            highlighted_phrases.push(salaryMatch[0].trim());
        }

        // Determine Risk Level
        let risk_level: "HIGH" | "MEDIUM" | "LOW" = "LOW";
        if (score >= 50) risk_level = "HIGH";
        else if (score >= 20) risk_level = "MEDIUM";

        // Generate Contextual Explanation
        let explanation = "The job message appears generally safe, but always remain vigilant.";
        if (score >= 70) {
            explanation = `This message shows multiple strong scam indicators (${flags.length} flags detected), including demanding upfront payment or utilizing suspicious contact methods. Legitimate employers never ask employees to pay for onboarding.`;
        } else if (score >= 40) {
            explanation = `This message contains significant red flags. ${flags.includes("Payment request detected") ? "The mention of fees or required deposits is highly suspicious." : "Be very cautious about sharing personal information."}`;
        } else if (score >= 20) {
            explanation = "This message has some slightly suspicious characteristics, such as using high urgency or generic emails. Verify the sender's identity.";
        }

        // Determine Action Plan
        const action_plan: string[] = [];
        if (score >= 40) {
             action_plan.push("Do not pay any money, fees, or make a deposit.");
             action_plan.push("Do not provide any sensitive personal or banking information.");
        }
        if (flags.includes("Unverified email domain")) {
             action_plan.push("Verify the company through their official website, not the provided email.");
             action_plan.push("Search the recruiter's name and the company name on LinkedIn.");
        }
        if (action_plan.length === 0) {
             action_plan.push("Continue communication cautiously.");
             action_plan.push("Never share your Social Security number or bank details via email.");
        }

        const responsePayload: JobScamResponse = {
            scam_score: score,
            risk_level,
            flags,
            highlighted_phrases: [...new Set(highlighted_phrases)], // Remove duplicates
            explanation,
            action_plan
        };

        return NextResponse.json(responsePayload, { status: 200 });

    } catch (error: any) {
        console.error("Job Scam API Error:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
