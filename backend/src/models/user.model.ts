import { Schema, model, Types } from 'mongoose';
import { StatusUtilisateur } from '../common/status-utilisateur';

export interface User {
  _id: string;
  prenom: string;
  email: string;
  password?: string;
  isChecked: boolean;

  role: StatusUtilisateur;
}

const schema = new Schema<User>(
  {
    prenom: String,
    email: { type: String },
    password: { type: String, required: true },
    isChecked: { type: Boolean, default: false },

    role: { type: String, required: true, enum: StatusUtilisateur }
  },
  { timestamps: { createdAt: true } }
);

export const UserModel = model<User>('User', schema);
