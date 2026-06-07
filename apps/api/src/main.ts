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

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`API Server running on port ${port}`);
}
bootstrap();
