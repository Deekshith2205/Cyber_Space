/* eslint-disable @typescript-eslint/no-require-imports */
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    console.log("Starting test...");
    const genAI = new GoogleGenerativeAI('AIzaSyDMtDhDD2Wv1K_14zsnoL1uGpBP0g9mihs');
    console.log("Initialized...");
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        console.log("Model requested...");
        const result = await model.generateContent("Hello!");
        console.log("Success:", result.response.text());
    } catch (err) {
        console.error("Gemini Error:", err);
    }
}
test();
