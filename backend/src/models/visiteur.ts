import mongoose, { Schema, Document } from 'mongoose';

interface IVisiteur extends Document {
  nom: string;
  prenom: string;
  tel: string;
  email: string;
  date_embauche: Date;
  visites: mongoose.Types.ObjectId[];
}

const VisiteurSchema: Schema = new Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  tel: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  date_embauche: { type: Date, required: true },
  visites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Visite' }]
});

export default mongoose.model<IVisiteur>('Visiteur', VisiteurSchema);
