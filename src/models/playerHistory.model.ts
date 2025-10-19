import { Schema, model, models, Model, Types } from "mongoose";
import { ClientModelName } from "./client.model";

export type GameResult = "win" | "loss" | "draw";

export interface IPlayerHistory {
  clientId: Types.ObjectId;
  game: string;
  status: GameResult;
  amount: number;
  createdAt?: Date;
}

const PlayerHistorySchema = new Schema<IPlayerHistory>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: ClientModelName, required: true, index: true },
    game: { type: String, required: true, trim: true, index: true },
    status: { type: String, enum: ["Win", "Lose", "Draw"], required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

PlayerHistorySchema.index({ clientId: 1, createdAt: -1 });

export const PlayerHistoryModelName = "player_histories" as const;
export const PlayerHistoryModel: Model<IPlayerHistory> =
  (models[PlayerHistoryModelName] as Model<IPlayerHistory>) ||
  model<IPlayerHistory>(PlayerHistoryModelName, PlayerHistorySchema, PlayerHistoryModelName);

export default PlayerHistoryModel;
