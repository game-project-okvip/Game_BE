"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
exports.loginSchema = {
    body: {
        type: "object",
        required: ["username", "password"],
        additionalProperties: false,
        properties: {
            username: { type: "string" },
            password: { type: "string" },
        },
    },
};
//# sourceMappingURL=auth.schema.js.map