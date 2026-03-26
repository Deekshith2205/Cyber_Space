import express from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { IncidentReportController } from '../controllers/incidentReportController';

const router = express.Router();

// POST /api/analyze
router.post('/analyze', authMiddleware, IncidentReportController.analyze);

// POST /api/generate-report
router.post('/generate-report', authMiddleware, IncidentReportController.generateReport);

// POST /api/generate-pdf
router.post('/generate-pdf', authMiddleware, IncidentReportController.generatePdf);

// POST /api/save-report
router.post('/save-report', authMiddleware, IncidentReportController.saveReport);

// GET /api/reports/:userId
router.get('/reports/:userId', authMiddleware, IncidentReportController.getUserReports);

export default router;

