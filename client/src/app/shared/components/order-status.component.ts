import { Component, Input, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderEvent } from '../../core/models/order-event.model';

type OrderStatusType = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'unknown';

interface StatusConfig {
  label: string;
  icon: string;
  colorClass: string;
  bgClass: string;
}

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [CommonModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss']
})
export class OrderStatusComponent {
  @Input({ required: true }) set orderEvent(value: OrderEvent) {
    this._orderEvent.set(value);
  }

  readonly _orderEvent = signal<OrderEvent | null>(null);

  readonly statusConfig = computed<StatusConfig>(() => {
    const event = this._orderEvent();
    if (!event) return this.getDefaultConfig();
    return this.getConfigForStatus(event.status);
  });

  readonly formattedTimestamp = computed(() => {
    const event = this._orderEvent();
    if (!event?.timestamp) return '';
    try {
      const date = new Date(event.timestamp);
      return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return event.timestamp;
    }
  });

  readonly isRecent = computed(() => {
    const event = this._orderEvent();
    if (!event?.timestamp) return false;
    const eventTime = new Date(event.timestamp).getTime();
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    return (now - eventTime) < fiveMinutes;
  });

  private getConfigForStatus(status: string): StatusConfig {
    const normalizedStatus = this.normalizeStatus(status);
    const configs: Record<OrderStatusType, StatusConfig> = {
      pending: {
        label: 'Pendiente',
        icon: '⏳',
        colorClass: 'status--pending',
        bgClass: 'status-bg--pending'
      },
      processing: {
        label: 'Procesando',
        icon: '⚙️',
        colorClass: 'status--processing',
        bgClass: 'status-bg--processing'
      },
      shipped: {
        label: 'Enviado',
        icon: '📦',
        colorClass: 'status--shipped',
        bgClass: 'status-bg--shipped'
      },
      delivered: {
        label: 'Entregado',
        icon: '✅',
        colorClass: 'status--delivered',
        bgClass: 'status-bg--delivered'
      },
      cancelled: {
        label: 'Cancelado',
        icon: '❌',
        colorClass: 'status--cancelled',
        bgClass: 'status-bg--cancelled'
      },
      unknown: {
        label: 'Desconocido',
        icon: '❓',
        colorClass: 'status--unknown',
        bgClass: 'status-bg--unknown'
      }
    };
    return configs[normalizedStatus] || configs.unknown;
  }

  private normalizeStatus(status: string): OrderStatusType {
    if (!status) return 'unknown';
    const lower = status.toLowerCase().trim();
    if (lower.includes('pending') || lower.includes('pendiente')) return 'pending';
    if (lower.includes('processing') || lower.includes('procesando')) return 'processing';
    if (lower.includes('shipped') || lower.includes('enviado')) return 'shipped';
    if (lower.includes('delivered') || lower.includes('entregado')) return 'delivered';
    if (lower.includes('cancelled') || lower.includes('cancelado')) return 'cancelled';
    return 'unknown';
  }

  private getDefaultConfig(): StatusConfig {
    return {
      label: 'Sin estado',
      icon: '❓',
      colorClass: 'status--unknown',
      bgClass: 'status-bg--unknown'
    };
  }

  get orderId(): string {
    return this._orderEvent()?.orderId || '';
  }

  get hasDetails(): boolean {
    const event = this._orderEvent();
    return !!(event?.details && Object.keys(event.details).length > 0);
  }

  getStatusDetails(): Record<string, unknown> | undefined {
    return this._orderEvent()?.details;
  }
}