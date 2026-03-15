import jwt from 'jsonwebtoken';

const generateToken = (userId: string, email: string) => {
    return jwt.sign(
        { userId, email },
        process.env.JWT_SECRET || 'cyberspace_secret',
        { expiresIn: '24h' }
    );
};

export default generateToken;
