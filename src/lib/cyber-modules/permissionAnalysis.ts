import { GoogleGenerativeAI } from "@google/generative-ai";

export async function analyzePermission(text: string, genAI: GoogleGenerativeAI) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
You are a cybersecurity expert analyzing app permissions and mobile security risks.
User query/app permission request: "${text}"

Provide a structured JSON response with exactly these fields:
- "risk_level" (string: High, Medium, or Low based on the invasiveness of permissions)
- "explanation" (string: concise explanation of why the app wants these permissions and if it's normal)
- "action_plan" (array of strings: safe steps to manage or restrict permissions)
- "what_not_to_do" (array of strings: warnings e.g., don't grant accessibility access to a flashlight app)

Do NOT return markdown blocks. Return purely valid JSON that can be parsed by JSON.parse().
`;

    const result = await model.generateContent(prompt);
    let output = result.response.text().trim();
    if (output.startsWith("\`\`\`json")) output = output.replace(/^\`\`\`json/,"").replace(/\`\`\`$/,"").trim();
    
    return JSON.parse(output);
}
