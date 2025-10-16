"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = exports.TransactionModelName = void 0;
const mongoose_1 = require("mongoose");
const client_model_1 = require("./client.model");
const TransactionSchema = new mongoose_1.Schema({
    clientId: { type: mongoose_1.Schema.Types.ObjectId, ref: client_model_1.ClientModelName, required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ["in", "out"], required: true, index: true },
}, { timestamps: { createdAt: true, updatedAt: false }, versionKey: false });
TransactionSchema.index({ clientId: 1, createdAt: -1 });
exports.TransactionModelName = "transactions";
exports.TransactionModel = mongoose_1.models[exports.TransactionModelName] ||
    (0, mongoose_1.model)(exports.TransactionModelName, TransactionSchema, exports.TransactionModelName);
exports.default = exports.TransactionModel;
//# sourceMappingURL=transaction.model.js.map