import { Schema, model, models, Model, Types } from "mongoose";
import { RoleModelName } from "./role.model";

export interface IAdmin {
  username: string;
  name: string;
  password: string;
  role: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    username: { type: String, required: true, unique: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: Schema.Types.ObjectId, ref: RoleModelName, required: true, index: true },
  },
  { timestamps: true, versionKey: false }
);

export const AdminModelName = "admins" as const;
export const AdminModel: Model<IAdmin> =
  (models[AdminModelName] as Model<IAdmin>) ||
  model<IAdmin>(AdminModelName, AdminSchema, AdminModelName);

export default AdminModel;
