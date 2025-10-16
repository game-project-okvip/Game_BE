"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = roleRoutes;
const role_controller_1 = require("../controller/role.controller");
const role_schema_1 = require("../schemas/role.schema");
const whitelist_middleware_1 = require("../middleware/whitelist.middleware");
async function roleRoutes(server) {
    const commonMiddleware = [
        whitelist_middleware_1.whitelistMiddleware,
        //checkAuthMiddleware,
        //rolePermissionMiddleware
    ];
    server.route({
        method: "POST",
        url: "/",
        preHandler: commonMiddleware,
        handler: role_controller_1.createRole,
        schema: {
            tags: ["Role"],
            summary: "Create Role",
            ...role_schema_1.roleCreateSchema,
        },
    });
    server.route({
        method: "GET",
        url: "/",
        preHandler: commonMiddleware,
        handler: role_controller_1.getRoles,
        schema: {
            tags: ["Role"],
            summary: "Get role list",
        },
    });
    server.route({
        method: "PATCH",
        url: "/",
        preHandler: commonMiddleware,
        handler: role_controller_1.updateRole,
        schema: {
            tags: ["Role"],
            summary: "Update role",
            ...role_schema_1.roleUpdateSchema,
        },
    });
}
//# sourceMappingURL=role.route.js.map