/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import UserActivityLog from '../models/UserActivityLog';

export class AdminController {
    // @desc    Get all activity logs
    // @route   GET /api/admin/activity
    // @access  Private/Admin
    static async getActivityLogs(req: AuthRequest, res: Response) {
        try {
            // Check if user is admin
            if (req.user.role !== 'admin') {
                return res.status(403).json({ status: "error", message: "Access denied. Admin clearance required." });
            }

            const logs = await UserActivityLog.find().sort({ timestamp: -1 });

            res.json({
                status: "success",
                data: logs
            });
        } catch (error: any) {
            console.error('Error fetching activity logs:', error);
            res.status(500).json({ status: "error", message: "Server error while fetching activity logs" });
        }
    }
}
