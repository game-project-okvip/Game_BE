"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = whitelistRoutes;
const whitelist_controller_1 = require("../controller/whitelist.controller");
const whitelist_schema_1 = require("../schemas/whitelist.schema");
const whitelist_middleware_1 = require("../middleware/whitelist.middleware");
const checkAuth_middleware_1 = require("../middleware/checkAuth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
async function whitelistRoutes(server) {
    const commonMiddleware = [
        whitelist_middleware_1.whitelistMiddleware,
        checkAuth_middleware_1.checkAuthMiddleware,
        role_middleware_1.rolePermissionMiddleware
    ];
    server.route({
        method: "POST",
        url: "/",
        preHandler: commonMiddleware,
        handler: whitelist_controller_1.create_whitelist,
        schema: {
            tags: ["Whitelist"],
            summary: "Create IP whitelist",
            ...whitelist_schema_1.createWhitelistSchema,
        },
    });
    server.route({
        method: "GET",
        url: "/",
        preHandler: commonMiddleware,
        handler: whitelist_controller_1.get_whitelist,
        schema: {
            tags: ["Whitelist"],
            summary: "Get IP whitelist list",
        },
    });
    server.route({
        method: "PATCH",
        url: "/",
        preHandler: commonMiddleware,
        handler: whitelist_controller_1.update_whitelist,
        schema: {
            tags: ["Whitelist"],
            summary: "Update IP whitelist",
            ...whitelist_schema_1.updateWhitelistSchema,
        },
    });
    server.route({
        method: "DELETE",
        url: "/",
        preHandler: commonMiddleware,
        handler: whitelist_controller_1.delete_whitelist,
        schema: {
            tags: ["Whitelist"],
            summary: "Delete IP whitelist",
            ...whitelist_schema_1.deleteWhitelistSchema,
        },
    });
}
//# sourceMappingURL=whitelist.route.js.map