import { Request, Response } from 'express';
import { ThreatService } from '../services/threatService';
import { CVEService } from '../services/cveService';
import NodeCache from 'node-cache';
import { config } from '../config/apiKeys';

// Setup Cache
const cache = new NodeCache({ stdTTL: config.cache.ttl });

export class ThreatController {
    static async getThreatMap(req: Request, res: Response) {
        try {
            const cacheKey = 'threatMap';
            const cachedData = cache.get(cacheKey);
            if (cachedData) {
                return res.json(cachedData);
            }

            const data = await ThreatService.getGlobalThreats();
            cache.set(cacheKey, data, 60); // Cache for 60 seconds
            
            res.json(data);
        } catch (error) {
            console.error('Error fetching threat map:', error);
            res.status(500).json({ status: "error", message: "Threat intelligence temporarily unavailable" });
        }
    }

    static async getThreatTrends(req: Request, res: Response) {
        try {
            const cacheKey = 'threatTrends';
            const cachedData = cache.get(cacheKey);
            if (cachedData) {
                return res.json(cachedData);
            }

            const data = await ThreatService.getThreatTrends();
            cache.set(cacheKey, data, 15);
            
            res.json(data);
        } catch (error) {
            console.error('Error fetching threat trends:', error);
            res.status(500).json({ status: "error", message: "Threat intelligence temporarily unavailable" });
        }
    }

    static async getTopCVEs(req: Request, res: Response) {
        try {
            const cacheKey = 'topCVEs';
            const cachedData = cache.get(cacheKey);
            if (cachedData) {
                return res.json(cachedData);
            }

            const data = await CVEService.getLatestHighRiskCVEs();
            cache.set(cacheKey, data);
            
            res.json(data);
        } catch (error) {
            console.error('Error fetching top CVEs:', error);
            res.status(500).json({ status: "error", message: "Threat intelligence temporarily unavailable" });
        }
    }
}
