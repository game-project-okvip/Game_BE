"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authRoutes;
const auth_controller_1 = require("../controller/auth.controller");
const auth_schema_1 = require("../schemas/auth.schema");
const whitelist_middleware_1 = require("../middleware/whitelist.middleware");
async function authRoutes(server) {
    server.route({
        method: 'POST',
        url: '/login',
        preHandler: whitelist_middleware_1.whitelistMiddleware,
        handler: auth_controller_1.login,
        schema: {
            tags: ['Auth'],
            summary: 'Login with username & password',
            ...auth_schema_1.loginSchema
        }
    });
}
//# sourceMappingURL=auth.route.js.map