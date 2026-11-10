import { Component, OnInit, OnDestroy, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { Subscription } from 'rxjs';
import { OrderEventService } from '../../core/services/order-event.service';
import { OrderEvent } from '../../core/models/order-event.model';

interface OrderState {
  orderId: string;
  status: string;
  timestamp: string;
  details?: Record<string, unknown>;
  lastUpdate: Date;
}

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatListModule,
    MatDividerModule
  ],
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.scss']
})
export class OrderTrackingComponent implements OnInit, OnDestroy {
  private readonly orderEventService = inject(OrderEventService);
  private eventSubscription: Subscription | null = null;

  readonly isConnected = this.orderEventService.isConnected;
  readonly connectionError = this.orderEventService.connectionError;
  readonly errorMessage = this.orderEventService.errorMessage;

  readonly orders = signal<Map<string, OrderState>>(new Map());
  readonly orderList = computed(() => {
    const orderMap = this.orders();
    return Array.from(orderMap.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  });

  readonly pendingCount = computed(() => 
    Array.from(this.orders().values()).filter(o => o.status === 'PENDING').length
  );

  readonly processingCount = computed(() => 
    Array.from(this.orders().values()).filter(o => o.status === 'PROCESSING').length
  );

  readonly completedCount = computed(() => 
    Array.from(this.orders().values()).filter(o => o.status === 'COMPLETED').length
  );

  readonly isLoading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const connected = this.isConnected();
      if (connected) {
        console.log('[OrderTracking] Conexión con servidor de eventos establecida');
      }
    });
  }

  ngOnInit(): void {
    this.connectToEventStream();
  }

  ngOnDestroy(): void {
    this.disconnectFromEventStream();
  }

  connectToEventStream(): void {
    this.isLoading.set(true);
    this.orderEventService.connect();
    
    this.eventSubscription = this.orderEventService.observeOrderEvents().subscribe({
      next: (event: OrderEvent) => {
        this.handleOrderEvent(event);
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        console.error('[OrderTracking] Error al recibir eventos:', err.message);
        this.isLoading.set(false);
      }
    });
  }

  disconnectFromEventStream(): void {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
      this.eventSubscription = null;
    }
    this.orderEventService.disconnect();
  }

  reconnect(): void {
    this.disconnectFromEventStream();
    this.orders.set(new Map());
    setTimeout(() => this.connectToEventStream(), 500);
  }

  private handleOrderEvent(event: OrderEvent): void {
    const currentOrders = new Map(this.orders());
    const existingOrder = currentOrders.get(event.orderId);
    
    const newOrderState: OrderState = {
      orderId: event.orderId,
      status: event.status,
      timestamp: event.timestamp,
      details: event.details,
      lastUpdate: new Date()
    };
    
    currentOrders.set(event.orderId, newOrderState);
    this.orders.set(currentOrders);
    
    if (existingOrder && existingOrder.status !== event.status) {
      console.log(`[OrderTracking] Orden ${event.orderId} actualizada: ${existingOrder.status} -> ${event.status}`);
    } else if (!existingOrder) {
      console.log(`[OrderTracking] Nueva orden recibida: ${event.orderId}`);
    }
  }

  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      'PENDING': 'status--pending',
      'PROCESSING': 'status--processing',
      'COMPLETED': 'status--completed',
      'CANCELLED': 'status--cancelled',
      'FAILED': 'status--failed'
    };
    return statusMap[status] || 'status--unknown';
  }

  getStatusIcon(status: string): string {
    const iconMap: Record<string, string> = {
      'PENDING': 'schedule',
      'PROCESSING': 'autorenew',
      'COMPLETED': 'check_circle',
      'CANCELLED': 'cancel',
      'FAILED': 'error'
    };
    return iconMap[status] || 'help_outline';
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  getOrderDetails(order: OrderState): string[] {
    if (!order.details) return [];
    return Object.entries(order.details).map(([key, value]) => `${key}: ${value}`);
  }
}