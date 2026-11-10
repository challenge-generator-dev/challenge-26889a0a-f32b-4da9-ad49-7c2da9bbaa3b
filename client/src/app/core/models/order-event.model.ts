import { InjectionToken } from '@angular/core';

/**
 * Modelo que representa un evento de orden.
 * Contiene la información clave sobre el estado actual de una orden.
 */
export interface OrderEvent {
  /**
   * Identificador único de la orden.
   */
  orderId: string;

  /**
   * Estado actual de la orden.
   * Ejemplos: 'CREATED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'
   */
  status: string;

  /**
   * Fecha y hora en que se generó el evento (ISO 8601).
   */
  timestamp: string;

  /**
   * Detalles adicionales sobre el evento.
   * Puede incluir información como ubicación, método de pago, etc.
   */
  details?: {
    [key: string]: unknown;
  };
}

/**
 * Token de inyección para la URL base de la API de órdenes.
 * Permite configurar dinámicamente la URL del endpoint SSE.
 */
export const ORDER_EVENT_API_URL = new InjectionToken<string>('ORDER_EVENT_API_URL', {
  providedIn: 'root',
  factory: () => 'http://localhost:3000/orders/events'
});