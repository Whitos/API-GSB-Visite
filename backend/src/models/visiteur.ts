import mongoose, { Schema, Document} from 'mongoose';
import mongooseEncryption from 'mongoose-encryption';
import dotenv from 'dotenv';


dotenv.config();

interface IVisiteur extends Document {
  nom?: string;
  prenom?: string;
  tel?: string;
  email: string;
  password: string;
  date_embauche?: Date;
  visites?: Schema.Types.ObjectId[];
}

const VisiteurSchema: Schema = new Schema({
  nom: { type: String, required: false},
  prenom: { type: String, required: false},
  tel: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date_embauche: { type: Date, required: false },
  visites: [{ type: Schema.Types.ObjectId, ref: 'Visite' }]
});


const signingKey = process.env.SIGNING_KEY

VisiteurSchema.plugin(mongooseEncryption, {  secret: signingKey, encryptedFields: ['nom','prenom','tel','date_embauche'] });

export default mongoose.model<IVisiteur>('Visiteur', VisiteurSchema);
