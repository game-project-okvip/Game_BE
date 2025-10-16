import { Schema, model, models, Model } from "mongoose";

export interface IClient {
  username: string;
  name: string;
  balance: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    username: { type: String, required: true, unique: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    balance: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true, versionKey: false }
);

export const ClientModelName = "clients" as const;
export const ClientModel: Model<IClient> =
  (models[ClientModelName] as Model<IClient>) ||
  model<IClient>(ClientModelName, ClientSchema, ClientModelName);

export default ClientModel;
