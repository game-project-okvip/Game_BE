// app.ts
import fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import swagger from './plugins/swagger';
import mongoosePlugin, { defaultConfig } from './plugins/mongoose';
import dotenv from 'dotenv';
import fs from "fs";
import path from "path";
import whitelistRoutes from './routes/whitelist.route';
import roleRoutes from './routes/role.route';
import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import clientRoutes from './routes/client.route';
dotenv.config();


const ALLOWLIST = [
  'http://localhost:3003',
  'http://127.0.0.1:3003',
  'http://localhost:5173',
  'http://128.10.102.8:3003',
  /\.vercel\.app$/,
  /\.netlify\.app$/,
];

const isAllowedOrigin = (origin?: string) => {
  if (!origin) return true; // ไม่มี Origin = server-to-server/Node axios -> ผ่าน
  return ALLOWLIST.some(rule =>
    typeof rule === 'string' ? rule === origin : (rule as RegExp).test(origin)
  );
};

export const buildServer = async () => {
  const app = fastify({ logger: true, trustProxy: true }); // ⭐ UPDATED

  await app.register(cors, {
    origin: (origin, cb) => {
      isAllowedOrigin(origin) ? cb(null, true) : cb(new Error('CORS: origin not allowed'), false);
    },
    credentials: true, // ถ้าต้องการส่งคุกกี้/Session จากเว็บ
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT',],
    allowedHeaders: ['Content-Type', 'Authorization', 'fingerprint'],
  });

  // ⭐ Global rate limit (ครอบทั้งแอป)
  await app.register(rateLimit, {
    global: true,
    max: Number(process.env.RL_MAX) || 120,               // req ต่อ timeWindow ต่อ IP
    timeWindow: process.env.RL_WINDOW || '1 minute',      // 1m/10s/1h ฯลฯ
    ban: 2,                                               // เกินซ้ำ ๆ โดนแบนช่วงสั้น
    allowList: (req: any) => {
      // อนุญาต healthcheck / ภายใน
      if (req.url?.startsWith('/socket.io/')) return true;
      const ip =
        (req.headers['cf-connecting-ip'] as string) ||
        (req.headers['x-real-ip'] as string) ||
        (Array.isArray(req.headers['x-forwarded-for'])
          ? req.headers['x-forwarded-for'][0]
          : (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()) ||
        req.ip;
      return ip === '127.0.0.1' || req.url?.startsWith('/public/health');
    },
    // ให้จับ IP จาก header ถ้าอยู่หลัง proxy (Cloudflare/NGINX)
    keyGenerator: (req: any) => {
      const h =
        (req.headers['cf-connecting-ip'] as string) ||
        (req.headers['x-real-ip'] as string) ||
        (Array.isArray(req.headers['x-forwarded-for'])
          ? req.headers['x-forwarded-for'][0]
          : (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim());
      return h || req.ip;
    },
    errorResponseBuilder: (_req, ctx) => ({
      statusCode: 429,
      error: 'Too Many Requests',
      message: `Rate limit exceeded: ${ctx.max} req/${ctx.after}. Try again in ${Math.ceil(ctx.ttl / 1000)}s.`
    })
  });
  // ✅ Register plugins first
  app.register(swagger);
  app.register(mongoosePlugin);


  // ✅ Register routes
  await app.register(authRoutes, { prefix: '/auth' });
  await app.register(whitelistRoutes, { prefix: '/whitelist' });
  await app.register(roleRoutes, { prefix: '/role' });
  await app.register(userRoutes, { prefix: 'user' });

  //Client
  await app.register(clientRoutes, { prefix: '/client' });
  
  return app;
};
