import express from 'express';
import { AIController } from '../controllers/aiController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

// 1. Intent Detection
router.post('/analyze', authMiddleware, AIController.analyze);

// 2. Specific Modules
router.post('/account-recovery', authMiddleware, AIController.accountRecovery);
router.post('/job-scam', authMiddleware, AIController.jobScam);
router.post('/breach-check', authMiddleware, AIController.breachCheck);
router.post('/permission-analysis', authMiddleware, AIController.permissionAnalysis);
router.post('/payment-fraud', authMiddleware, AIController.paymentFraud);

router.get('/history', authMiddleware, AIController.getHistory);

export default router;
