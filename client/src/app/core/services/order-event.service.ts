import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ORDER_EVENT_API_URL } from '../models/order-event.model';
import { OrderEvent } from '../models/order-event.model';
import { Observable, Subscription, catchError, EMPTY, finalize, share } from 'rxjs';

/**
 * Servicio encargado de consumir eventos de órdenes en tiempo real mediante SSE.
 * Proporciona una señal reactiva para que los componentes puedan reaccionar
 * a los cambios en el estado de las órdenes.
 */
@Injectable({
  providedIn: 'root'
})
export class OrderEventService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(ORDER_EVENT_API_URL);

  /**
   * Señal reactiva que contiene el último evento de orden recibido.
   * Los componentes pueden suscribirse a esta señal para actualizar la UI.
   */
  readonly lastOrderEvent = signal<OrderEvent | null>(null);

  /**
   * Señal reactiva que indica si el servicio está actualmente conectado
   * al stream de eventos.
   */
  readonly isConnected = signal<boolean>(false);

  /**
   * Señal reactiva que indica si hubo un error al conectarse al stream.
   */
  readonly connectionError = signal<boolean>(false);

  /**
   * Señal reactiva que contiene el mensaje de error más reciente.
   */
  readonly errorMessage = signal<string>('');

  private eventSource!: EventSource;
  private eventSubscription!: Subscription;

  /**
   * Inicia la conexión con el stream de eventos SSE.
   * @returns Observable que emite cada evento de orden recibido.
   */
  connect(): Observable<OrderEvent> {
    if (this.isConnected()) {
      console.warn('OrderEventService: Ya hay una conexión activa.');
      return EMPTY;
    }

    this.isConnected.set(true);
    this.connectionError.set(false);
    this.errorMessage.set('');

    return new Observable<OrderEvent>((subscriber) => {
      try {
        // Configuración del EventSource con opciones para manejar CORS y reconexión
        this.eventSource = new EventSource(this.apiUrl, {
          withCredentials: false
        });

        // Manejo de errores en la conexión SSE
        this.eventSource.onerror = (error) => {
          this.handleConnectionError(error);
          subscriber.error(error);
        };

        // Procesamiento de mensajes recibidos
        this.eventSource.onmessage = (event) => {
          try {
            const orderEvent: OrderEvent = JSON.parse(event.data);
            this.lastOrderEvent.set(orderEvent);
            subscriber.next(orderEvent);
          } catch (parseError) {
            console.error('OrderEventService: Error al parsear evento:', parseError);
            this.errorMessage.set('Error al procesar el evento recibido');
            subscriber.error(parseError);
          }
        };

        // Manejo de eventos con tipo específico
        this.eventSource.addEventListener('order-event', (event) => {
          try {
            const orderEvent: OrderEvent = JSON.parse(event.data);
            this.lastOrderEvent.set(orderEvent);
            subscriber.next(orderEvent);
          } catch (parseError) {
            console.error('OrderEventService: Error al parsear evento con tipo:', parseError);
            this.errorMessage.set('Error al procesar el evento con tipo');
            subscriber.error(parseError);
          }
        });

      } catch (error) {
        this.handleConnectionError(error);
        subscriber.error(error);
      }

      // Retorno de la función de limpieza
      return () => {
        this.disconnect();
      };
    }).pipe(
      // Compartir la suscripción para evitar múltiples conexiones
      share(),
      // Manejo de errores global
      catchError((error) => {
        this.handleConnectionError(error);
        return EMPTY;
      }),
      // Finalizar la conexión cuando se complete el observable
      finalize(() => {
        this.isConnected.set(false);
      })
    );
  }

  /**
   * Cierra la conexión con el stream de eventos SSE.
   */
  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
    this.isConnected.set(false);
  }

  /**
   * Maneja errores en la conexión con el stream de eventos.
   * @param error Error recibido
   */
  private handleConnectionError(error: unknown): void {
    this.disconnect();
    this.connectionError.set(true);
    this.isConnected.set(false);

    if (error instanceof Error) {
      this.errorMessage.set(error.message);
      console.error('OrderEventService: Error de conexión:', error.message);
    } else {
      this.errorMessage.set('Error desconocido en la conexión');
      console.error('OrderEventService: Error desconocido:', error);
    }
  }

  /**
   * Observa los eventos de órdenes y actualiza la señal reactiva.
   * Útil para componentes que necesitan suscribirse directamente a los eventos.
   */
  observeOrderEvents(): Observable<OrderEvent> {
    return new Observable<OrderEvent>(subscriber => {
      const subscription = this.connect().subscribe({
        next: (event) => subscriber.next(event),
        error: (err) => subscriber.error(err),
        complete: () => subscriber.complete()
      });

      return () => {
        subscription.unsubscribe();
        this.disconnect();
      };
    });
  }
}