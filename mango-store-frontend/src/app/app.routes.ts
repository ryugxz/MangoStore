import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard'; // Adjust the import path if necessary

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/home-layout/home-layout.component').then(
        (m) => m.HomeLayoutComponent,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home-page/home-page.component').then(
            (m) => m.HomePageComponent,
          ),
      },
      {
        path: 'vendor-dashboard',
        loadComponent: () =>
          import('./pages/vendor-dashboard/vendor-dashboard.component').then(
            (m) => m.VendorDashboardComponent,
          ),
        canActivate: [authGuard],
        data: { expectedRoles: ['vendor', 'admin'] }
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./pages/cart-page/cart-page.component').then(
            (m) => m.CartPageComponent,
          ),
        canActivate: [authGuard],
        data: { expectedRoles: ['vendor', 'admin','customer'] }
      },
      {
        path: 'order-customer',
        loadComponent: () =>
          import('./pages/order-customer-page/order-customer-page.component').then(
            (m) => m.OrderCustomerPageComponent,
          ),
        canActivate: [authGuard],
        data: { expectedRoles: ['vendor', 'admin','customer'] }
      },
      {
        path: 'order-status',
        loadComponent: () =>
          import('./pages/order-status-page/order-status-page.component').then(
            (m) => m.OrderStatusPageComponent,
          ),
        canActivate: [authGuard],
        data: { expectedRoles: ['vendor', 'admin','customer'] }
      }
    ],
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/checkout-page/checkout-page.component').then(
        (m) => m.CheckoutPageComponent,
      ),
    canActivate: [authGuard],
    data: { expectedRoles: ['vendor', 'admin','customer'] }
  },
];
