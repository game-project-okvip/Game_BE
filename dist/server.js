"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const PORT = Number(process.env.PORT || 3003);
(0, app_1.buildServer)().then(app => {
    app.listen({ port: PORT, host: '0.0.0.0' }, err => {
        if (err) {
            app.log.error(err);
            process.exit(1);
        }
        app.log.info(`🚀 Server running at http://localhost:${PORT}`);
        app.log.info(`📘 API Docs available at http://localhost:${PORT}/docs`);
    });
}).catch(err => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map