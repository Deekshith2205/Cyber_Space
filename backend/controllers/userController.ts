/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import PhishingScan from '../models/PhishingScan';
import VulnerabilityScan from '../models/VulnerabilityScan';
import User from '../models/User';

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

    // @desc    Update user profile
    // @route   PUT /api/user/update
    // @access  Private
    static async updateProfile(req: AuthRequest, res: Response) {
        try {
            const { name, email, designation } = req.body;

            if (!name || !email) {
                return res.status(400).json({ status: "error", message: "Name and email are required" });
            }

            if (designation && designation.length < 3) {
                return res.status(400).json({ status: "error", message: "Designation must be at least 3 characters long" });
            }

            const userId = req.user._id;

            // Check if email is already taken by another user
            const emailExists = await User.findOne({ email, _id: { $ne: userId } });
            if (emailExists) {
                return res.status(400).json({ status: "error", message: "Email is already in use by another account" });
            }

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { name, email, designation: designation || "user" },
                { new: true, runValidators: true }
            ).select('-password');

            if (!updatedUser) {
                return res.status(404).json({ status: "error", message: "User not found" });
            }

            res.json({
                status: "success",
                message: "Profile updated successfully",
                user: {
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    designation: updatedUser.designation
                }
            });
        } catch (error: any) {
            console.error('Error updating user profile:', error);
            res.status(500).json({ status: "error", message: "Server error while updating profile" });
        }
    }
}
