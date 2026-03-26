import { z } from 'zod';

export const incidentTypeEnum = z.enum([
  'Phishing',
  'Malware',
  'Ransomware',
  'Social Engineering',
  'Data Breach',
  'Network Attack',
  'Other',
]);

export const riskLevelEnum = z.enum(['Low', 'Medium', 'High', 'Critical']);

const nonEmptyTrimmedString = z.string().trim().min(1);

export const analyzeIncidentRequestSchema = z.object({
  // Primary user narrative.
  description: z.string().trim().min(5).max(5000),
  // Optional evidence/tool output that the user already collected.
  toolData: z
    .unknown()
    .optional()
    .refine((v) => v === undefined || typeof v === 'object', {
      message: 'toolData must be an object/array if provided',
    }),
});

export type AnalyzeIncidentRequest = z.infer<typeof analyzeIncidentRequestSchema>;

export const analyzeIncidentGeminiOutputSchema = z
  .object({
    domain_blocked: z.boolean().default(false),
    incidentType: incidentTypeEnum,
    riskLevel: riskLevelEnum,
    confidence: z.coerce.number().min(0).max(1),
    summary: z.string().trim().min(5).max(1000),
  })
  .strict();

export const generateReportRequestSchema = z.object({
  incidentType: incidentTypeEnum,
  description: z.string().trim().min(5).max(5000),
  riskLevel: riskLevelEnum,
  evidence: z.array(z.string().trim().min(1).max(2000)).optional(),
});

export type GenerateReportRequest = z.infer<typeof generateReportRequestSchema>;

export const generateReportGeminiOutputSchema = z
  .object({
    domain_blocked: z.boolean().default(false),
    incidentType: incidentTypeEnum,
    description: nonEmptyTrimmedString.max(5000),
    impact: z.string().trim().min(5).max(2000),
    riskLevel: riskLevelEnum,
    recommendations: z.array(z.string().trim().min(1).max(600)).min(1).max(15),
    reportingAuthority: z.string().trim().min(3).max(200),
  })
  .strict();

export type GenerateReportGeminiOutput = z.infer<typeof generateReportGeminiOutputSchema>;

export const structuredIncidentReportSchema = z.object({
  incidentType: incidentTypeEnum,
  description: nonEmptyTrimmedString.max(5000),
  impact: z.string().trim().min(5).max(2000),
  riskLevel: riskLevelEnum,
  recommendations: z.array(z.string().trim().min(1).max(600)).min(1).max(15),
  reportingAuthority: z.string().trim().min(3).max(200),
});

export const generatePdfRequestSchema = z
  .object({
    reportText: z.string().trim().min(10).max(20000).optional(),
    report: structuredIncidentReportSchema.optional(),
  })
  .refine((v) => Boolean(v.reportText) || Boolean(v.report), {
    message: 'Either reportText or report must be provided',
  });

export type GeneratePdfRequest = z.infer<typeof generatePdfRequestSchema>;

export const saveIncidentReportRequestSchema = z.object({
  incidentType: incidentTypeEnum,
  description: z.string().trim().min(5).max(5000),
  riskLevel: riskLevelEnum,
  evidence: z.array(z.string().trim().min(1).max(2000)).optional(),
  reportText: z.string().trim().min(10).max(20000),
  pdfUrl: z.string().url().max(2048),
});

export type SaveIncidentReportRequest = z.infer<typeof saveIncidentReportRequestSchema>;

