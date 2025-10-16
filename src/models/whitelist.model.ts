import { Schema, model, models, Model } from "mongoose";

export interface IWhitelist {
  ip: string;          // IPv4/IPv6 or CIDR
  description?: string;
  createBy?: string;
  updateBy?: string;
}

const WhitelistSchema = new Schema<IWhitelist>(
  {
    ip: { type: String, required: true, trim: true, index: true, unique: true },
    description: { type: String, trim: true, default: "" },
    createBy: { type: String, trim: true, default: "none" },
    updateBy: { type: String, trim: true, default: "none" },
  },
  { timestamps: true, versionKey: false }
);

export const WhitelistModelName = "whitelists" as const;
export const WhitelistModel: Model<IWhitelist> =
  (models[WhitelistModelName] as Model<IWhitelist>) ||
  model<IWhitelist>(WhitelistModelName, WhitelistSchema, WhitelistModelName);

export default WhitelistModel;
