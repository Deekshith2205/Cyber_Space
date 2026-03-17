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
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });

            if (user && (await user.comparePassword(password))) {
                res.json({
                    status: "success",
                    token: generateToken((user._id as unknown) as string, user.email),
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        designation: user.designation || "user"
                    }
                });
            } else {
                res.status(401).json({ status: "error", message: "Invalid email or password" });
            }
        } catch (error: any) {
            console.error('Login error:', error);
            res.status(500).json({ status: "error", message: "Server error during login" });
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
