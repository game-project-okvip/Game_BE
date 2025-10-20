import { FastifyInstance } from "fastify";
import { getTransctionFilterList } from "../controller/transaction.controller";
import { PlayerTransctionSchema } from "../schemas/transction.schema";
import { whitelistMiddleware } from "../middleware/whitelist.middleware";
import { checkAuthMiddleware } from "../middleware/checkAuth.middleware";
import { rolePermissionMiddleware } from "../middleware/role.middleware";

export default async function playerTransctionRoutes(server: FastifyInstance) {
    const commonMiddleware = [
        whitelistMiddleware,
        checkAuthMiddleware,
        rolePermissionMiddleware
    ];

    server.route({
        method: "GET",
        url: "/",
        preHandler: commonMiddleware,
        handler: getTransctionFilterList,
        schema: {
        tags: ["PlayerTransction"],
        summary: "Get Player Transction list",
        ...PlayerTransctionSchema
        },
    });
}