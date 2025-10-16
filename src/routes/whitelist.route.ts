import { FastifyInstance } from "fastify";
import { create_whitelist, update_whitelist, get_whitelist, delete_whitelist } from "../controller/whitelist.controller";
import { createWhitelistSchema, updateWhitelistSchema, deleteWhitelistSchema } from "../schemas/whitelist.schema";
import { whitelistMiddleware } from "../middleware/whitelist.middleware";
import { checkAuthMiddleware } from "../middleware/checkAuth.middleware";
import { rolePermissionMiddleware } from "../middleware/role.middleware";

export default async function whitelistRoutes(server: FastifyInstance) {
    const commonMiddleware = [
        whitelistMiddleware,
        checkAuthMiddleware,
        rolePermissionMiddleware
    ];

    server.route({
        method: "POST",
        url: "/",
        preHandler: commonMiddleware,
        handler: create_whitelist,
        schema: {
        tags: ["Whitelist"],
        summary: "Create IP whitelist",
        ...createWhitelistSchema,
        },
    });

    server.route({
        method: "GET",
        url: "/",
        preHandler: commonMiddleware,
        handler: get_whitelist,
        schema: {
        tags: ["Whitelist"],
        summary: "Get IP whitelist list",
        },
    });

    server.route({
        method: "PATCH",
        url: "/",
        preHandler: commonMiddleware,
        handler: update_whitelist,
        schema: {
        tags: ["Whitelist"],
        summary: "Update IP whitelist",
        ...updateWhitelistSchema,
        },
    });

    server.route({
        method: "DELETE",
        url: "/",
        preHandler: commonMiddleware,
        handler: delete_whitelist,
        schema: {
        tags: ["Whitelist"],
        summary: "Delete IP whitelist",
        ...deleteWhitelistSchema,
        },
    });
}