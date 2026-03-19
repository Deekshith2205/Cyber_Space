import express from 'express';
import { AIController } from '../controllers/aiController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

// POST /api/ai/analyze — analyze user cybersecurity query
router.post('/analyze', authMiddleware, AIController.analyze);

// GET /api/ai/history — retrieve user's query history
router.get('/history', authMiddleware, AIController.getHistory);

export default router;
