const axios = require('axios');

async function scanUrl(url, apiKey) {
    try {
        // Step 1: Submit URL for analysis
        const submitResponse = await axios.post(
            'https://www.virustotal.com/api/v3/urls',
            `url=${encodeURIComponent(url)}`,
            {
                headers: {
                    'x-apikey': apiKey,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const analysisId = submitResponse.data.data.id;

        // Step 2: Get analysis results
        // In a production environment, we might need to poll if the status is "queued"
        // But for this implementation, we'll try to fetch it directly or after a short delay
        let analysisData;
        let attempts = 0;
        const maxAttempts = 15; // Increased from 5

        while (attempts < maxAttempts) {
            const resultResponse = await axios.get(
                `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
                {
                    headers: {
                        'x-apikey': apiKey
                    }
                }
            );

            analysisData = resultResponse.data.data.attributes;
            
            if (analysisData.status === 'completed') {
                break;
            }

            // Wait 5 seconds before polling again
            await new Promise(resolve => setTimeout(resolve, 5000)); // Increased from 2s
            attempts++;
        }

        if (!analysisData || analysisData.status !== 'completed') {
            throw new Error('Analysis timed out');
        }

        const stats = analysisData.stats;
        let threatLevel = 'Safe';
        
        if (stats.malicious > 0) {
            threatLevel = 'Malicious';
        } else if (stats.suspicious > 0) {
            threatLevel = 'Suspicious';
        }

        // Map engine results to the format expected by the frontend
        const engineResults = Object.keys(analysisData.results || {}).map(engineName => {
            const result = analysisData.results[engineName];
            return {
                engine: engineName,
                category: result.category,
                result: result.result,
                method: result.method || 'unknown'
            };
        });

        // Only include malicious or suspicious results for the detailed table, 
        // but the frontend UI can filter this if needed. 
        // For now, let's keep all and let the frontend decide, 
        // or just return the detections if it's too many.
        const detections = engineResults.filter(r => ['malicious', 'suspicious'].includes(r.category));

        return {
            threatLevel,
            malicious: stats.malicious,
            suspicious: stats.suspicious,
            harmless: stats.harmless,
            undetected: stats.undetected,
            scanDate: new Date().toISOString().split('T')[0],
            analysisLink: `https://www.virustotal.com/gui/url/${analysisId.includes('-') ? analysisId.split('-')[1] : analysisId}`,
            engineResults: detections.length > 0 ? detections : engineResults.slice(0, 10) // Show detections or first 10
        };

    } catch (error) {
        console.error('VirusTotal API Error Details:', error.response?.data || error.message);
        const vtErrorMessage = error.response?.data?.error?.message || error.message;
        throw new Error(`VirusTotal Analysis Failed: ${vtErrorMessage}`);
    }
}

module.exports = { scanUrl };
