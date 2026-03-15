import express from 'express';
import cors from 'cors';
import { config } from './config/apiKeys';
import threatRoutes from './routes/threatRoutes';
import connectDatabase from './config/database';
import scanRoutes from './routes/scanRoutes';

const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDatabase();

// API Routes
app.use('/api/threat', threatRoutes);
app.use('/api', scanRoutes);

app.listen(config.port, () => {
    console.log(`CyberSpace backend running on port ${config.port}`);
});
