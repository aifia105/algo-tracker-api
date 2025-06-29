import express from 'express';
import { AppError } from '../exceptions/exceptions';
import {
  addProblem,
  deleteProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
} from '../services/problem.service';

const router = express.Router();

router.post('/add', async (req, res) => {
  try {
    const problemData = req.body;
    const newProblem = await addProblem(problemData);
    res.status(201).json(newProblem);
  } catch (error) {
    console.error('Error adding problem:', error);
    res.status(500).json({ message: 'Failed to add problem' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const problemId = req.params.id;
    const problem = await getProblemById(problemId);
    res.status(200).json(problem);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to get problem' });
    }
  }
});

router.get('/all', async (req, res) => {
  try {
    const problems = await getAllProblems();
    res.status(200).json(problems);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to get all problems' });
    }
  }
});

router.put('/:id', async (req, res) => {
  try {
    const problemId = req.params.id;
    const updateData = req.body;
    const updatedProblem = await updateProblem(problemId, updateData);
    res.status(200).json(updatedProblem);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to update problem' });
    }
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const problemId = req.params.id;
    const result = await deleteProblem(problemId);
    if (result) {
      res.status(200).json({ message: 'Problem deleted successfully' });
    } else {
      res.status(404).json({ message: 'Problem not found' });
    }
  } catch (error) {
    console.error('Error deleting problem:', error);
    res.status(500).json({ message: 'Failed to delete problem' });
  }
});

export default router;
