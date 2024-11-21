import express from 'express';
import mongoose from 'mongoose';
import visiteurRoutes from './routes/visiteur';
import praticienRoutes from './routes/practicien';
import visiteRoutes from './routes/visite';
import motifRoutes from './routes/motif';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', visiteurRoutes);
app.use('/api/practiciens', praticienRoutes);
app.use('/api/visites', visiteRoutes);
app.use('/api/motifs', motifRoutes);


// MongoDB Connection
mongoose.connect('mongodb+srv://paveltsanev:pRcmFc8IEgIYDd5v@cluster0.fcy3w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

export default app;


