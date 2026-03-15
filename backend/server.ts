import express from 'express';
import cors from 'cors';
import { config } from './config/apiKeys';
import threatRoutes from './routes/threatRoutes';

const app = express();

app.use(express.json());
app.use(cors());

// Threat Intelligence API Routes
app.use('/api/threat', threatRoutes);

// Backward compatibility (if needed)
// app.post('/api/scan-url', ...)

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});
