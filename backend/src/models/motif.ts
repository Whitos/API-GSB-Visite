import mongoose, { Schema, Document } from "mongoose";

interface IMotif extends Document {
  libelle: string;
}

const MotifSchema: Schema = new Schema({
  libelle: { type: String, required: true },
});

export default mongoose.model<IMotif>("Motif", MotifSchema);