import mongoose, { Schema, Document } from 'mongoose';

export interface IThreatIntel extends Document {
    ipAddress: string;
    country: string;
    threatType: string;
    severity: string;
    timestamp: Date;
}

const ThreatIntelSchema: Schema = new Schema({
    ipAddress: { type: String, required: true },
    country: { type: String, required: true },
    threatType: { type: String, required: true },
    severity: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<IThreatIntel>('ThreatIntel', ThreatIntelSchema);
