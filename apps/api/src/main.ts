import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CollaborationModule } from './collaboration/collaboration.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000'];
  
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true, 
  });

const collabModule = app.get(CollaborationModule) as any;

  // 2. Get the raw Node HTTP server running under NestJS
  const httpServer = app.getHttpServer();

  // 3. Require the native 'ws' library (already installed by Hocuspocus)
  const { WebSocketServer } = require('ws');
  const wss = new WebSocketServer({ noServer: true });

  // 4. Intercept all WebSocket upgrade requests and hand them to Hocuspocus
  httpServer.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
      collabModule.hocuspocusServer.handleConnection(ws, request);
    });
  });

  // 5. Start the unified server!
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Unified API & WebSocket Server running on port ${port}`);
}
bootstrap();
