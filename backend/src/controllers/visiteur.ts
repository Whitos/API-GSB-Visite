import { Request, Response } from 'express';
import Visiteur from '../models/visiteur';
import { compare, hash } from 'bcrypt';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

// Validateurs pour l'inscription avec tous les champs requis
export const signupValidators = [
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

// Validateurs pour la connexion
export const loginValidators = [
  body('email')
    .isEmail().withMessage('Veuillez entrer un email valide.')
    .normalizeEmail(),
  body('password')
    .not().isEmpty().withMessage('Le mot de passe est obligatoire')
    .trim()
];


/**
 * Récupérer tous les visiteurs
 */
export const getVisiteurs = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Exclure le mot de passe des résultats pour la sécurité
    const users = await Visiteur.find({}, '-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Erreur lors de la récupération des visiteurs' 
    });
  }
};

/**
 * Récupérer un visiteur par son ID
 */
export const getVisiteurById = async (req: Request, res: Response): Promise<void> => {
  try {
    const visiteurId = req.params.id;
    
    // Vérifier si l'ID est valide
    if (!visiteurId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({ message: 'ID de visiteur invalide' });
      return;
    }
    
    // Récupérer le visiteur par ID et exclure le mot de passe
    const visiteur = await Visiteur.findById(visiteurId, '-password');
    
    if (!visiteur) {
      res.status(404).json({ message: 'Visiteur non trouvé' });
      return;
    }
    
    res.status(200).json(visiteur);
  } catch (error) {
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Erreur lors de la récupération du visiteur' 
    });
  }
};

/**
 * Mettre à jour un visiteur par son ID
 */
export const updateVisiteur = async (req: Request, res: Response): Promise<void> => {
  try {
    const visiteurId = req.params.id;
    const { email, nom, prenom, password } = req.body;

    // Vérifier si l'ID est valide
    if (!visiteurId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({ message: 'ID de visiteur invalide' });
      return;
    }

    // Vérifier si le visiteur existe
    const existingVisiteur = await Visiteur.findById(visiteurId);
    if (!existingVisiteur) {
      res.status(404).json({ message: 'Visiteur non trouvé' });
      return;
    }

    // Mettre à jour les champs
    if (email) existingVisiteur.email = email;
    if (nom) existingVisiteur.nom = nom;
    if (prenom) existingVisiteur.prenom = prenom;
    if (password) existingVisiteur.password = await hash(password, 10); // Hacher le mot de passe

    // Sauvegarder les modifications
    await existingVisiteur.save();

    res.status(200).json({ message: 'Visiteur mis à jour avec succès', visiteur: existingVisiteur });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Erreur lors de la mise à jour du visiteur',
    });
  }
};
/**
 * Supprimer un visiteur par son ID
 */
export const deleteVisiteur = async (req: Request, res: Response): Promise<void> => {
  try {
    const visiteurId = req.params.id;
    
    // Vérifier si l'ID est valide
    if (!visiteurId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({ message: 'ID de visiteur invalide' });
      return;
    }
    
    // Supprimer le visiteur
    const result = await Visiteur.findByIdAndDelete(visiteurId);
    
    if (!result) {
      res.status(404).json({ message: 'Visiteur non trouvé' });
      return;
    }
    
    res.status(200).json({ message: 'Visiteur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Erreur lors de la suppression du visiteur' 
    });
  }
};

/**
 * Inscription d'un nouveau visiteur
 */
export const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Vérifier si l'email existe déjà
    const existingVisiteur = await Visiteur.findOne({ email });
    if (existingVisiteur) {
      res.status(400).json({ message: 'Cet email est déjà utilisé.' });
      return;
    }

    const hashedPassword = await hash(password, 10);
    const visiteur = new Visiteur({ email, password: hashedPassword });
    await visiteur.save();
    
    // Générer un token JWT
    const token = jwt.sign(
      { userId: visiteur._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      userId: visiteur._id,
      token,
      message: 'Visiteur créé avec succès !' 
    });
  } catch (error) {
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Erreur lors de l\'inscription' 
    });
  }
};

/**
 * Connexion d'un visiteur
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Trouver l'utilisateur par email
    const visiteur = await Visiteur.findOne({ email });
    if (!visiteur) {
      res.status(401).json({ message: 'Identifiants incorrects' });
      return;
    }

    // Vérifier le mot de passe
    const isPasswordValid = await compare(password, visiteur.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Identifiants incorrects' });
      return;
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
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Erreur lors de la connexion' 
    });
  }
};