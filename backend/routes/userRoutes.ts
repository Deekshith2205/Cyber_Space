import express from 'express';
import { UserController } from '../controllers/userController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.get('/scans', authMiddleware, UserController.getUserScans);
router.put('/update', authMiddleware, UserController.updateProfile);

export default router;
