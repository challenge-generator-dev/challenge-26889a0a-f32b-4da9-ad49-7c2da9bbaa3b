import { Injectable, OnModuleInit, OnModuleDestroy, Logger, Inject, forwardRef } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload, KafkaMessage } from 'kafkajs';
import { Observable, Subject, catchError, EMPTY, filter, map, takeUntil } from 'rxjs';
import { KafkaConfigService } from '../config/kafka.config';
import { OrderEvent, OrderStatus } from '../../domain/models/order-event.model';
import { OrderEventPort } from '../../domain/ports/order-event.port';

@Injectable()
export class KafkaConsumerService implements OrderEventPort, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaConsumerService.name);
  private kafka: Kafka;
  private consumer: Consumer;
  private readonly eventSubject = new Subject<OrderEvent>();
  private isConnected = false;
  private readonly destroy$ = new Subject<void>();
  private readonly topicName = process.env.KAFKA_TOPIC || 'order-events';

  constructor(private readonly kafkaConfig: KafkaConfigService) {
    this.kafka = new Kafka(this.kafkaConfig.getKafkaConfig());
    this.consumer = this.kafka.consumer(this.kafkaConfig.getConsumerConfig());
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('Inicializando consumidor de Kafka...');
    
    if (!this.kafkaConfig.validateConfig()) {
      this.logger.error('Configuración de Kafka inválida. Verifique las variables de entorno.');
      return;
    }

    try {
      await this.connect();
      await this.subscribeToTopic();
      await this.startConsuming();
      this.logger.log(`Consumidor de Kafka conectado al topic: ${this.topicName}`);
    } catch (error) {
      this.logger.error('Error al inicializar el consumidor de Kafka', error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Cerrando consumidor de Kafka...');
    await this.closeConnection();
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      this.logger.warn('El consumidor ya está conectado');
      return;
    }

    try {
      await this.consumer.connect();
      this.isConnected = true;
      this.logger.log('Conexión establecida con Kafka');
    } catch (error) {
      this.logger.error('Error al conectar con Kafka', error);
      throw error;
    }
  }

  private async subscribeToTopic(): Promise<void> {
    try {
      await this.consumer.subscribe({ 
        topic: this.topicName, 
        fromBeginning: false 
      });
      this.logger.log(`Suscrito al topic: ${this.topicName}`);
    } catch (error) {
      this.logger.error(`Error al suscribirse al topic ${this.topicName}`, error);
      throw error;
    }
  }

  private async startConsuming(): Promise<void> {
    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        await this.handleMessage(payload);
      },
    });
  }

  private async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { message, topic, partition } = payload;
    
    this.logger.debug(`Mensaje recibido - Topic: ${topic}, Partition: ${partition}, Offset: ${message.offset}`);

    try {
      const orderEvent = this.parseMessage(message);
      if (orderEvent) {
        this.eventSubject.next(orderEvent);
        this.logger.debug(`Evento de orden procesado: ${orderEvent.orderId} - ${orderEvent.status}`);
      }
    } catch (error) {
      this.logger.error('Error al procesar mensaje de Kafka', error);
    }
  }

  private parseMessage(message: KafkaMessage): OrderEvent | null {
    try {
      const value = message.value?.toString();
      if (!value) {
        this.logger.warn('Mensaje vacío recibido');
        return null;
      }

      const data = JSON.parse(value);
      
      if (!data.orderId || !data.status) {
        this.logger.warn('Mensaje con formato inválido, faltan campos requeridos');
        return null;
      }

      const status = this.validateStatus(data.status);
      if (!status) {
        this.logger.warn(`Estado de orden inválido: ${data.status}`);
        return null;
      }

      return new OrderEvent(
        data.orderId,
        status,
        data.updatedAt ? new Date(data.updatedAt) : new Date(),
        data.metadata
      );
    } catch (error) {
      this.logger.error('Error al parsear mensaje', error);
      return null;
    }
  }

  private validateStatus(status: string): OrderStatus | null {
    const validStatuses = Object.values(OrderStatus);
    return validStatuses.includes(status as OrderStatus) ? status as OrderStatus : null;
  }

  streamOrderEvents(): Observable<OrderEvent> {
    return this.eventSubject.asObservable().pipe(
      filter((event): event is OrderEvent => event !== null && event !== undefined),
      takeUntil(this.destroy$),
      catchError((error) => {
        this.logger.error('Error en el stream de eventos', error);
        return EMPTY;
      })
    );
  }

  async closeConnection(): Promise<void> {
    try {
      this.destroy$.next();
      this.destroy$.complete();
      
      if (this.isConnected) {
        await this.consumer.disconnect();
        this.isConnected = false;
        this.logger.log('Conexión con Kafka cerrada correctamente');
      }
    } catch (error) {
      this.logger.error('Error al cerrar la conexión con Kafka', error);
      throw error;
    }
  }

  isConsumerConnected(): boolean {
    return this.isConnected;
  }

  async reconnect(): Promise<void> {
    this.logger.log('Intentando reconectar con Kafka...');
    await this.closeConnection();
    this.isConnected = false;
    await this.connect();
    await this.subscribeToTopic();
    await this.startConsuming();
    this.logger.log('Reconexión con Kafka exitosa');
  }
}