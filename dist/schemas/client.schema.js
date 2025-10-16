"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientSchema = exports.playHistorySchema = exports.transactionSchema = void 0;
exports.transactionSchema = {
    body: {
        type: "object",
        required: ["account", "amount", "type"],
        properties: {
            account: { type: "string" },
            amount: { type: "string" },
            type: { type: "string", enum: ["Deposit", "Withdraw"] },
        }
    }
};
exports.playHistorySchema = {
    body: {
        type: "object",
        required: ["account", "game", "status", "amount"],
        properties: {
            account: { type: "string" },
            game: { type: "string" },
            status: { type: "string", enum: ["Win", "Lose", "Draw"] },
            amount: { type: "string" },
        }
    }
};
exports.clientSchema = {
    querystring: {
        type: "object",
        required: ["account"],
        properties: {
            account: { type: "string" },
        }
    }
};
//# sourceMappingURL=client.schema.js.map