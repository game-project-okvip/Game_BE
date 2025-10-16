import { FastifyInstance } from "fastify";
import { getAdminAccounts, createAdminAccounts, getAdminDetail, updateUser, deleteUser } from "../controller/user.controller";
import { createUserSchema, UserSchema, updateUserSchema } from "../schemas/user.schema";
import { whitelistMiddleware } from "../middleware/whitelist.middleware";
import { checkAuthMiddleware } from "../middleware/checkAuth.middleware";
import { rolePermissionMiddleware } from "../middleware/role.middleware";

export default async function userRoutes(server: FastifyInstance) {
    const commonMiddleware = [
        whitelistMiddleware,
        checkAuthMiddleware,
        rolePermissionMiddleware
    ];

    server.route({
        method: "GET",
        url: "/",
        preHandler: commonMiddleware,
        handler: getAdminAccounts,
        schema: {
        tags: ["User"],
        summary: "Get User list",
        },
    });

    server.route({
        method: "POST",
        url: "/",
        preHandler: commonMiddleware,
        handler: createAdminAccounts,
        schema: {
        tags: ["User"],
        summary: "Create User Account",
        ...createUserSchema
        },
    });

    server.route({
        method: "GET",
        url: "/detail",
        preHandler: commonMiddleware,
        handler: getAdminDetail,
        schema: {
            tags: ["User"],
            summary: "Get User Detail",
            ...UserSchema
        },
    })

    server.route({
        method: "PATCH",
        url: "/",
        preHandler: commonMiddleware,
        handler: updateUser,
        schema: {
        tags: ["User"],
        summary: "Update User Account",
        ...updateUserSchema
        },
    });

    server.route({
        method: "DELETE",
        url: "/",
        preHandler: commonMiddleware,
        handler: deleteUser,
        schema: {
            tags: ["User"],
            summary: "Delete User",
            ...UserSchema
        },
    })
}