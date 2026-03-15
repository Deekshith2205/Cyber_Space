import { Router } from 'express';
import { ThreatController } from '../controllers/threatController';

const router = Router();

router.get('/map', ThreatController.getThreatMap);
router.get('/trends', ThreatController.getThreatTrends);
router.get('/cves', ThreatController.getTopCVEs);

export default router;
