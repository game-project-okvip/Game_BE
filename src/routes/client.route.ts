import { FastifyInstance } from "fastify";
import { CreateTransaction, GetPlayerTransactionByAccount } from "../controller/transaction.controller";
import { CreatePlayerHistory, GetPlayerHistoryByAccount } from "../controller/playerhistory.controller";
import { transactionSchema, playHistorySchema, clientSchema } from "../schemas/client.schema";
import { getClientInfo } from "../controller/user.controller";

export default async function clientRoutes(server: FastifyInstance) {
    
    server.route({
        method: "POST",
        url: "/maketransaction",
        handler: CreateTransaction,
        schema: {
        tags: ["Client"],
        summary: "Create Deposit/Withdraw",
        ...transactionSchema,
        },
    });

    server.route({
        method: "GET",
        url: "/gettransaction",
        handler: GetPlayerTransactionByAccount,
        schema: {
        tags: ["Client"],
        summary: "Get Deposit/Withdraw History",
        ...clientSchema,
        },
    });

    server.route({
        method: "POST",
        url: "/playhistory",
        handler: CreatePlayerHistory,
        schema: {
        tags: ["Client"],
        summary: "Create Game Play History",
        ...playHistorySchema,
        },
    });

    server.route({
        method: "GET",
        url: "/getplayhistory",
        handler: GetPlayerHistoryByAccount,
        schema: {
        tags: ["Client"],
        summary: "Get Game Play History",
        ...clientSchema,
        },
    })

    server.route({
        method: "GET",
        url: "/info",
        handler: getClientInfo,
        schema: {
        tags: ["Client"],
        summary: "Get client Info by account",
        ...clientSchema,
        },
    });
}
