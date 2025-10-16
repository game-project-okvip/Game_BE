import { Model } from "mongoose";
export interface IClient {
    username: string;
    name: string;
    balance: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const ClientModelName: "clients";
export declare const ClientModel: Model<IClient>;
export default ClientModel;
//# sourceMappingURL=client.model.d.ts.map