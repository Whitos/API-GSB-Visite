import { Request, Response } from 'express';
import User from '../models/visiteur';
import { hash } from 'bcrypt';

export const createUser = async (req: Request, res: Response) => {
  try {
    // Hasher le mot de passe avant de sauvegarder
    const hashedPassword = await hash(req.body.password, 10);

    // Créer un nouvel utilisateur avec le mot de passe hashé
    const user = new User({
      ...req.body,
      password: hashedPassword
    });

    // Sauvegarder l'utilisateur et répondre
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();  //const users = await User.find({}, '-password'); // Exclure le mot de passe a faire plus tard 
    res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};