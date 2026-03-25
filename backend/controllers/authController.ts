/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import User from '../models/User';
import generateToken from '../utils/generateToken';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,12}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validatePasswordStrength = (password: string) => {
    return passwordRegex.test(password);
};

const validateEmail = (email: string) => {
    return emailRegex.test(email);
};

export class AuthController {
    // @desc    Register a new user
    // @route   POST /api/auth/register
    // @access  Public
    static async registerUser(req: Request, res: Response) {
        const { name, email, password } = req.body;

        try {
            // CRITICAL: EMAIL FORMAT CHECK
            if (!validateEmail(email)) {
                return res.status(400).json({ status: "error", message: "Please enter a valid email address" });
            }

            const userExists = await User.findOne({ email });

            if (userExists) {
                return res.status(400).json({ status: "error", message: "User already exists" });
            }

            // CRITICAL: PASSWORD STRENGTH CHECK
            if (!validatePasswordStrength(password)) {
                return res.status(400).json({ 
                    status: "error", 
                    message: "Password does not meet security requirements (8-12 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character)" 
                });
            }

            // Generate Verification Token
            const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

            const user = await User.create({
                name,
                email,
                password,
                verificationToken,
                isVerified: false // Default but explicit
            });

            if (user) {
                res.status(201).json({
                    status: "success",
                    message: "User registered successfully",
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        designation: user.designation || "user"
                    },
                    verificationLink: `http://localhost:3000/verify-email?token=${verificationToken}` // For demo purposes
                });
            } else {
                res.status(400).json({ status: "error", message: "Invalid user data" });
            }
        } catch (error: any) {
            console.error('Registration error:', error);
            res.status(500).json({ status: "error", message: "Server error during registration" });
        }
    }

    // @desc    Authenticate a user & get token
    // @route   POST /api/auth/login
    // @access  Public
    static async loginUser(req: Request, res: Response) {
        try {
            console.log("Incoming login:", req.body);
            const { email, password } = req.body;

            // STEP 1 — VALIDATE REQUEST BODY
            if (!email || !password) {
                return res.status(400).json({ status: "error", message: "Email and password required" });
            }

            // STEP 2 — FIND USER SAFELY
            const user = await User.findOne({ email });
            console.log("User found:", user ? "YES" : "NO");

            if (!user) {
                return res.status(400).json({ status: "error", message: "User not found" });
            }

            // STEP 3 — PASSWORD VERIFICATION
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({ status: "error", message: "Invalid credentials" });
            }

            // STEP 3.5 — VERIFICATION CHECK
            // if (!user.isVerified) {
            //     return res.status(403).json({ 
            //         status: "error", 
            //         message: "Please verify your email address to access CyberSpace",
            //         needsVerification: true 
            //     });
            // }

            // Check if password is weak for existing user (to prompt upgrade)
            const isWeakPassword = !validatePasswordStrength(password);

            // STEP 4 — JWT TOKEN GENERATION
            if (!process.env.JWT_SECRET) {
                console.error("JWT_SECRET is missing in .env");
                return res.status(500).json({ status: "error", message: "Internal server error: JWT config missing" });
            }

            const token = generateToken((user._id as any).toString(), user.email);

            // STEP 5 — SAFE RESPONSE FORMAT
            res.json({
                status: "success",
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    designation: user.designation || "user"
                },
                isWeakPassword // Flag for frontend to prompt upgrade
            });

        } catch (error: any) {
            // STEP 6 — GLOBAL ERROR HANDLING
            console.error("LOGIN ERROR:", error.message, error.stack);
            res.status(500).json({ status: "error", message: "Internal server error" });
        }
    }
    
    // @desc    Get current user profile
    // @route   GET /api/auth/me
    // @access  Private
    static async getMe(req: any, res: Response) {
        try {
            const user = await User.findById(req.user._id).select('-password');
            if (user) {
                res.json({
                    status: "success",
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        designation: user.designation || "user"
                    }
                });
            } else {
                res.status(404).json({ status: "error", message: "User not found" });
            }
        } catch (error: any) {
            console.error('Get profile error:', error);
            res.status(500).json({ status: "error", message: "Server error while fetching profile" });
        }
    }

    // @desc    Verify email address
    // @route   GET /api/auth/verify/:token
    // @access  Public
    static async verifyEmail(req: Request, res: Response) {
        const { token } = req.params;

        try {
            const user = await User.findOne({ verificationToken: token });

            if (!user) {
                return res.status(400).json({ status: "error", message: "Invalid or expired verification token" });
            }

            user.isVerified = true;
            user.verificationToken = undefined;
            await user.save();

            res.json({
                status: "success",
                message: "Email verified successfully! You can now sign in."
            });
        } catch (error: any) {
            console.error('Verification error:', error);
            res.status(500).json({ status: "error", message: "Server error during email verification" });
        }
    }
}
