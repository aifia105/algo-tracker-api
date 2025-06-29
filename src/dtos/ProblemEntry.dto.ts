import { Difficulty } from '../enums/difficulty.enum';
import { Status } from '../enums/status.enum';
import { ProblemEntry } from '../models/ProblemEntry';

export class ProblemEntryDto {
  problemId!: string;
  problemTitle!: string;
  problemUrl!: string;
  userId!: string;
  difficulty!: Difficulty;
  language!: string;
  attempts!: number;
  tags!: string[];
  status!: Status;
  TimeTaken!: number;
  cognitiveLoad!: number;
  dateSolved!: Date;
  notes?: string;
}
