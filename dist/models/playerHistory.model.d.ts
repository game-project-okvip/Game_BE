import { Model, Types } from "mongoose";
export type GameResult = "win" | "loss" | "draw";
export interface IPlayerHistory {
    clientId: Types.ObjectId;
    game: string;
    status: GameResult;
    amount: number;
    createdAt?: Date;
}
export declare const PlayerHistoryModelName: "player_histories";
export declare const PlayerHistoryModel: Model<IPlayerHistory>;
export default PlayerHistoryModel;
//# sourceMappingURL=playerHistory.model.d.ts.map