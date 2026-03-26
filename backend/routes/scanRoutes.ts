/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { PhishingController } from '../controllers/phishingController';
import { VulnerabilityController } from '../controllers/vulnerabilityController';
import ThreatIntel from '../models/ThreatIntel';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

// Phishing Scan Endpoint
router.post('/phishing/check', authMiddleware, PhishingController.checkPhishing);

// Vulnerability Scan Endpoint
router.post('/vulnerability/scan', authMiddleware, VulnerabilityController.scanVulnerability);

// Latest Vulnerabilities Endpoint
router.get('/latest-vulnerabilities', authMiddleware, VulnerabilityController.getLatestCVEs);

// GET /api/threatintel - Retrieve stored threat intelligence records
router.get('/threatintel', authMiddleware, async (req, res) => {
    try {
        const records = await ThreatIntel.find().sort({ timestamp: -1 });
        res.status(200).json(records);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
