require('ts-node').register();
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { scanUrl } = require('./virustotalScan');
const threatRoutes = require('./routes/threatRoutes').default;
const userRoutes = require('./routes/userRoutes').default;
const adminRoutes = require('./routes/adminRoutes').default;
const connectDatabase = require('./config/database').default;
const scanRoutes = require('./routes/scanRoutes').default;
const authRoutes = require('./routes/authRoutes').default;
const aiRoutes = require('./routes/aiRoutes').default;
const authMiddleware = require('./middleware/authMiddleware').default;

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// Connect to MongoDB
connectDatabase();

// Request logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.get('/ping', (req, res) => res.send('CyberSpace Backend Pong'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/threat', threatRoutes);
app.use('/api', scanRoutes);
app.use('/api/ai', aiRoutes);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
    next();
});

app.post('/api/scan-url', authMiddleware, async (req, res) => {
    const { url } = req.body;
    const apiKey = process.env.VIRUSTOTAL_API_KEY;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    if (!apiKey) {
        return res.status(500).json({ error: 'VirusTotal API key is not configured' });
    }

    try {
        const result = await scanUrl(url, apiKey);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`CyberSpace backend running on port ${PORT}`);
});