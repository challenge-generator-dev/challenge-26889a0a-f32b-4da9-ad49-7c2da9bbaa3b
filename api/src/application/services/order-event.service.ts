import { Injectable, OnModuleInit, OnModuleDestroy, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { OrderEventPort } from '../../domain/ports/order-event.port';
import { OrderEvent, OrderStatus } from '../../domain/models/order-event.model';

@Injectable()
export class OrderEventService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrderEventService.name);
  private eventSubscription: Subscription | null = null;
  private readonly eventSubject = new Subject<OrderEvent>();
  private readonly connectedClients = new Set<{ id: string; eventId: number }>();
  private isProcessing = false;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private reconnectAttempts = 0;

  constructor(private readonly orderEventPort: OrderEventPort) {}

  async onModuleInit(): Promise<void> {
    this.logger.log('OrderEventService inicializado');
    await this.startEventConsumption();
  }

  async onModuleDestroy(): Promise<void> {
    await this.stopEventConsumption();
  }

  private async startEventConsumption(): Promise<void> {
    try {
      this.logger.log('Iniciando consumo de eventos de orders desde Kafka');
      
      const eventStream$ = this.orderEventPort.streamOrderEvents();
      
      this.eventSubscription = eventStream$.subscribe({
        next: (event: OrderEvent) => this.handleNewEvent(event),
        error: (error: Error) => this.handleStreamError(error),
        complete: () => this.handleStreamComplete()
      });
      
      this.reconnectAttempts = 0;
      this.isProcessing = true;
      this.logger.log('Suscrito exitosamente al stream de eventos de Kafka');
    } catch (error) {
      this.logger.error(`Error al iniciar consumo de eventos: ${error instanceof Error ? error.message : 'Unknown error'}`);
      await this.attemptReconnection();
    }
  }

  private handleNewEvent(event: OrderEvent): void {
    try {
      this.logger.debug(`Evento recibido: orderId=${event.orderId}, status=${event.status}`);
      
      const processedEvent = this.processEventData(event);
      this.eventSubject.next(processedEvent);
      this.broadcastToConnectedClients(processedEvent);
    } catch (error) {
      this.logger.error(`Error procesando evento: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private processEventData(event: OrderEvent): OrderEvent {
    if (!event.orderId || event.orderId.trim() === '') {
      throw new HttpException('orderId inválido', HttpStatus.BAD_REQUEST);
    }
    
    if (!this.isValidStatus(event.status)) {
      this.logger.warn(`Estado desconocido: ${event.status}, usando CREATED por defecto`);
      return new OrderEvent(event.orderId, OrderStatus.CREATED, event.updatedAt, event.metadata);
    }
    
    const enrichedEvent = new OrderEvent(
      event.orderId,
      event.status,
      event.updatedAt || new Date(),
      this.enrichMetadata(event)
    );
    
    return enrichedEvent;
  }

  private isValidStatus(status: OrderStatus): boolean {
    return Object.values(OrderStatus).includes(status);
  }

  private enrichMetadata(event: OrderEvent): string {
    const baseMetadata = event.metadata || '{}';
    try {
      const parsed = JSON.parse(baseMetadata);
      parsed.processedAt = new Date().toISOString();
      parsed.serviceVersion = '1.0.0';
      return JSON.stringify(parsed);
    } catch {
      return JSON.stringify({ original: baseMetadata, processedAt: new Date().toISOString() });
    }
  }

  private handleStreamError(error: Error): void {
    this.logger.error(`Error en stream de Kafka: ${error.message}`);
    this.isProcessing = false;
    
    if (error.message.includes('connection') || error.message.includes('network')) {
      this.attemptReconnection();
    }
  }

  private handleStreamComplete(): void {
    this.logger.warn('Stream de eventos completado inesperadamente');
    this.isProcessing = false;
    this.attemptReconnection();
  }

  private async attemptReconnection(): Promise<void> {
    if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
      this.logger.error('Máximo de intentos de reconexión alcanzado');
      throw new HttpException(
        'No se pudo establecer conexión con el servicio de eventos',
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
    
    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    this.logger.log(`Intento de reconexión ${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS} en ${delay}ms`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    await this.startEventConsumption();
  }

  async stopEventConsumption(): Promise<void> {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
      this.eventSubscription = null;
    }
    
    try {
      await this.orderEventPort.closeConnection();
      this.logger.log('Conexión con Kafka cerrada correctamente');
    } catch (error) {
      this.logger.error(`Error al cerrar conexión: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    this.isProcessing = false;
  }

  getEventStream(): Observable<OrderEvent> {
    return this.eventSubject.asObservable();
  }

  getEventsByStatus(status: OrderStatus): Observable<OrderEvent> {
    return this.eventSubject.asObservable().pipe(
      filter(event => event.status === status)
    );
  }

  getEventByOrderId(orderId: string): Promise<OrderEvent | null> {
    return new Promise((resolve) => {
      const subscription = this.eventSubject.asObservable().pipe(
        filter(event => event.orderId === orderId),
        map(event => event)
      ).subscribe({
        next: (event) => {
          subscription.unsubscribe();
          resolve(event);
        },
        error: () => {
          subscription.unsubscribe();
          resolve(null);
        }
      });
      
      setTimeout(() => {
        subscription.unsubscribe();
        resolve(null);
      }, 5000);
    });
  }

  registerClient(clientId: string): { eventId: number } {
    const clientData = { id: clientId, eventId: Date.now() };
    this.connectedClients.add(clientData);
    this.logger.log(`Cliente registrado: ${clientId}. Total clientes: ${this.connectedClients.size}`);
    return { eventId: clientData.eventId };
  }

  removeClient(clientId: string): void {
    for (const client of this.connectedClients) {
      if (client.id === clientId) {
        this.connectedClients.delete(client);
        this.logger.log(`Cliente removido: ${clientId}. Total clientes: ${this.connectedClients.size}`);
        break;
      }
    }
  }

  private broadcastToConnectedClients(event: OrderEvent): void {
    if (this.connectedClients.size === 0) {
      this.logger.debug('No hay clientes conectados para broadcast');
      return;
    }
    
    this.logger.debug(`Broadcasting evento a ${this.connectedClients.size} clientes`);
  }

  getServiceStatus(): { isProcessing: boolean; connectedClients: number; reconnectAttempts: number } {
    return {
      isProcessing: this.isProcessing,
      connectedClients: this.connectedClients.size,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}