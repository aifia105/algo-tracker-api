import { z } from 'zod';
import { Difficulty } from '../enums/difficulty.enum';
import { Status } from '../enums/status.enum';

export const problemEntrySchema = z.object({
  problemId: z.string().min(1, 'Problem ID is required'),
  problemTitle: z
    .string()
    .min(1, 'Problem title is required')
    .max(200, 'Problem title must be at most 200 characters long'),
  problemUrl: z
    .string()
    .min(1, 'Problem URL is required')
    .url('Invalid URL format'),
  userId: z
    .string()
    .min(1, 'User ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid User ID format'),
  difficulty: z.nativeEnum(Difficulty, {
    errorMap: () => ({ message: 'Invalid difficulty level' }),
  }),
  language: z
    .string()
    .min(1, 'Programming language is required')
    .max(50, 'Language name must be at most 50 characters long'),
  attempts: z
    .number()
    .int('Attempts must be an integer')
    .min(0, 'Attempts cannot be negative')
    .max(1000, 'Attempts cannot exceed 1000'),
  tags: z
    .array(
      z
        .string()
        .min(1, 'Tag cannot be empty')
        .max(30, 'Tag must be at most 30 characters'),
    )
    .max(20, 'Cannot have more than 20 tags')
    .default([]),
  status: z.nativeEnum(Status, {
    errorMap: () => ({ message: 'Invalid status' }),
  }),
  TimeTaken: z
    .number()
    .min(0, 'Time taken cannot be negative')
    .max(86400, 'Time taken cannot exceed 24 hours (86400 seconds)'),
  cognitiveLoad: z
    .number()
    .int('Cognitive load must be an integer')
    .min(1, 'Cognitive load must be at least 1')
    .max(10, 'Cognitive load must be at most 10')
    .default(3),
  dateSolved: z
    .date()
    .or(z.string().transform((str) => new Date(str)))
    .refine((date) => date <= new Date(), 'Date solved cannot be in the future')
    .default(() => new Date()),
  notes: z
    .string()
    .max(1000, 'Notes must be at most 1000 characters long')
    .optional(),
});

export const updateProblemEntrySchema = problemEntrySchema.partial().omit({
  userId: true,
});

export const problemEntryParamsSchema = z.object({
  id: z
    .string()
    .min(1, 'Problem ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Problem ID format'),
});

export type ProblemEntryInput = z.infer<typeof problemEntrySchema>;
export type UpdateProblemEntryInput = z.infer<typeof updateProblemEntrySchema>;
export type ProblemEntryParams = z.infer<typeof problemEntryParamsSchema>;
