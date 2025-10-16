import { FastifyInstance } from "fastify";
import { login } from "../controller/auth.controller";
import { loginSchema } from "../schemas/auth.schema";
import { whitelistMiddleware } from "../middleware/whitelist.middleware";

export default async function authRoutes(server: FastifyInstance) {
    server.route({
        method: 'POST',
        url: '/login',
        preHandler: whitelistMiddleware,
        handler: login,
        schema: {
        tags: ['Auth'],
        summary: 'Login with username & password',
        ...loginSchema
        }
    });
}