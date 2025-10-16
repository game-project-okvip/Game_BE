"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhitelistModel = exports.WhitelistModelName = void 0;
const mongoose_1 = require("mongoose");
const WhitelistSchema = new mongoose_1.Schema({
    ip: { type: String, required: true, trim: true, index: true, unique: true },
    description: { type: String, trim: true, default: "" },
    createBy: { type: String, trim: true, default: "none" },
    updateBy: { type: String, trim: true, default: "none" },
}, { timestamps: true, versionKey: false });
exports.WhitelistModelName = "whitelists";
exports.WhitelistModel = mongoose_1.models[exports.WhitelistModelName] ||
    (0, mongoose_1.model)(exports.WhitelistModelName, WhitelistSchema, exports.WhitelistModelName);
exports.default = exports.WhitelistModel;
//# sourceMappingURL=whitelist.model.js.map