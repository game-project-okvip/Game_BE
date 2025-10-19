import { FastifyInstance } from "fastify";
import { createRole, updateRole, getRoles } from "../controller/role.controller";
import { roleCreateSchema, roleUpdateSchema } from "../schemas/role.schema";
import { whitelistMiddleware } from "../middleware/whitelist.middleware";
import { checkAuthMiddleware } from "../middleware/checkAuth.middleware";
import { rolePermissionMiddleware } from "../middleware/role.middleware";

export default async function roleRoutes(server: FastifyInstance) {
    const commonMiddleware = [
        whitelistMiddleware,
        checkAuthMiddleware,
        rolePermissionMiddleware
    ];

    server.route({
        method: "POST",
        url: "/",
        preHandler: commonMiddleware,
        handler: createRole,
        schema: {
        tags: ["Role"],
        summary: "Create Role",
        ...roleCreateSchema,
        },
    });

    server.route({
        method: "GET",
        url: "/",
        preHandler: commonMiddleware,
        handler: getRoles,
        schema: {
        tags: ["Role"],
        summary: "Get role list",
        },
    });

    server.route({
        method: "PATCH",
        url: "/",
        preHandler: commonMiddleware,
        handler: updateRole,
        schema: {
        tags: ["Role"],
        summary: "Update role",
        ...roleUpdateSchema,
        },
    });
}