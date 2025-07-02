import express from 'express';
import { AppError } from '../exceptions/exceptions';
import {
  addProblem,
  deleteProblem,
  getAllProblems,
  getAllProblemTags,
  getProblemById,
  updateProblem,
} from '../services/problem.service';
import {
  validateBody,
  validateParams,
} from '../middlewares/validation.middleware';
import {
  problemEntrySchema,
  updateProblemEntrySchema,
  problemEntryParamsSchema,
} from '../validations/problem.validation';

const router = express.Router();

router.post('/add', validateBody(problemEntrySchema), async (req, res) => {
  try {
    const problemData = req.body;
    const newProblem = await addProblem(problemData);
    res.status(201).json(newProblem);
  } catch (error) {
    console.error('Error adding problem:', error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to add problem' });
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

router.get('/tags', async (req, res) => {
  try {
    const tags = await getAllProblemTags();
    res.status(200).json(tags);
  } catch (error) {
    console.error('Error getting problem tags:', error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to get problem tags' });
    }
  }
});

router.get(
  '/:id',
  validateParams(problemEntryParamsSchema),
  async (req, res) => {
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
  },
);

router.put(
  '/:id',
  validateParams(problemEntryParamsSchema),
  validateBody(updateProblemEntrySchema),
  async (req, res) => {
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
  },
);

router.delete(
  '/:id',
  validateParams(problemEntryParamsSchema),
  async (req, res) => {
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
  },
);

export default router;
