import { FastifyInstance } from "fastify";
import { getHistoryFilterList } from "../controller/playerhistory.controller";
import { PlayHistorySchema } from "../schemas/playhistory.schema";
import { whitelistMiddleware } from "../middleware/whitelist.middleware";
import { checkAuthMiddleware } from "../middleware/checkAuth.middleware";
import { rolePermissionMiddleware } from "../middleware/role.middleware";

export default async function playHistoryRoutes(server: FastifyInstance) {
    const commonMiddleware = [
        whitelistMiddleware,
        checkAuthMiddleware,
        rolePermissionMiddleware
    ];

    server.route({
        method: "GET",
        url: "/",
        preHandler: commonMiddleware,
        handler: getHistoryFilterList,
        schema: {
        tags: ["PlayHistory"],
        summary: "Get Play History list",
        ...PlayHistorySchema
        },
    });
}