"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = clientRoutes;
const transaction_controller_1 = require("../controller/transaction.controller");
const playerhistory_controller_1 = require("../controller/playerhistory.controller");
const client_schema_1 = require("../schemas/client.schema");
const user_controller_1 = require("../controller/user.controller");
async function clientRoutes(server) {
    server.route({
        method: "POST",
        url: "/maketransaction",
        handler: transaction_controller_1.CreateTransaction,
        schema: {
            tags: ["Client"],
            summary: "Create Deposit/Withdraw",
            ...client_schema_1.transactionSchema,
        },
    });
    server.route({
        method: "GET",
        url: "/gettransaction",
        handler: transaction_controller_1.GetPlayerTransactionByAccount,
        schema: {
            tags: ["Client"],
            summary: "Get Deposit/Withdraw History",
            ...client_schema_1.clientSchema,
        },
    });
    server.route({
        method: "POST",
        url: "/playhistory",
        handler: playerhistory_controller_1.CreatePlayerHistory,
        schema: {
            tags: ["Client"],
            summary: "Create Game Play History",
            ...client_schema_1.playHistorySchema,
        },
    });
    server.route({
        method: "GET",
        url: "/getplayhistory",
        handler: playerhistory_controller_1.GetPlayerHistoryByAccount,
        schema: {
            tags: ["Client"],
            summary: "Get Game Play History",
            ...client_schema_1.clientSchema,
        },
    });
    server.route({
        method: "GET",
        url: "/info",
        handler: user_controller_1.getClientInfo,
        schema: {
            tags: ["Client"],
            summary: "Get client Info by account",
            ...client_schema_1.clientSchema,
        },
    });
}
//# sourceMappingURL=client.route.js.map