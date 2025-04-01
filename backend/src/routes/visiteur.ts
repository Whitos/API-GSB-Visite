import { Router } from 'express';
import { deleteVisiteur, getVisiteurById, getVisiteurs, login, signup, signupValidators } from '../controllers/visiteur';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Route pour récupérer tous les visiteurs
router.post('/signup', signupValidators, signup);
router.post('/login', login); //ratelimit
router.get('/', authMiddleware, getVisiteurs);
router.get('/', authMiddleware, getVisiteurById);
router.delete('/', authMiddleware, deleteVisiteur);

export default router;