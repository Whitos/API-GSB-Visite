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