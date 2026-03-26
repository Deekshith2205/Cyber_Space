import { GoogleGenerativeAI } from "@google/generative-ai";

export async function analyzeBreachCheck(text: string, genAI: GoogleGenerativeAI) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
You are a cybersecurity expert analyzing a potential data breach or compromised information scenario.
User query: "${text}"

Provide a structured JSON response with exactly these fields:
- "risk_level" (string: High, Medium, or Low based on Data type exposed)
- "explanation" (string: concise explanation of what the user should know about this breach)
- "action_plan" (array of strings: immediate actions like password resets, 2FA, credit freezes)
- "what_not_to_do" (array of strings: mistakes like clicking suspicious verify emails)

Do NOT return markdown blocks. Return purely valid JSON that can be parsed by JSON.parse().
`;

    const result = await model.generateContent(prompt);
    let output = result.response.text().trim();
    if (output.startsWith("\`\`\`json")) output = output.replace(/^\`\`\`json/,"").replace(/\`\`\`$/,"").trim();
    
    return JSON.parse(output);
}
