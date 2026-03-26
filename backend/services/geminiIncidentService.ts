import { getGenerativeModel } from './geminiClient';
import {
  analyzeIncidentGeminiOutputSchema,
  generateReportGeminiOutputSchema,
  type GenerateReportGeminiOutput,
} from '../schemas/incidentReportSchemas';

type AnalyzeIncidentArgs = {
  description: string;
  toolData?: unknown;
};

const stripCodeFences = (text: string) =>
  text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();

const extractFirstJsonObject = (text: string): string => {
  const stripped = stripCodeFences(text);
  const firstBrace = stripped.indexOf('{');
  const lastBrace = stripped.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error('Gemini response does not contain a JSON object');
  }
  return stripped.slice(firstBrace, lastBrace + 1);
};

const safeJsonParse = <T>(text: string): T => {
  const jsonCandidate = extractFirstJsonObject(text);
  return JSON.parse(jsonCandidate) as T;
};

export type AnalyzeIncidentResult = {
  domain_blocked: boolean;
  incidentType: string;
  riskLevel: string;
  confidence: number;
  summary: string;
};

export const analyzeIncident = async ({
  description,
  toolData,
}: AnalyzeIncidentArgs): Promise<AnalyzeIncidentResult> => {
  const model = getGenerativeModel('gemini-2.5-flash');

  const prompt = [
    `You are a cybersecurity expert assistant named CYBERSPACE AI.`,
    `Only answer cybersecurity-related content.`,
    ``,
    `If the user input is NOT cybersecurity-related, you MUST set "domain_blocked": true and return a safe JSON with the following values:`,
    `"incidentType": "Other", "riskLevel": "Low", "confidence": 0, "summary": "I can only assist with cybersecurity-related queries."`,
    ``,
    `If it IS cybersecurity-related, analyze the incident and return ONLY valid JSON (no markdown) with exactly these keys:`,
    `domain_blocked (boolean), incidentType, riskLevel, confidence (number 0..1), summary (2-3 sentences).`,
    ``,
    `Allowed incidentType: Phishing | Malware | Ransomware | Social Engineering | Data Breach | Network Attack | Other.`,
    `Allowed riskLevel: Low | Medium | High | Critical.`,
    ``,
    `User input:`,
    `Description: ${description.trim()}`,
    `ToolData (optional): ${typeof toolData === 'undefined' ? 'null' : JSON.stringify(toolData)}`,
  ].join('\n');

  try {
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    const parsed = safeJsonParse(rawText);
    const validated = analyzeIncidentGeminiOutputSchema.parse(parsed);
    return validated;
  } catch (e) {
    // Fail-closed: do not return potentially unsafe/incorrect content.
    return {
      domain_blocked: true,
      incidentType: 'Other',
      riskLevel: 'Low',
      confidence: 0,
      summary: 'I can only assist with cybersecurity-related queries.',
    };
  }
};

export const generateStructuredReport = async (args: {
  incidentType: string;
  description: string;
  riskLevel: string;
  evidence?: string[];
}): Promise<GenerateReportGeminiOutput> => {
  const model = getGenerativeModel('gemini-2.5-flash');

  const prompt = [
    `You are a cybersecurity incident report generator for India.`,
    `Only work with cybersecurity-related incidents.`,
    ``,
    `If the input is NOT cybersecurity-related, set "domain_blocked": true and return this safe JSON:`,
    `"incidentType": "Other", "description": "<redacted>", "impact": "<redacted>",`,
    `"riskLevel": "Low", "recommendations": ["I can only assist with cybersecurity-related queries."],`,
    `"reportingAuthority": "CERT-In (Computer Emergency Response Team for India)"`,
    ``,
    `If it IS cybersecurity-related, produce a clear structured incident report and return ONLY valid JSON (no markdown) with exactly these keys:`,
    `domain_blocked (boolean), incidentType, description, impact, riskLevel, recommendations (array of strings), reportingAuthority (string).`,
    ``,
    `Allowed incidentType: Phishing | Malware | Ransomware | Social Engineering | Data Breach | Network Attack | Other.`,
    `Allowed riskLevel: Low | Medium | High | Critical.`,
    ``,
    `Input fields:`,
    `incidentType: ${args.incidentType}`,
    `description: ${args.description.trim()}`,
    `riskLevel: ${args.riskLevel}`,
    `evidence (optional): ${args.evidence?.length ? JSON.stringify(args.evidence) : 'null'}`,
  ].join('\n');

  try {
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    const parsed = safeJsonParse(rawText);
    const validated = generateReportGeminiOutputSchema.parse(parsed);
    return validated;
  } catch (e) {
    // Fail-closed: do not return potentially unsafe/incorrect content.
    return {
      domain_blocked: true,
      incidentType: 'Other',
      description: '[redacted]',
      impact: '[redacted]',
      riskLevel: 'Low',
      recommendations: ['I can only assist with cybersecurity-related queries.'],
      reportingAuthority: 'CERT-In (Computer Emergency Response Team for India)',
    };
  }
};

