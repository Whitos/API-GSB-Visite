import { Request, Response } from 'express';
import Motif from '../models/motif';

export const createMotif = async (req: Request, res: Response) => {
  try {
    const motif = new Motif(req.body);
    const savedMotif = await motif.save();
    res.status(201).json(savedMotif);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'An unknown error occurred' });
    }
  }
};

export const getMotifs = async (_req: Request, res: Response) => {
  try {
    const motifs = await Motif.find();
    res.status(200).json(motifs);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};