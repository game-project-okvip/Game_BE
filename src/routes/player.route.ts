import { FastifyInstance } from "fastify";
import { getallClient, getClientDetail } from "../controller/user.controller";
import { PlayerSchema } from "../schemas/player.schema";
import { whitelistMiddleware } from "../middleware/whitelist.middleware";
import { checkAuthMiddleware } from "../middleware/checkAuth.middleware";
import { rolePermissionMiddleware } from "../middleware/role.middleware";

export default async function playerRoutes(server: FastifyInstance) {
    const commonMiddleware = [
        whitelistMiddleware,
        checkAuthMiddleware,
        rolePermissionMiddleware
    ];

    server.route({
        method: "GET",
        url: "/",
        preHandler: commonMiddleware,
        handler: getallClient,
        schema: {
        tags: ["Player"],
        summary: "Get Player list",
        },
    });

    server.route({
        method: "GET",
        url: "/detail",
        preHandler: commonMiddleware,
        handler: getClientDetail,
        schema: {
            tags: ["Player"],
            summary: "Get Player     Detail",
            ...PlayerSchema
        },
    })
}