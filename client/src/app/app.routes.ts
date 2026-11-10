import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'orders',
    pathMatch: 'full'
  },
  {
    path: 'orders',
    loadComponent: () => 
      import('./features/orders/order-tracking.component').then(
        m => m.OrderTrackingComponent
      ),
    title: 'Seguimiento de Órdenes'
  },
  {
    path: '**',
    redirectTo: 'orders'
  }
];