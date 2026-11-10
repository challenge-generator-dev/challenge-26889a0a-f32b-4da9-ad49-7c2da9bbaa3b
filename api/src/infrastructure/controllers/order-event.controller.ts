import { Controller, Get, Res, HttpStatus, Logger, Header } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { OrderEvent } from '../../domain/models/order-event.model';
import { KafkaConsumerService } from '../messaging/kafka-consumer.service';

@Controller('orders')
export class OrderEventController {
  private readonly logger = new Logger(OrderEventController.name);

  constructor(private readonly kafkaConsumer: KafkaConsumerService) {}

  @Get('events')
  @Header('Content-Type', 'text/event-stream')
  @Header('Cache-Control', 'no-cache')
  @Header('Connection', 'keep-alive')
  @Header('X-Accel-Buffering', 'no')
  streamOrderEvents(@Res() res: Response): void {
    this.logger.log('Cliente conectado al stream de eventos de órdenes');

    if (!this.kafkaConsumer.isConsumerConnected()) {
      this.logger.warn('Consumidor de Kafka no está conectado');
      res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Servicio de eventos no disponible',
        error: 'Kafka consumer not connected'
      });
      return;
    }

    const eventStream = this.kafkaConsumer.streamOrderEvents();
    let clientConnected = true;

    const sendEvent = (event: OrderEvent): void => {
      if (!clientConnected) {
        return;
      }

      const sseData = this.formatSSEEvent(event);
      res.write(sseData);
    };

    const subscription = eventStream.subscribe({
      next: (event) => sendEvent(event),
      error: (error) => {
        this.logger.error('Error en el stream de eventos', error);
        if (clientConnected) {
          res.write(`event: error\ndata: ${JSON.stringify({ message: 'Error en la conexión' })}\n\n`);
        }
      },
      complete: () => {
        this.logger.log('Stream de eventos completado');
        if (clientConnected) {
          res.write(`event: close\ndata: ${JSON.stringify({ message: 'Stream cerrado' })}\n\n`);
          res.end();
        }
      }
    });

    res.on('close', () => {
      clientConnected = false;
      subscription.unsubscribe();
      this.logger.log('Cliente desconectado del stream de eventos de órdenes');
    });

    res.write(`event: connected\ndata: ${JSON.stringify({ message: 'Conectado al stream de eventos de órdenes' })}\n\n`);
  }

  private formatSSEEvent(event: OrderEvent): string {
    const eventData = {
      orderId: event.orderId,
      status: event.status,
      updatedAt: event.updatedAt.toISOString(),
      metadata: event.metadata
    };

    return `event: order-update\ndata: ${JSON.stringify(eventData)}\n\n`;
  }

  @Get('events/health')
  checkHealth(): { status: string; kafkaConnected: boolean } {
    return {
      status: 'ok',
      kafkaConnected: this.kafkaConsumer.isConsumerConnected()
    };
  }
}