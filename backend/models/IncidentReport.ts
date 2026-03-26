import mongoose, { Document, Schema } from 'mongoose';

export interface IIncidentReport extends Document {
  userId: mongoose.Types.ObjectId;
  incidentType: string;
  description: string;
  riskLevel: string;
  evidence: string[];
  reportText: string;
  pdfUrl: string;
  createdAt: Date;
}

const IncidentReportSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  incidentType: { type: String, required: true, index: true },
  description: { type: String, required: true },
  riskLevel: { type: String, required: true, index: true },
  evidence: { type: [String], default: [] },
  reportText: { type: String, required: true },
  pdfUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IIncidentReport>('IncidentReport', IncidentReportSchema);

