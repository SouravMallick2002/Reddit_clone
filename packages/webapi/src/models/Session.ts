import mongoose, { Schema, Document } from 'mongoose';

export interface SessionDocument extends Document {
  user: string
  ip?: string
  ua?: string
  createdAt: Date
  revokedAt?: Date
}

const SessionSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ip: {
    type: String,
    required: false
  },
  ua: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  revokedAt: {
    type: Date,
    required: false
  }
});

const Session = mongoose.model<SessionDocument>('Session', SessionSchema);

export default Session;
