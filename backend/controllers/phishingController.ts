/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import axios from 'axios';
import PhishingScan from '../models/PhishingScan';
import UserActivityLog from '../models/UserActivityLog';
import { AuthRequest } from '../middleware/authMiddleware';

export class PhishingController {
    static async checkPhishing(req: AuthRequest, res: Response) {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ status: "error", message: "URL is required" });
        }

        try {
            let analysisData: any = null;
            let scanSource = "Google Safe Browsing + Heuristics";

            // 1. Try to get detailed analysis from Python backend
            try {
                const pythonResponse = await axios.post('http://localhost:8000/api/phishing-check', { url }, { timeout: 5000 });
                analysisData = pythonResponse.data;
                scanSource = "CyberSpace AI Engine (Python)";
            } catch (pythonError) {
                console.warn('Python backend unavailable, falling back to basic Google Safe Browsing');
                
                // Fallback basic logic
                const API_KEY = process.env.GOOGLE_SAFE_BROWSING_KEY;
                const SAFE_BROWSING_URL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`;
                
                const sbPayload = {
                    client: { clientId: "cyberspace", clientVersion: "1.0.0" },
                    threatInfo: {
                        threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
                        platformTypes: ["ANY_PLATFORM"],
                        threatEntryTypes: ["URL"],
                        threatEntries: [{ url }]
                    }
                };

                const sbResponse = await axios.post(SAFE_BROWSING_URL, sbPayload);
                const sbData = sbResponse.data;

                analysisData = {
                    url,
                    risk_score: (sbData.matches && sbData.matches.length > 0) ? 95 : 0,
                    status: (sbData.matches && sbData.matches.length > 0) ? "Malicious" : "Safe",
                    checks: {
                        google_safe_browsing: !(sbData.matches && sbData.matches.length > 0),
                        https_secure: url.startsWith('https')
                    }
                };
            }

            // 2. Save result to MongoDB Atlas
            const scan = new PhishingScan({
                url,
                threatStatus: analysisData.status,
                confidenceScore: analysisData.risk_score,
                scanSource: scanSource,
                scanDate: new Date(),
                userId: req.user._id,
                username: req.user.name
            });

            await scan.save();

            // 3. Log user activity
            await UserActivityLog.create({
                userId: req.user._id,
                username: req.user.name,
                actionType: 'Phishing Scan',
                target: url
            });

            // 4. Return full analysis to frontend
            res.status(200).json(analysisData);

        } catch (error: any) {
            console.error('Phishing check error:', error);
            res.status(500).json({
                status: "error",
                message: "Failed to store scan result"
            });
        }
    }
}
