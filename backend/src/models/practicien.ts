import mongoose, { Schema, Document } from 'mongoose';

interface IPraticien extends Document {
  nom: string;
  prenom: string;
  tel: string;
  email: string;
  rue: string;
  code_postal: string;
  ville: string;
  visites: mongoose.Types.ObjectId[];
}

const PraticienSchema: Schema = new Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  tel: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  rue: { type: String, required: true },
  code_postal: { type: String, required: true },
  ville: { type: String, required: true },
  visites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Visite' }]
});

export default mongoose.model<IPraticien>('Praticien', PraticienSchema);

