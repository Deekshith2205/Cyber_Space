import dotenv from 'dotenv';

// Load .env as early as possible for services that rely on it.
dotenv.config();

export const env = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 5000,
  MONGODB_URI: process.env.MONGODB_URI || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  BASE_URL: process.env.BASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'cyberspace_secret',
};

export const requireEnv = (key: keyof typeof env): string | number => {
  const value = env[key];
  if (!value) throw new Error(`${String(key)} is not configured`);
  return value;
};

