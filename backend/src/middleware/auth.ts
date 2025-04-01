import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/authenticatedRequest'; // Importer l'interface


interface DecodedToken {
  visiteurId: string;
}


export const authMiddleware = (
  req: AuthenticatedRequest, 
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('Authorization header is missing.');
    }


    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;


    req.auth = { visiteurId: decodedToken.visiteurId }; 
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized request' });
  }
};
