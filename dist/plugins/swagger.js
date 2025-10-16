"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/plugins/swagger.ts
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const swaggerPlugin = (0, fastify_plugin_1.default)(async (fastify) => {
    await fastify.register(swagger_1.default, {
        swagger: {
            info: {
                title: 'OKVIP Game API',
                description: 'API documentation for OKVIP Game',
                version: '1.0.0',
            },
            host: `localhost:3003`,
            schemes: ['http'],
            consumes: ['application/json'],
            produces: ['application/json'],
            securityDefinitions: {
                bearerAuth: {
                    type: 'apiKey',
                    name: 'Authorization',
                    in: 'header',
                    description: 'Enter JWT token in the format: Bearer <token>',
                },
            },
            security: [{ bearerAuth: [] }],
        },
    });
    await fastify.register(swagger_ui_1.default, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: false,
        },
        staticCSP: true,
        transformStaticCSP: (header) => header,
    });
});
exports.default = swaggerPlugin;
//# sourceMappingURL=swagger.js.map