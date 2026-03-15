import mongoose, { Schema, Document } from 'mongoose';

export interface IPhishingScan extends Document {
    url: string;
    threatStatus: string;
    confidenceScore: number;
    scanSource: string;
    scanDate: Date;
    userId: string;
    username: string;
}

const PhishingScanSchema: Schema = new Schema({
    url: { type: String, required: true },
    threatStatus: { type: String, required: true },
    confidenceScore: { type: Number, required: true },
    scanSource: { type: String, default: 'Google Safe Browsing' },
    scanDate: { type: Date, default: Date.now },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true }
});

export default mongoose.model<IPhishingScan>('PhishingScan', PhishingScanSchema);
