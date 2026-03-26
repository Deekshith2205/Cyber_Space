import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';

let cachedGenAI: GoogleGenerativeAI | null = null;

const getGenAI = (): GoogleGenerativeAI => {
  if (cachedGenAI) return cachedGenAI;
  if (!env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not configured');
  cachedGenAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  return cachedGenAI;
};

export const getGenerativeModel = (modelName = 'gemini-2.5-flash') => {
  return getGenAI().getGenerativeModel({ model: modelName });
};

