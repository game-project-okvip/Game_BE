"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.whitelistMiddleware = void 0;
const whitelist_model_1 = __importDefault(require("../models/whitelist.model"));
const winston_1 = __importDefault(require("../winston"));
const whitelistMiddleware = async (request, reply) => {
    try {
        // Normalize IP (remove IPv6 prefix if present)
        const ipClient = request.headers["cf-connecting-ip"] ? request.headers["x-forwarded-for"]?.split(",")[0].trim() : request.ip;
        const found = await whitelist_model_1.default.findOne({ ip: ipClient });
        if (!found) {
            request.log.warn(`Whitelist blocked IP: ${ipClient}`);
            const res = {
                message: `Unauthorized: Access denied for IP ${ipClient}`,
            };
            return reply.code(403).send(res);
        }
        // ✅ Passed whitelist → do nothing, let request continue
    }
    catch (error) {
        winston_1.default.error("Whitelist Error:", error);
        const res = {
            message: "Internal server error during whitelist check",
        };
        return reply.code(500).send(res);
    }
};
exports.whitelistMiddleware = whitelistMiddleware;
//# sourceMappingURL=whitelist.middleware.js.map