require('dotenv').config();
const express = require('express');
const { scanUrl } = require('./virustotalScan');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Basic CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    next();
});

app.post('/api/scan-url', async (req, res) => {
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
    console.log(`Server running on port ${PORT}`);
});
