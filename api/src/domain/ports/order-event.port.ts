import { Observable } from 'rxjs';
import { OrderEvent } from '../models/order-event.model';

export interface OrderEventPort {
  streamOrderEvents(): Observable<OrderEvent>;
  closeConnection(): Promise<void>;
}