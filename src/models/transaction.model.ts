import { Schema, model, models, Model, Types } from "mongoose";
import { ClientModelName } from "./client.model";

export type TxType = "in" | "out";

export interface ITransaction {
  clientId: Types.ObjectId;
  amount: number;
  type: TxType;
  createdAt?: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: ClientModelName, required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ["in", "out"], required: true, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

TransactionSchema.index({ clientId: 1, createdAt: -1 });

export const TransactionModelName = "transactions" as const;
export const TransactionModel: Model<ITransaction> =
  (models[TransactionModelName] as Model<ITransaction>) ||
  model<ITransaction>(TransactionModelName, TransactionSchema, TransactionModelName);

export default TransactionModel;
