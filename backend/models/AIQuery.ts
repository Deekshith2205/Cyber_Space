import mongoose, { Schema, Document } from 'mongoose';

export interface IAIQuery extends Document {
    userId: mongoose.Types.ObjectId;
    sessionId?: string;
    input: string;
    threat_type: string;
    severity: string;
    description: string;
    solution: string;
    prevention: string;
    isDomainBlocked: boolean;
    createdAt: Date;
}

const AIQuerySchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sessionId: { type: String, default: '' },
    input: { type: String, required: true },
    threat_type: { type: String, default: '' },
    severity: { type: String, default: '' },
    description: { type: String, default: '' },
    solution: { type: String, default: '' },
    prevention: { type: String, default: '' },
    isDomainBlocked: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IAIQuery>('AIQuery', AIQuerySchema);
