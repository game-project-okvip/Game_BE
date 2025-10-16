"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userRoutes;
const user_controller_1 = require("../controller/user.controller");
const user_schema_1 = require("../schemas/user.schema");
const whitelist_middleware_1 = require("../middleware/whitelist.middleware");
const checkAuth_middleware_1 = require("../middleware/checkAuth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
async function userRoutes(server) {
    const commonMiddleware = [
        whitelist_middleware_1.whitelistMiddleware,
        checkAuth_middleware_1.checkAuthMiddleware,
        role_middleware_1.rolePermissionMiddleware
    ];
    server.route({
        method: "GET",
        url: "/",
        preHandler: commonMiddleware,
        handler: user_controller_1.getAdminAccounts,
        schema: {
            tags: ["User"],
            summary: "Get User list",
        },
    });
    server.route({
        method: "POST",
        url: "/",
        preHandler: commonMiddleware,
        handler: user_controller_1.createAdminAccounts,
        schema: {
            tags: ["User"],
            summary: "Create User Account",
            ...user_schema_1.createUserSchema
        },
    });
    server.route({
        method: "GET",
        url: "/detail",
        preHandler: commonMiddleware,
        handler: user_controller_1.getAdminDetail,
        schema: {
            tags: ["User"],
            summary: "Get User Detail",
            ...user_schema_1.UserSchema
        },
    });
    server.route({
        method: "PATCH",
        url: "/",
        preHandler: commonMiddleware,
        handler: user_controller_1.updateUser,
        schema: {
            tags: ["User"],
            summary: "Update User Account",
            ...user_schema_1.updateUserSchema
        },
    });
    server.route({
        method: "DELETE",
        url: "/",
        preHandler: commonMiddleware,
        handler: user_controller_1.deleteUser,
        schema: {
            tags: ["User"],
            summary: "Delete User",
            ...user_schema_1.UserSchema
        },
    });
}
//# sourceMappingURL=user.route.js.map