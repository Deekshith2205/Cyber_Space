import { Router } from 'express';
import { ThreatController } from '../controllers/threatController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.get('/map', authMiddleware, ThreatController.getThreatMap);
router.get('/trends', authMiddleware, ThreatController.getThreatTrends);
router.get('/cves', authMiddleware, ThreatController.getTopCVEs);

export default router;
