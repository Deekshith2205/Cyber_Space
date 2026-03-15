import mongoose, { Schema, Document } from 'mongoose';

export interface IUserActivityLog extends Document {
    userId: string;
    username: string;
    actionType: string;
    target: string;
    timestamp: Date;
}

const UserActivityLogSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    actionType: { type: String, required: true },
    target: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<IUserActivityLog>('UserActivityLog', UserActivityLogSchema);
