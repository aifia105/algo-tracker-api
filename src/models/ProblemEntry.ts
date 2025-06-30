import mongoose, { Schema, Document } from 'mongoose';
import { Difficulty } from '../enums/difficulty.enum';
import { Status } from '../enums/status.enum';

export interface ProblemEntry extends Document {
  _id: mongoose.Types.ObjectId;
  problemId: string;
  problemTitle: string;
  problemUrl: string;
  userId: string;
  difficulty: Difficulty;
  language: string;
  attempts: number;
  tags: string[];
  status: Status;
  TimeTaken: number;
  cognitiveLoad: number;
  dateSolved: Date;
  notes: string;
}

const ProblemEntrySchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    problemId: { type: String, required: true },
    problemTitle: { type: String, required: true },
    problemUrl: { type: String, required: true },
    difficulty: {
      type: String,
      enum: Object.values(Difficulty),
      required: true,
    },
    language: { type: String, required: true },
    tags: { type: [String], default: [], require: true },
    attempts: { type: Number, default: 0 },
    status: { type: String, enum: Object.values(Status), required: true },
    TimeTaken: { type: Number, default: 0, required: true },
    cognitiveLoad: { type: Number, default: 3 },
    dateSolved: { type: Date, default: Date.now, require: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true },
);

const ProblemEntryModel = mongoose.model<ProblemEntry>(
  'ProblemEntry',
  ProblemEntrySchema,
);

export default ProblemEntryModel;
