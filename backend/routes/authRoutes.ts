import express from 'express';
import { AuthController } from '../controllers/authController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);
router.get('/me', authMiddleware, AuthController.getMe);

export default router;
