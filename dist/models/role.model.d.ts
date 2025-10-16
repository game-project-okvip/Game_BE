import { Model } from "mongoose";
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
export declare const RoleModelName: "roles";
export declare const RoleModel: Model<IRole>;
export default RoleModel;
//# sourceMappingURL=role.model.d.ts.map