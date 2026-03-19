import { Request, Response } from 'express';
import User from '../models/User';
import generateToken from '../utils/generateToken';

export class AuthController {
    // @desc    Register a new user
    // @route   POST /api/auth/register
    // @access  Public
    static async registerUser(req: Request, res: Response) {
        const { name, email, password } = req.body;

        try {
            const userExists = await User.findOne({ email });

            if (userExists) {
                return res.status(400).json({ status: "error", message: "User already exists" });
            }

            const user = await User.create({
                name,
                email,
                password
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
                    }
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
                }
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
}
