"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWhitelistSchema = exports.updateWhitelistSchema = exports.createWhitelistSchema = void 0;
exports.createWhitelistSchema = {
    body: {
        type: "object",
        required: ["ip"],
        additionalProperties: false,
        properties: {
            ip: {
                anyOf: [
                    { type: "string", format: "ipv4" },
                    { type: "string", format: "ipv6" }
                ]
            },
            description: { type: "string" },
            createBy: { type: "string" },
        },
    },
};
exports.updateWhitelistSchema = {
    querystring: {
        type: "object",
        required: ["id"],
        additionalProperties: false,
        properties: {
            id: { type: "string" },
        },
    },
    body: {
        type: "object",
        additionalProperties: false,
        properties: {
            ip: {
                anyOf: [
                    { type: "string", format: "ipv4" },
                    { type: "string", format: "ipv6" }
                ]
            },
            description: { type: "string" },
            updateBy: { type: "string" },
        },
    },
};
exports.deleteWhitelistSchema = {
    querystring: {
        type: "object",
        properties: {
            id: { type: "string" },
        },
    },
};
//# sourceMappingURL=whitelist.schema.js.map