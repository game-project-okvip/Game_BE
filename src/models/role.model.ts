import { Schema, model, models, Model } from "mongoose";

export interface Permission {
  [module: string]: {
    GET: boolean;
    POST: boolean;
    PATCH: boolean;
    DELETE: boolean;
  };
}

export interface IRole {
  role: string;
  isSuperAdmin: boolean;
  permission: Permission;
  create_by: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const MethodsSchema = new Schema(
  {
    GET: { type: Boolean, default: false },
    POST: { type: Boolean, default: false },
    PATCH: { type: Boolean, default: false },
    DELETE: { type: Boolean, default: false },
  },
  { _id: false }
);

const RoleSchema = new Schema<IRole>(
  {
    role: { type: String, required: true, unique: true, trim: true, index: true },
    isSuperAdmin: { type: Boolean, required: true, default: false },
    permission: {
      type: Object,
      required: true,
      default: {},
    },
    create_by: { type: String, default: null, trim: true },
  },
  { timestamps: true, versionKey: false }
);

export const RoleModelName = "roles" as const;
export const RoleModel: Model<IRole> =
  (models[RoleModelName] as Model<IRole>) ||
  model<IRole>(RoleModelName, RoleSchema, RoleModelName);

export default RoleModel;
