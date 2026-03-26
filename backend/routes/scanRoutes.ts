/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { PhishingController } from '../controllers/phishingController';
import { VulnerabilityController } from '../controllers/vulnerabilityController';
import ThreatIntel from '../models/ThreatIntel';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

// Phishing Scan Endpoints
router.post('/phishing/check', authMiddleware, PhishingController.checkPhishing);
router.get('/phishing/stats', authMiddleware, PhishingController.getPhishingStats);
router.get('/phishing/latest', authMiddleware, PhishingController.getLatestScan);

// Vulnerability Scan Endpoints
router.post('/vulnerability/scan', authMiddleware, VulnerabilityController.scanVulnerability);
router.get('/vulnerabilities/stats', authMiddleware, VulnerabilityController.getVulnerabilityStats);
router.get('/vulnerabilities/latest', authMiddleware, VulnerabilityController.getLatestScan);

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
