import express from 'express';
import { AdminController } from '../controllers/adminController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.get('/activity', authMiddleware, AdminController.getActivityLogs);

export default router;
