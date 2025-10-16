"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolePermissionMiddleware = void 0;
const role_model_1 = __importDefault(require("../models/role.model"));
const rolePermissionMiddleware = async (request, reply) => {
    try {
        const user = request.userData;
        if (!user?.role?._id) {
            return reply.code(403).send({ message: "No role assigned to user" });
        }
        const rawUrl = request.raw.url || '';
        const method = request.method;
        const path = rawUrl.split('?')[0];
        let permissionKey = path.split('/').filter(Boolean)[0];
        // if (permissionKey == "promo") {
        //   permissionKey = "promotion"
        // }
        const role = await role_model_1.default.findById(user.role._id);
        if (!role) {
            return reply.code(403).send({ message: "Account not authorized" });
        }
        const hasPermission = role.permission?.[permissionKey]?.[method];
        if (!hasPermission) {
            return reply.code(403).send({ message: "Permission denied" });
        }
        // Allow request
    }
    catch (error) {
        request.log.error("rolePermissionMiddleware error:", error);
        return reply.code(500).send({ message: error.message || "Internal server error" });
    }
};
exports.rolePermissionMiddleware = rolePermissionMiddleware;
//# sourceMappingURL=role.middleware.js.map