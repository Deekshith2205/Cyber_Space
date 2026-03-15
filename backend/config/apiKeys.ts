import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 5000,
    apiKeys: {
        virusTotal: process.env.VIRUSTOTAL_API_KEY || '',
        abuseIPDB: process.env.ABUSEIPDB_API_KEY || '',
    },
    cache: {
        ttl: 600, // 10 minutes default
    }
};

export const requireApiKey = (keyName: keyof typeof config.apiKeys) => {
    const key = config.apiKeys[keyName];
    if (!key) {
        console.warn(`Warning: API Key for ${keyName} is missing.`);
    }
    return key;
};
