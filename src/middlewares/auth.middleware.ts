import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/jwtService.service';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req);

    if (!token) {
      res.status(401).json({ message: 'Unauthorized access' });
      return;
    }

    const decoded = await verifyToken(token);

    if (!decoded) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

const extractTokenFromHeader = (req: Request): string | undefined => {
  const [type, token] = req.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
};
