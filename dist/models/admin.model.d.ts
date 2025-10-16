import { Model, Types } from "mongoose";
export interface IAdmin {
    username: string;
    name: string;
    password: string;
    role: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const AdminModelName: "admins";
export declare const AdminModel: Model<IAdmin>;
export default AdminModel;
//# sourceMappingURL=admin.model.d.ts.map