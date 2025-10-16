"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildServer = void 0;
// app.ts
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const swagger_1 = __importDefault(require("./plugins/swagger"));
const mongoose_1 = __importDefault(require("./plugins/mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const whitelist_route_1 = __importDefault(require("./routes/whitelist.route"));
const role_route_1 = __importDefault(require("./routes/role.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
dotenv_1.default.config();
const ALLOWLIST = [
    'http://localhost:3003',
    'http://127.0.0.1:3003',
    'http://localhost:5173',
    /\.vercel\.app$/,
    /\.netlify\.app$/,
];
const isAllowedOrigin = (origin) => {
    if (!origin)
        return true; // ไม่มี Origin = server-to-server/Node axios -> ผ่าน
    return ALLOWLIST.some(rule => typeof rule === 'string' ? rule === origin : rule.test(origin));
};
const buildServer = async () => {
    const app = (0, fastify_1.default)({ logger: true, trustProxy: true }); // ⭐ UPDATED
    await app.register(cors_1.default, {
        origin: (origin, cb) => {
            isAllowedOrigin(origin) ? cb(null, true) : cb(new Error('CORS: origin not allowed'), false);
        },
        credentials: true, // ถ้าต้องการส่งคุกกี้/Session จากเว็บ
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT',],
        allowedHeaders: ['Content-Type', 'Authorization', 'fingerprint'],
    });
    // ⭐ Global rate limit (ครอบทั้งแอป)
    await app.register(rate_limit_1.default, {
        global: true,
        max: Number(process.env.RL_MAX) || 120, // req ต่อ timeWindow ต่อ IP
        timeWindow: process.env.RL_WINDOW || '1 minute', // 1m/10s/1h ฯลฯ
        ban: 2, // เกินซ้ำ ๆ โดนแบนช่วงสั้น
        allowList: (req) => {
            // อนุญาต healthcheck / ภายใน
            if (req.url?.startsWith('/socket.io/'))
                return true;
            const ip = req.headers['cf-connecting-ip'] ||
                req.headers['x-real-ip'] ||
                (Array.isArray(req.headers['x-forwarded-for'])
                    ? req.headers['x-forwarded-for'][0]
                    : req.headers['x-forwarded-for']?.split(',')[0]?.trim()) ||
                req.ip;
            return ip === '127.0.0.1' || req.url?.startsWith('/public/health');
        },
        // ให้จับ IP จาก header ถ้าอยู่หลัง proxy (Cloudflare/NGINX)
        keyGenerator: (req) => {
            const h = req.headers['cf-connecting-ip'] ||
                req.headers['x-real-ip'] ||
                (Array.isArray(req.headers['x-forwarded-for'])
                    ? req.headers['x-forwarded-for'][0]
                    : req.headers['x-forwarded-for']?.split(',')[0]?.trim());
            return h || req.ip;
        },
        errorResponseBuilder: (_req, ctx) => ({
            statusCode: 429,
            error: 'Too Many Requests',
            message: `Rate limit exceeded: ${ctx.max} req/${ctx.after}. Try again in ${Math.ceil(ctx.ttl / 1000)}s.`
        })
    });
    // ✅ Register plugins first
    app.register(swagger_1.default);
    app.register(mongoose_1.default);
    // ✅ Register routes
    await app.register(auth_route_1.default, { prefix: '/auth' });
    await app.register(whitelist_route_1.default, { prefix: '/whitelist' });
    await app.register(role_route_1.default, { prefix: '/role' });
    await app.register(user_route_1.default, { prefix: 'user' });
    return app;
};
exports.buildServer = buildServer;
//# sourceMappingURL=app.js.map