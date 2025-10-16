"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModel = exports.AdminModelName = void 0;
const mongoose_1 = require("mongoose");
const role_model_1 = require("./role.model");
const AdminSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: mongoose_1.Schema.Types.ObjectId, ref: role_model_1.RoleModelName, required: true, index: true },
}, { timestamps: true, versionKey: false });
exports.AdminModelName = "admins";
exports.AdminModel = mongoose_1.models[exports.AdminModelName] ||
    (0, mongoose_1.model)(exports.AdminModelName, AdminSchema, exports.AdminModelName);
exports.default = exports.AdminModel;
//# sourceMappingURL=admin.model.js.map