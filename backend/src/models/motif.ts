import mongoose, { Schema, Document } from "mongoose";

interface IMotif extends Document {
  libelle: string;
  description?: string;  // Rend description optionnel
}

const MotifSchema: Schema = new Schema({
  libelle: { type: String, required: true },
  description: { type: String }
});

export default mongoose.model<IMotif>("Motif", MotifSchema);