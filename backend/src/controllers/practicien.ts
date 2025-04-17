import { Request, Response } from 'express';
import Practicien from '../models/practicien';

export const createPracticien = async (req: Request, res: Response) => {
  try {
    const practicien = new Practicien(req.body);
    const savedPracticien = await practicien.save();
    res.status(201).json(savedPracticien);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'An unknown error occurred' });
    }
  }
};

export const getPracticiens = async (_req: Request, res: Response) => {
  try {
    const practiciens = await Practicien.find();
    res.status(200).json(practiciens);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const getPracticienById = async (req: Request, res: Response): Promise<void> => {
  try {
    const practicienId = req.params.id;
    // Récupérer le visiteur par ID et exclure le mot de passe
    const practicien = await Practicien.findById(practicienId).populate({
      path: 'visites',
      // Populate des références à l'intérieur de chaque visite
      populate: [
        { path: 'motif' }
      ]
    });
    
    if (!practicien) {
      res.status(404).json({ message: 'Praticien non trouvé' });
      return;
    }
    
    res.status(200).json(practicien);
  } catch (error) {
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Erreur lors de la récupération du praticien' 
    });
  }
};