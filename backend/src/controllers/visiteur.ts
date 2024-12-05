import { Request, Response } from 'express';
import Visiteur from '../models/visiteur';
import bcrypt, { compare, hash } from 'bcrypt';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

export const visiteurValidators = [
  body('email')
    .isEmail().withMessage('Veuillez entrer un email valide.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 5 }).withMessage('Le mot de passe doit contenir au moins 5 caractères.')
    .trim(),
  body('nom')
    .not().isEmpty().withMessage('Le nom est obligatoire')
    .trim(),
  body('prenom')
    .not().isEmpty().withMessage('Le prénom est obligatoire')
    .trim()
];

// Créer un nouveau visiteur
export const createVisiteur = async (req: Request, res: Response): Promise<void> => {
  // Vérifier les erreurs de validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array()[0].msg });
    return;
  }

  try {
    // Vérifier si l'email existe déjà
    const existingVisiteur = await Visiteur.findOne({ email: req.body.email });
    if (existingVisiteur) {
      res.status(400).json({ message: 'Cet email est déjà utilisé.' });
      return;
    }

    // Hasher le mot de passe avant de sauvegarder
    const hashedPassword = await hash(req.body.password, 10);

    // Créer un nouvel utilisateur avec le mot de passe hashé
    const visiteur = new Visiteur({
      ...req.body,
      password: hashedPassword
    });

    // Sauvegarder l'utilisateur et répondre
    const savedUser = await visiteur.save();
    
    // Générer un token JWT
    const token = jwt.sign(
      { userId: savedUser._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      userId: savedUser._id, 
      token,
      message: 'Visiteur créé avec succès !' 
    });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Erreur de création de visiteur' });
  }
};


export const getVisiteurs = async (_req: Request, res: Response) => {
  try {
    const users = await Visiteur.find();  //const users = await User.find({}, '-password'); // Exclure le mot de passe a faire plus tard 
    res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const signupValidators = [
  body('email').isEmail().withMessage('Veuillez entrer un email valide.').normalizeEmail(),
  body('password').isLength({ min: 5 }).withMessage('Le mot de passe doit contenir au moins 5 caractères.').trim(),
];

export const signup = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
	res.status(400).json({ error: errors.array()[0].msg });
	return;
  }

  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
	const visiteur = new Visiteur({ email, password: hashedPassword });
	await visiteur.save();
	res.status(201).json({ message: 'Visiteur créé !' });
  } catch (error) {
	res.status(500).json({ error: 'Erreur interne!!!.' });
  }
};

// Validateurs pour la connexion
export const loginValidators = [
  body('email')
    .isEmail().withMessage('Veuillez entrer un email valide.')
    .normalizeEmail(),
  body('password')
    .not().isEmpty().withMessage('Le mot de passe est obligatoire')
];

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Trouver l'utilisateur par email
    const visiteur = await Visiteur.findOne({ email });
    if (!visiteur) {
      res.status(401).json({ message: 'Visiteur non trouvé !' });
      return;
    }

    // Vérifier le mot de passe
    const isPasswordValid = await compare(password, visiteur.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Mot de passe incorrect !' });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { userId: visiteur._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    res.status(200).json({ 
      userId: visiteur._id, 
      token,
      message: 'Connexion réussie !' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur de connexion' });
  }
};
