import { Model, Types } from "mongoose";
export type TxType = "in" | "out";
export interface ITransaction {
    clientId: Types.ObjectId;
    amount: number;
    type: TxType;
    createdAt?: Date;
}
export declare const TransactionModelName: "transactions";
export declare const TransactionModel: Model<ITransaction>;
export default TransactionModel;
//# sourceMappingURL=transaction.model.d.ts.map