"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuthMiddleware = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const admin_model_1 = __importDefault(require("../models/admin.model"));
const modal_1 = require("../const/modal");
const checkAuthMiddleware = async (request, reply) => {
    try {
        const authHeader = request.headers["authorization"];
        if (!authHeader) {
            return reply.code(401).send({
                message: "Missing authentication token, please try again",
            });
        }
        if (!authHeader.startsWith("Bearer ")) {
            return reply.code(401).send({
                message: "Invalid authorization format. Expected 'Bearer <token>'",
            });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return reply.code(401).send({
                message: "Token not found in authorization header",
            });
        }
        // 🔑 Verify JWT
        const decoded = jsonwebtoken_1.default.verify(token, modal_1.secret_key);
        if (!decoded?.username) {
            return reply.code(401).send({
                message: "Invalid JWT payload",
            });
        }
        // 🔎 Validate user in DB
        const account = await admin_model_1.default
            .findOne({ username: decoded?.username })
            .select("-password -__v -qr_code_image")
            .populate("role");
        if (!account) {
            return reply.code(401).send({
                message: "Invalid authentication code",
            });
        }
        // ✅ Attach user data to request
        request.userData = {
            id: account._id.toString(),
            username: account.username,
            name: account.name,
            role: account.role,
        };
    }
    catch (error) {
        request.log.error(`Authentication error: ${error}`);
        let status = 500;
        let message = "System error";
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            status = 401;
            message = "Token has expired";
        }
        else if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            status = 401;
            message = "Invalid token";
        }
        return reply.code(status).send({ message });
    }
};
exports.checkAuthMiddleware = checkAuthMiddleware;
//# sourceMappingURL=checkAuth.middleware.js.map