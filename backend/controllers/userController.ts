import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import PhishingScan from '../models/PhishingScan';
import VulnerabilityScan from '../models/VulnerabilityScan';

export class UserController {
    // @desc    Get all scans for the logged-in user
    // @route   GET /api/user/scans
    // @access  Private
    static async getUserScans(req: AuthRequest, res: Response) {
        try {
            const userId = req.user._id;

            const phishingScans = await PhishingScan.find({ userId }).sort({ scanDate: -1 });
            const vulnerabilityScans = await VulnerabilityScan.find({ userId }).sort({ scanDate: -1 });

            res.json({
                status: "success",
                data: {
                    phishing: phishingScans,
                    vulnerability: vulnerabilityScans
                }
            });
        } catch (error: any) {
            console.error('Error fetching user scans:', error);
            res.status(500).json({ status: "error", message: "Server error while fetching scan history" });
        }
    }
}
