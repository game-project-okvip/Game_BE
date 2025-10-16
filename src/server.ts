import { buildServer } from './app';

const PORT = Number(process.env.PORT || 3003);

buildServer().then(app => {
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