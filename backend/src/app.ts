import express from 'express';
import mongoose from 'mongoose';
import visiteurRoutes from './routes/visiteur';
import praticienRoutes from './routes/practicien';
import visiteRoutes from './routes/visite';
import motifRoutes from './routes/motif';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/visiteurs', visiteurRoutes);
app.use('/api/practiciens', praticienRoutes);
app.use('/api/visites', visiteRoutes);
app.use('/api/motifs', motifRoutes);

const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}`;

// MongoDB Connection
mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

export default app;

