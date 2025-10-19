// src/plugins/swagger.ts
import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { FastifyPluginAsync } from 'fastify';
const swaggerPlugin: FastifyPluginAsync = fp(async (fastify) => {
  await fastify.register(swagger, {
    prefix: '/docs',
    swagger: {
      info: {
        title: 'OKVIP Game API',
        description: 'API documentation for OKVIP Game',
        version: '1.0.0',
      },
      // host: `localhost:3003`,
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

  await fastify.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      url: '/docs/json',
      docExpansion: 'list',
      deepLinking: false,
      persistAuthorization: true,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header.replace(/;?\s*upgrade-insecure-requests/g, ''),
  });
});

export default swaggerPlugin;
