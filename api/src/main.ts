import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  const requiredEnvVars = ['KAFKA_BROKERS', 'KAFKA_CLIENT_ID', 'KAFKA_GROUP_ID'];
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingEnvVars.length > 0) {
    logger.error(`Faltan variables de entorno requeridas: ${missingEnvVars.join(', ')}`);
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const host = process.env.HOST || '0.0.0.0';

  await app.listen(port, host);
  
  logger.log(`Aplicación escuchando en http://${host}:${port}`);
  logger.log(`Endpoint de eventos SSE: http://${host}:${port}/orders/events`);
  logger.log(`Health check: http://${host}:${port}/health`);

  const shutdown = async (signal: string) => {
    logger.log(`Recibida señal ${signal}, iniciando cierre graceful...`);
    await app.close();
    logger.log('Aplicación cerrada correctamente');
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('uncaughtException', (error) => {
    logger.error(`Excepción no capturada: ${error.message}`, error.stack);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Rechazo no manejado en: ${promise}, razón: ${reason}`);
  });
}

bootstrap();