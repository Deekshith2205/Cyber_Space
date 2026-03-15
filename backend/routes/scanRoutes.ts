import express from 'express';
import { PhishingController } from '../controllers/phishingController';
import { VulnerabilityController } from '../controllers/vulnerabilityController';
import ThreatIntel from '../models/ThreatIntel';

const router = express.Router();

// Phishing Scan Endpoint
router.post('/phishing/check', PhishingController.checkPhishing);

// Vulnerability Scan Endpoint
router.post('/vulnerability/scan', VulnerabilityController.scanVulnerability);

// GET /api/threatintel - Retrieve stored threat intelligence records
router.get('/threatintel', async (req, res) => {
    try {
        const records = await ThreatIntel.find().sort({ timestamp: -1 });
        res.status(200).json(records);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
