import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../exceptions/exceptions';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors
          .map((err) => {
            const path = err.path.join('.');
            return `${path}: ${err.message}`;
          })
          .join(', ');

        res.status(400).json({
          message: 'Validation failed',
          errors: errorMessages,
        });
        return;
      }
      next(error);
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedParams = schema.parse(req.params);
      req.params = validatedParams;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors
          .map((err) => {
            const path = err.path.join('.');
            return `${path}: ${err.message}`;
          })
          .join(', ');

        res.status(400).json({
          message: 'Invalid parameters',
          errors: errorMessages,
        });
        return;
      }
      next(error);
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedQuery = schema.parse(req.query);
      req.query = validatedQuery;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors
          .map((err) => {
            const path = err.path.join('.');
            return `${path}: ${err.message}`;
          })
          .join(', ');

        res.status(400).json({
          message: 'Invalid query parameters',
          errors: errorMessages,
        });
        return;
      }
      next(error);
    }
  };
};
