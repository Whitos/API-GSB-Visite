import { Request } from 'express';


export interface AuthenticatedRequest extends Request {
  auth?: { visiteurId: string }; 
}
