import e from 'express';
import { ProblemEntryDto } from '../dtos/ProblemEntry.dto';
import { NotFoundError } from '../exceptions/exceptions';
import ProblemEntryModel from '../models/ProblemEntry';

export const addProblem = async (
  problemData: ProblemEntryDto,
): Promise<ProblemEntryDto> => {
  try {
    const newProblem = new ProblemEntryModel(problemData);
    const savedProblem = await newProblem.save();
    return savedProblem;
  } catch (error) {
    console.error('Error adding problem:', error);
    throw new Error('Failed to add problem');
  }
};

export const getProblemById = async (
  problemId: string,
): Promise<ProblemEntryDto | null> => {
  try {
    const problem = await ProblemEntryModel.findById(problemId);
    if (!problem) {
      throw new NotFoundError('Problem not found');
    }
    return problem;
  } catch (error) {
    console.error('Error getting problem by ID:', error);
    throw new Error('Failed to get problem by ID');
  }
};

export const getAllProblems = async (): Promise<ProblemEntryDto[]> => {
  try {
    const problems = await ProblemEntryModel.find();
    return problems;
  } catch (error) {
    console.error('Error getting all problems:', error);
    throw new Error('Failed to get all problems');
  }
};

export const updateProblem = async (
  problemId: string,
  updateData: Partial<ProblemEntryDto>,
): Promise<ProblemEntryDto | null> => {
  try {
    const updatedProblem = await ProblemEntryModel.findByIdAndUpdate(
      problemId,
      updateData,
      { new: true },
    );
    if (!updatedProblem) {
      throw new NotFoundError('Problem not found');
    }
    return updatedProblem;
  } catch (error) {
    console.error('Error updating problem:', error);
    throw new Error('Failed to update problem');
  }
};

export const deleteProblem = async (problemId: string): Promise<boolean> => {
  try {
    const result = await ProblemEntryModel.findByIdAndDelete(problemId);
    if (!result) {
      throw new NotFoundError('Problem not found');
    }
    return result !== null;
  } catch (error) {
    console.error('Error deleting problem:', error);
    throw new Error('Failed to delete problem');
  }
};
