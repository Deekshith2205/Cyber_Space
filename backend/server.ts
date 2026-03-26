import express from 'express';
import cors from 'cors';
import { config } from './config/apiKeys';
import threatRoutes from './routes/threatRoutes';
import connectDatabase from './config/database';
import scanRoutes from './routes/scanRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

app.use(express.json());
app.use(cors());

import aiRoutes from './routes/aiRoutes';

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/threat', threatRoutes);
app.use('/api', scanRoutes);
app.use('/api/ai', aiRoutes);

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDatabase();
        
        app.listen(config.port as number, '0.0.0.0', () => {
            console.log(`CyberSpace backend running on port ${config.port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
