import express from 'express';
import mongoose from 'mongoose';
import visiteurRoutes from './routes/visiteur';
import praticienRoutes from './routes/practicien';
import visiteRoutes from './routes/visite';
import motifRoutes from './routes/motif';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}${process.env.MONGO_NAME}`;

// MongoDB Connection
mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Middleware
app.use(express.json());

// Middleware CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Routes
app.use('/api/visiteurs', visiteurRoutes);
app.use('/api/practiciens', praticienRoutes);
app.use('/api/visites', visiteRoutes);
app.use('/api/motifs', motifRoutes);
app.use('api/auth', visiteurRoutes);


export default app;

