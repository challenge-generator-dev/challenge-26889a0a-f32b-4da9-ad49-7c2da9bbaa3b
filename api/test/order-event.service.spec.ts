import { Test, TestingModule } from '@nestjs/testing';
import { OrderEventService } from '../src/application/services/order-event.service';
import { OrderEventPort } from '../src/domain/ports/order-event.port';
import { OrderStatus, OrderEvent } from '../src/domain/models/order-event.model';
import { Observable, Subject } from 'rxjs';

describe('OrderEventService', () => {
  let service: OrderEventService;
  let mockPort: jest.Mocked<OrderEventPort>;
  let eventSubject: Subject<OrderEvent>;

  const mockOrderEvent: OrderEvent = {
    orderId: 'order-123',
    status: OrderStatus.PROCESSING,
    updatedAt: new Date('2024-01-15T10:30:00Z'),
    metadata: '{"customerId": "cust-456"}',
  };

  beforeEach(async () => {
    eventSubject = new Subject<OrderEvent>();

    mockPort = {
      streamOrderEvents: jest.fn().mockReturnValue(eventSubject.asObservable()),
      closeConnection: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderEventService,
        {
          provide: 'OrderEventPort',
          useValue: mockPort,
        },
      ],
    }).compile();

    service = module.get<OrderEventService>(OrderEventService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onModuleInit', () => {
    it('debería iniciar el consumo de eventos al inicializar el módulo', async () => {
      const startConsumptionSpy = jest.spyOn(service as any, 'startEventConsumption');

      await service.onModuleInit();

      expect(startConsumptionSpy).toHaveBeenCalled();
    });

    it('debería registrar la conexión del consumidor', async () => {
      await service.onModuleInit();

      const status = service.getServiceStatus();
      expect(status.isInitialized).toBe(true);
    });
  });

  describe('onModuleDestroy', () => {
    it('debería cerrar la conexión al destruir el módulo', async () => {
      await service.onModuleInit();
      await service.onModuleDestroy();

      expect(mockPort.closeConnection).toHaveBeenCalled();
    });

    it('debería detener el consumo de eventos', async () => {
      const stopConsumptionSpy = jest.spyOn(service as any, 'stopEventConsumption');

      await service.onModuleDestroy();

      expect(stopConsumptionSpy).toHaveBeenCalled();
    });
  });

  describe('getEventStream', () => {
    it('debería retornar un observable de eventos de órdenes', () => {
      const stream = service.getEventStream();

      expect(stream).toBeInstanceOf(Observable);
    });

    it('debería emitir eventos cuando el puerto los publique', (done) => {
      const stream = service.getEventStream();

      stream.subscribe((event) => {
        expect(event.orderId).toBe(mockOrderEvent.orderId);
        done();
      });

      eventSubject.next(mockOrderEvent);
    });
  });

  describe('getEventsByStatus', () => {
    it('debería filtrar eventos por estado', (done) => {
      const stream = service.getEventsByStatus(OrderStatus.PROCESSING);

      stream.subscribe((event) => {
        expect(event.status).toBe(OrderStatus.PROCESSING);
        done();
      });

      eventSubject.next(mockOrderEvent);
    });

    it('no debería emitir eventos con estado diferente', () => {
      const emittedEvents: OrderEvent[] = [];
      const stream = service.getEventsByStatus(OrderStatus.DELIVERED);

      stream.subscribe((event) => {
        emittedEvents.push(event);
      });

      eventSubject.next(mockOrderEvent);

      expect(emittedEvents.length).toBe(0);
    });
  });

  describe('getEventByOrderId', () => {
    it('debería retornar el evento cuando existe', async () => {
      eventSubject.next(mockOrderEvent);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const result = await service.getEventByOrderId('order-123');

      expect(result).not.toBeNull();
      expect(result?.orderId).toBe('order-123');
    });

    it('debería retornar null cuando el evento no existe', async () => {
      const result = await service.getEventByOrderId('non-existent-order');

      expect(result).toBeNull();
    });
  });

  describe('registerClient', () => {
    it('debería registrar un cliente conectado', () => {
      const clientId = 'client-1';

      service.registerClient(clientId);

      const status = service.getServiceStatus();
      expect(status.connectedClients).toContain(clientId);
    });

    it('debería permitir múltiples clientes', () => {
      service.registerClient('client-1');
      service.registerClient('client-2');
      service.registerClient('client-3');

      const status = service.getServiceStatus();
      expect(status.connectedClients.length).toBe(3);
    });
  });

  describe('removeClient', () => {
    it('debería eliminar un cliente registrado', () => {
      const clientId = 'client-1';
      service.registerClient(clientId);

      service.removeClient(clientId);

      const status = service.getServiceStatus();
      expect(status.connectedClients).not.toContain(clientId);
    });
  });

  describe('handleStreamError', () => {
    it('debería manejar errores del stream y planificar reconexión', async () => {
      const error = new Error('Connection failed');
      const attemptReconnectionSpy = jest.spyOn(service as any, 'attemptReconnection');

      await (service as any).handleStreamError(error);

      expect(attemptReconnectionSpy).toHaveBeenCalled();
    });

    it('debería registrar el error en el logger', async () => {
      const error = new Error('Test error');
      const loggerSpy = jest.spyOn((service as any).logger, 'error');

      await (service as any).handleStreamError(error);

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error en el stream de eventos'),
        expect.any(String)
      );
    });
  });

  describe('attemptReconnection', () => {
    it('debería incrementar los intentos de reconexión', async () => {
      const initialAttempts = (service as any).reconnectAttempts;

      await (service as any).attemptReconnection();

      expect((service as any).reconnectAttempts).toBe(initialAttempts + 1);
    });

    it('debería alcanzar el límite máximo de intentos', async () => {
      const maxAttempts = (service as any).MAX_RECONNECT_ATTEMPTS;

      for (let i = 0; i < maxAttempts; i++) {
        await (service as any).attemptReconnection();
      }

      expect((service as any).reconnectAttempts).toBe(maxAttempts);
    });
  });

  describe('processEventData', () => {
    it('debería procesar y enriquecer los datos del evento', () => {
      const processedEvent = (service as any).processEventData(mockOrderEvent);

      expect(processedEvent).toBeDefined();
      expect(processedEvent.orderId).toBe(mockOrderEvent.orderId);
    });

    it('debería enriquecer con metadatos cuando no existen', () => {
      const eventWithoutMetadata = {
        orderId: 'order-456',
        status: OrderStatus.CREATED,
        updatedAt: new Date(),
      };

      const processedEvent = (service as any).processEventData(eventWithoutMetadata);

      expect(processedEvent.metadata).toBeDefined();
    });
  });

  describe('isValidStatus', () => {
    it('debería retornar true para estados válidos', () => {
      const isValid = (service as any).isValidStatus(OrderStatus.PROCESSING);

      expect(isValid).toBe(true);
    });

    it('debería retornar false para estados inválidos', () => {
      const isValid = (service as any).isValidStatus('INVALID_STATUS' as OrderStatus);

      expect(isValid).toBe(false);
    });
  });

  describe('getServiceStatus', () => {
    it('debería retornar el estado actual del servicio', () => {
      const status = service.getServiceStatus();

      expect(status).toHaveProperty('isInitialized');
      expect(status).toHaveProperty('isProcessing');
      expect(status).toHaveProperty('connectedClients');
      expect(status).toHaveProperty('reconnectAttempts');
    });

    it('debería reflejar el estado de procesamiento', () => {
      const status = service.getServiceStatus();

      expect(typeof status.isProcessing).toBe('boolean');
    });
  });

  describe('stopEventConsumption', () => {
    it('debería detener el consumo de eventos', async () => {
      await service.onModuleInit();
      await service.stopEventConsumption();

      const status = service.getServiceStatus();
      expect(status.isProcessing).toBe(false);
    });

    it('debería limpiar la suscripción', async () => {
      await service.onModuleInit();
      await service.stopEventConsumption();

      expect((service as any).eventSubscription).toBeNull();
    });
  });
});