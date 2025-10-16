"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientModel = exports.ClientModelName = void 0;
const mongoose_1 = require("mongoose");
const ClientSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    balance: { type: Number, required: true, default: 0, min: 0 },
}, { timestamps: true, versionKey: false });
exports.ClientModelName = "clients";
exports.ClientModel = mongoose_1.models[exports.ClientModelName] ||
    (0, mongoose_1.model)(exports.ClientModelName, ClientSchema, exports.ClientModelName);
exports.default = exports.ClientModel;
//# sourceMappingURL=client.model.js.map