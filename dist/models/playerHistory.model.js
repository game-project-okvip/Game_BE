"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerHistoryModel = exports.PlayerHistoryModelName = void 0;
const mongoose_1 = require("mongoose");
const client_model_1 = require("./client.model");
const PlayerHistorySchema = new mongoose_1.Schema({
    clientId: { type: mongoose_1.Schema.Types.ObjectId, ref: client_model_1.ClientModelName, required: true, index: true },
    game: { type: String, required: true, trim: true, index: true },
    status: { type: String, enum: ["win", "loss", "draw"], required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
}, { timestamps: { createdAt: true, updatedAt: false }, versionKey: false });
PlayerHistorySchema.index({ clientId: 1, createdAt: -1 });
exports.PlayerHistoryModelName = "player_histories";
exports.PlayerHistoryModel = mongoose_1.models[exports.PlayerHistoryModelName] ||
    (0, mongoose_1.model)(exports.PlayerHistoryModelName, PlayerHistorySchema, exports.PlayerHistoryModelName);
exports.default = exports.PlayerHistoryModel;
//# sourceMappingURL=playerHistory.model.js.map