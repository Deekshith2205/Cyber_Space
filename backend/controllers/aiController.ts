/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AuthRequest } from '../middleware/authMiddleware';
import AIQuery from '../models/AIQuery';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `You are a cybersecurity expert assistant named CYBERSPACE AI.
Only answer questions related to cybersecurity threats such as phishing, malware, hacking, ransomware, scams, vulnerabilities, social engineering, data breaches, network attacks, and digital fraud.

If the question is NOT related to cybersecurity, respond ONLY with this exact JSON:
{"domain_blocked": true, "message": "I can only assist with cybersecurity-related queries."}

Otherwise, analyze the user's input and return ONLY a valid JSON object (no markdown, no explanation outside the JSON) in this exact format:
{
  "domain_blocked": false,
  "threat_type": "Phishing | Malware | Ransomware | Social Engineering | Data Breach | Network Attack | Other",
  "severity": "Low | Medium | High | Critical",
  "description": "Clear 2-3 sentence explanation of the threat",
  "risk_level": "A one-line risk summary",
  "solution": "Step-by-step actionable solution (use numbered list)",
  "prevention": "Key prevention tips (use numbered list)"
}

Be precise, clear, and professional. Always return valid JSON only.`;

export class AIController {
    static async analyze(req: AuthRequest, res: Response) {
        const { message, history, sessionId } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ status: 'error', message: 'Message is required.' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ status: 'error', message: 'Gemini API key not configured.' });
        }

        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

            // Build conversation context from prior messages
            let contextBlock = '';
            if (Array.isArray(history) && history.length > 0) {
                const contextLines = history
                    .slice(-6) // Keep last 6 turns to avoid prompt bloat
                    .map((h: { role: string; text: string }) =>
                        `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.text}`
                    )
                    .join('\n');
                contextBlock = `\n\nPrevious conversation context:\n${contextLines}\n`;
            }

            const prompt = `${SYSTEM_PROMPT}${contextBlock}\n\nUser Query: ${message.trim()}`;
            const result = await model.generateContent(prompt);
            const rawText = result.response.text().trim();

            // Strip markdown code fences if Gemini wraps the JSON in them
            const jsonText = rawText
                .replace(/^```json\s*/i, '')
                .replace(/^```\s*/i, '')
                .replace(/\s*```$/i, '')
                .trim();

            let parsed: any;
            try {
                parsed = JSON.parse(jsonText);
            } catch {
                // If parsing fails, treat it as a domain block or generic error
                return res.status(200).json({
                    domain_blocked: false,
                    threat_type: 'Other',
                    severity: 'Medium',
                    description: rawText,
                    risk_level: 'Unknown',
                    solution: 'Please consult a cybersecurity professional.',
                    prevention: 'Stay vigilant and keep your systems updated.'
                });
            }

            // Save to DB (best-effort)
            try {
                await AIQuery.create({
                    userId: req.user._id,
                    sessionId: sessionId || '',
                    input: message.trim(),
                    threat_type: parsed.threat_type || '',
                    severity: parsed.severity || '',
                    description: parsed.description || '',
                    solution: parsed.solution || '',
                    prevention: parsed.prevention || '',
                    isDomainBlocked: !!parsed.domain_blocked
                });
            } catch (dbErr) {
                console.error('AIQuery DB save error:', dbErr);
            }

            return res.status(200).json(parsed);

        } catch (error: any) {
            console.error('Gemini API error:', error);
            return res.status(500).json({ status: 'error', message: 'AI analysis failed. Please try again.' });
        }
    }

    static async getHistory(req: AuthRequest, res: Response) {
        try {
            const records = await AIQuery.find({ userId: req.user._id })
                .sort({ createdAt: -1 })
                .limit(20);
            return res.status(200).json(records);
        } catch (error: any) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }
}
