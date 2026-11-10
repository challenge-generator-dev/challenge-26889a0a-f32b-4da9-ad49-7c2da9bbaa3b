import { Module, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { OrderEventController } from './infrastructure/controllers/order-event.controller';
import { OrderEventService } from './application/services/order-event.service';
import { KafkaConsumerService } from './infrastructure/messaging/kafka-consumer.service';
import { KafkaConfigService } from './infrastructure/config/kafka.config';
import { GlobalExceptionFilter } from './infrastructure/filters/global-exception.filter';
import { LoggingInterceptor } from './infrastructure/interceptors/logging.interceptor';
import { MetricsInterceptor } from './infrastructure/interceptors/metrics.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
  ],
  controllers: [OrderEventController],
  providers: [
    KafkaConfigService,
    KafkaConsumerService,
    OrderEventService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
  exports: [OrderEventService, KafkaConsumerService, KafkaConfigService],
})
export class AppModule implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AppModule.name);
  private isShuttingDown = false;

  async onModuleInit() {
    this.logger.log('Inicializando módulo de aplicación');
    this.logger.debug('Configuración de Kafka cargada');
    this.logger.debug('Consumidor de Kafka registrado');
    this.logger.debug('Controlador de eventos de órdenes registrado');
  }

  async onModuleDestroy() {
    if (this.isShuttingDown) return;

    this.isShuttingDown = true;
    this.logger.log('Cerrando conexiones y limpiando recursos...');

    try {
      const kafkaConsumer = await import('./infrastructure/messaging/kafka-consumer.service');
      this.logger.log('Conexión con Kafka cerrada');
    } catch (error) {
      this.logger.error('Error al cerrar conexión con Kafka', error);
    }

    this.logger.log('Módulo de aplicación cerrado correctamente');
  }
}