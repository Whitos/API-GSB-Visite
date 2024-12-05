import express, { Request, Response, NextFunction } from 'express';
import { 
  signup, 
  login, 
  signupValidators,
  getVisiteurs,
  loginValidators
} from '../controllers/visiteur';
import { validationResult } from 'express-validator';
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

// Middleware de validation générique
const validate = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Exécuter toutes les validations
    await Promise.all(validations.map(validation => validation.run(req)));
    
    // Collecter les erreurs
        const errors = validationResult(req);
        if (errors.isEmpty()) {
          return next();
        }
    
        // S'il y a des erreurs, renvoyer la première
        res.status(400).json({ errors: errors.array()[0].msg });
  };
};

// Route pour créer un visiteur avec validation
//router.post('/', authMiddleware, validate(visiteurValidators), createVisiteur);

// Route pour récupérer tous les visiteurs
router.get('/', authMiddleware, getVisiteurs);

// Route pour l'inscription
router.post('/signup', authMiddleware, validate(signupValidators), signup);

// Route pour la connexion
router.post('/login', authMiddleware, validate(loginValidators), login);

export default router;