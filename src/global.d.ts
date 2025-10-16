import "fastify";


export interface JWTUserPayload {
  id: string;
  username: string;
  name: string;
  role: unknown;
}

// Extend Fastify types
declare module "fastify" {
  interface FastifyRequest {
    userData?: JWTUserPayload;
  }
}
