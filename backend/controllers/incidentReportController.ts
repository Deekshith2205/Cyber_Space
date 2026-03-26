import { Response } from 'express';
import path from 'path';
import fs from 'fs';
import PDFDocument from 'pdfkit';
import { z } from 'zod';
import mongoose from 'mongoose';
import IncidentReport from '../models/IncidentReport';
import { AuthRequest } from '../middleware/authMiddleware';
import {
  analyzeIncidentRequestSchema,
  generatePdfRequestSchema,
  generateReportRequestSchema,
  saveIncidentReportRequestSchema,
} from '../schemas/incidentReportSchemas';
import { analyzeIncident, generateStructuredReport } from '../services/geminiIncidentService';

const formatReportText = (report: {
  incidentType: string;
  description: string;
  impact: string;
  riskLevel: string;
  recommendations: string[];
  reportingAuthority: string;
}): string => {
  const recommendationsText = report.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n');
  return [
    'CYBERSPACE - INCIDENT REPORT (Structured)',
    '',
    `Incident Type: ${report.incidentType}`,
    `Risk Level: ${report.riskLevel}`,
    '',
    'Description:',
    report.description,
    '',
    'Impact:',
    report.impact,
    '',
    'Recommendations:',
    recommendationsText,
    '',
    `Reporting Authority (India): ${report.reportingAuthority}`,
  ].join('\n');
};

const getBaseUrlFromRequest = (req: AuthRequest): string => {
  // Controllers only rely on a baseUrl for creating downloadable URLs.
  // Prefer a configured base url so the frontend can access it through tunnels/proxies.
  const configured = process.env.BASE_URL;
  if (configured && configured.trim()) return configured.trim().replace(/\/$/, '');
  return `${req.protocol}://${req.get('host')}`;
};

export class IncidentReportController {
  static async analyze(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

      const description =
        (req.body?.description as unknown) ??
        (req.body?.userDescription as unknown) ??
        (req.body?.message as unknown);
      const toolData = req.body?.toolData;

      const parsed = analyzeIncidentRequestSchema.parse({ description, toolData });
      const analysis = await analyzeIncident({ description: parsed.description, toolData: parsed.toolData });

      if (analysis.domain_blocked) {
        return res.status(403).json({
          status: 'error',
          message: 'I can only assist with cybersecurity-related queries.',
        });
      }

      const { incidentType, riskLevel, confidence, summary } = analysis;
      return res.status(200).json({ incidentType, riskLevel, confidence, summary });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ status: 'error', issues: err.issues });
      }
      console.error('analyzeIncident error:', err);
      return res.status(500).json({ status: 'error', message: 'AI analysis failed.' });
    }
  }

  static async generateReport(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

      const incidentInput = req.body?.incident ?? req.body;
      const parsed = generateReportRequestSchema.parse(incidentInput);

      const structured = await generateStructuredReport({
        incidentType: parsed.incidentType,
        description: parsed.description,
        riskLevel: parsed.riskLevel,
        evidence: parsed.evidence,
      });

      if (structured.domain_blocked) {
        return res.status(403).json({
          status: 'error',
          message: 'I can only assist with cybersecurity-related queries.',
        });
      }

      const reportText = formatReportText({
        incidentType: structured.incidentType,
        description: structured.description,
        impact: structured.impact,
        riskLevel: structured.riskLevel,
        recommendations: structured.recommendations,
        reportingAuthority: structured.reportingAuthority,
      });

      return res.status(200).json({
        incidentType: structured.incidentType,
        description: structured.description,
        impact: structured.impact,
        riskLevel: structured.riskLevel,
        recommendations: structured.recommendations,
        reportingAuthority: structured.reportingAuthority,
        reportText,
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ status: 'error', issues: err.issues });
      }
      console.error('generateReport error:', err);
      return res.status(500).json({ status: 'error', message: 'Report generation failed.' });
    }
  }

  static async generatePdf(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

      const parsed = generatePdfRequestSchema.parse(req.body ?? {});
      const reportText =
        parsed.reportText ??
        (parsed.report
          ? formatReportText({
              incidentType: parsed.report.incidentType,
              description: parsed.report.description,
              impact: parsed.report.impact,
              riskLevel: parsed.report.riskLevel,
              recommendations: parsed.report.recommendations,
              reportingAuthority: parsed.report.reportingAuthority,
            })
          : undefined);

      if (!reportText) {
        return res.status(400).json({ status: 'error', message: 'reportText is required.' });
      }

      const userId = req.user._id.toString();
      const downloadsRoot = path.join(process.cwd(), 'generated_pdfs');
      const userDir = path.join(downloadsRoot, userId);
      fs.mkdirSync(userDir, { recursive: true });

      const filename = `incident-report-${Date.now()}.pdf`;
      const filePath = path.join(userDir, filename);

      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      doc.fontSize(16).text('CYBERSPACE - INCIDENT REPORT', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(10).text(`Generated at: ${new Date().toISOString()}`);
      doc.moveDown(1);

      doc.fontSize(11).text(reportText, { align: 'left' });
      doc.end();

      await new Promise<void>((resolve, reject) => {
        writeStream.on('finish', () => resolve());
        writeStream.on('error', (e) => reject(e));
      });

      const baseUrl = getBaseUrlFromRequest(req);
      // Static route configured in server bootstrap.
      const pdfUrl = `${baseUrl}/downloads/${userId}/${filename}`;

      return res.status(200).json({ pdfUrl });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ status: 'error', issues: err.issues });
      }
      console.error('generatePdf error:', err);
      return res.status(500).json({ status: 'error', message: 'PDF generation failed.' });
    }
  }

  static async saveReport(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

      const parsed = saveIncidentReportRequestSchema.parse(req.body ?? {});

      const saved = await IncidentReport.create({
        userId: req.user._id,
        incidentType: parsed.incidentType,
        description: parsed.description,
        riskLevel: parsed.riskLevel,
        evidence: parsed.evidence ?? [],
        reportText: parsed.reportText,
        pdfUrl: parsed.pdfUrl,
      });

      return res.status(201).json(saved);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ status: 'error', issues: err.issues });
      }
      console.error('saveReport error:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to save report.' });
    }
  }

  static async getUserReports(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

      const userId = String(req.params.userId || '');
      const requesterId = req.user._id.toString();
      const isAdmin = req.user.role === 'admin';

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ status: 'error', message: 'Invalid userId.' });
      }

      if (!isAdmin && userId !== requesterId) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied.',
        });
      }

      const reports = await IncidentReport.find({ userId }).sort({ createdAt: -1 }).limit(100);
      return res.status(200).json(reports);
    } catch (err: any) {
      console.error('getUserReports error:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to fetch reports.' });
    }
  }
}

