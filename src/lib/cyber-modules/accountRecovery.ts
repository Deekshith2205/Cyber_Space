import { GoogleGenerativeAI } from "@google/generative-ai";

export async function analyzeAccountRecovery(text: string, genAI: GoogleGenerativeAI) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
You are a cybersecurity expert analyzing a user's account recovery issue.
User query: "${text}"

Provide a structured JSON response with exactly these fields:
- "risk_level" (string: High, Medium, or Low, or score out of 100)
- "explanation" (string: concise explanation of the situation and threat)
- "action_plan" (array of strings: step-by-step recovery process)
- "what_not_to_do" (array of strings: common mistakes to avoid)

Do NOT return markdown blocks. Return purely valid JSON that can be parsed by JSON.parse().
`;

    const result = await model.generateContent(prompt);
    let output = result.response.text().trim();
    if (output.startsWith("\`\`\`json")) output = output.replace(/^\`\`\`json/,"").replace(/\`\`\`$/,"").trim();
    
    return JSON.parse(output);
}
