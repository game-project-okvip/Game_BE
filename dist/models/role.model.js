"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleModel = exports.RoleModelName = void 0;
const mongoose_1 = require("mongoose");
const MethodsSchema = new mongoose_1.Schema({
    GET: { type: Boolean, default: false },
    POST: { type: Boolean, default: false },
    PATCH: { type: Boolean, default: false },
    DELETE: { type: Boolean, default: false },
}, { _id: false });
const RoleSchema = new mongoose_1.Schema({
    role: { type: String, required: true, unique: true, trim: true, index: true },
    isSuperAdmin: { type: Boolean, required: true, default: false },
    permission: {
        type: Object,
        required: true,
        default: {},
    },
    create_by: { type: String, default: null, trim: true },
}, { timestamps: true, versionKey: false });
exports.RoleModelName = "roles";
exports.RoleModel = mongoose_1.models[exports.RoleModelName] ||
    (0, mongoose_1.model)(exports.RoleModelName, RoleSchema, exports.RoleModelName);
exports.default = exports.RoleModel;
//# sourceMappingURL=role.model.js.map