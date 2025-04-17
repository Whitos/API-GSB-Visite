import { Request, Response } from 'express';
import Visite from '../models/visite';
import Practicien from '../models/practicien';

export const createVisite = async (req: Request, res: Response) => {
  try {
    const visite = new Visite(req.body);
    const savedVisite = await visite.save();

    // Add the visite to the praticien's visites array
    await Practicien.updateOne(
      { _id: req.body.praticien },
      { $push: { visites: savedVisite._id } }
    );

    res.status(201).json(savedVisite);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'An unknown error occurred' });
    }
  }
};

export const getVisites = async (_req: Request, res: Response) => {
  try {
    const visites = await Visite.find().populate('visiteur praticien motif');
    res.status(200).json(visites);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};



