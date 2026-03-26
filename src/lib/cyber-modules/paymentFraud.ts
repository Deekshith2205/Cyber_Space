import { GoogleGenerativeAI } from "@google/generative-ai";

export async function analyzePaymentFraud(text: string, genAI: GoogleGenerativeAI) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
You are a financial cybersecurity expert analyzing potential payment fraud or scams.
User query/transaction details: "${text}"

Provide a structured JSON response with exactly these fields:
- "risk_level" (string: High, Medium, or Low depending on the likelihood of fraud)
- "explanation" (string: concise explanation of the scam mechanics or why it seems suspicious)
- "action_plan" (array of strings: immediate actions like calling the bank, freezing cards, or reporting)
- "what_not_to_do" (array of strings: warnings like don't send crypto, don't pay "taxes" to receive a prize)

Do NOT return markdown blocks. Return purely valid JSON that can be parsed by JSON.parse().
`;

    const result = await model.generateContent(prompt);
    let output = result.response.text().trim();
    if (output.startsWith("\`\`\`json")) output = output.replace(/^\`\`\`json/,"").replace(/\`\`\`$/,"").trim();
    
    return JSON.parse(output);
}
