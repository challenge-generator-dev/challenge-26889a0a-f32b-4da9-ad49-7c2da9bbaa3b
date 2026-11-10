import { IsDate, IsEnum, IsString, IsUUID } from 'class-validator';

export enum OrderStatus {
  CREATED = 'CREATED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export class OrderEvent {
  @IsUUID()
  orderId: string;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsDate()
  updatedAt: Date;

  @IsString()
  metadata?: string;

  constructor(orderId: string, status: OrderStatus, updatedAt: Date, metadata?: string) {
    this.orderId = orderId;
    this.status = status;
    this.updatedAt = updatedAt;
    this.metadata = metadata;
  }
}