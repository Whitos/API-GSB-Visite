import mongoose, { Schema, Document } from 'mongoose';
import mongooseEncryption from 'mongoose-encryption';
import dotenv from 'dotenv';

dotenv.config();

interface IVisiteur extends Document {
  nom: string;
  prenom: string;
  tel: string;
  email: string;
  date_embauche: Date;
  visites?: Schema.Types.ObjectId[];
}

const VisiteurSchema: Schema = new Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  tel: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  date_embauche: { type: Date, required: true },
  visites: [{ type: Schema.Types.ObjectId, ref: 'Visite' }]
});

const encryptionKey = process.env.ENCRYPTION_KEY
const signingKey = process.env.SIGNING_KEY

VisiteurSchema.plugin(mongooseEncryption, { encryptionKey, signingKey, encryptedFields: ['nom','prenom','tel', 'email','date_embauche'] });

export default mongoose.model<IVisiteur>('Visiteur', VisiteurSchema);
