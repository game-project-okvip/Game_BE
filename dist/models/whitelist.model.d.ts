import { Model } from "mongoose";
export interface IWhitelist {
    ip: string;
    description?: string;
    createBy?: string;
    updateBy?: string;
}
export declare const WhitelistModelName: "whitelists";
export declare const WhitelistModel: Model<IWhitelist>;
export default WhitelistModel;
//# sourceMappingURL=whitelist.model.d.ts.map