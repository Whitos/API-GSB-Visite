import mongoose, { Schema, Document, CallbackError } from 'mongoose';
import mongooseEncryption from 'mongoose-encryption';
import dotenv from 'dotenv';
import { hash } from 'bcrypt'


dotenv.config();

interface IVisiteur extends Document {
  nom: string;
  prenom: string;
  tel: string;
  email: string;
  login: string;
  password: string;
  date_embauche: Date;
  visites?: Schema.Types.ObjectId[];
}

const VisiteurSchema: Schema = new Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  tel: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date_embauche: { type: Date, required: true },
  visites: [{ type: Schema.Types.ObjectId, ref: 'Visite' }]
});

VisiteurSchema.pre<IVisiteur>('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const hashedPassword = await hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

const encryptionKey = process.env.ENCRYPTION_KEY
const signingKey = process.env.SIGNING_KEY

VisiteurSchema.plugin(mongooseEncryption, { encryptionKey, signingKey, encryptedFields: ['nom','prenom','tel', 'email','date_embauche', 'login'] });

export default mongoose.model<IVisiteur>('Visiteur', VisiteurSchema);
