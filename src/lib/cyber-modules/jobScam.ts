import { GoogleGenerativeAI } from "@google/generative-ai";

export async function analyzeJobScam(text: string, genAI: GoogleGenerativeAI) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
You are a cybersecurity expert specializing in identifying employment and recruitment scams.
User query/job description: "${text}"

Provide a structured JSON response with exactly these fields:
- "risk_level" (string: High, Medium, or Low)
- "score" (number: 0-100 indicating likelihood of scam)
- "explanation" (string: concise explanation of the red flags or safety signs)
- "action_plan" (array of strings: safe steps to verify or report)
- "what_not_to_do" (array of strings: common mistakes like paying upfront or sending ID)

Do NOT return markdown blocks. Return purely valid JSON that can be parsed by JSON.parse().
`;

    const result = await model.generateContent(prompt);
    let output = result.response.text().trim();
    if (output.startsWith("\`\`\`json")) output = output.replace(/^\`\`\`json/,"").replace(/\`\`\`$/,"").trim();
    
    return JSON.parse(output);
}
