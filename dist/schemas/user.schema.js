"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.UserSchema = exports.createUserSchema = void 0;
exports.createUserSchema = {
    body: {
        type: "object",
        required: ["username", "password", "role"],
        properties: {
            username: { type: "string" },
            password: { type: "string" },
            role: { type: "string" },
        }
    }
};
exports.UserSchema = {
    querystring: {
        type: "object",
        properties: {
            id: { type: "string" }
        }
    }
};
exports.updateUserSchema = {
    body: {
        type: "object",
        required: ["id"],
        properties: {
            id: { type: "string" },
            name: { type: "string" },
            role: { type: "string" },
        }
    }
};
//# sourceMappingURL=user.schema.js.map