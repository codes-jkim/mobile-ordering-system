import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { AdminLayout } from './features/admin/components/admin-layout/admin-layout';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/admin/components/login/login').then((m) => m.Login),
  },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'order-list', pathMatch: 'full' },
      {
        path: 'order-list',
        loadComponent: () =>
          import('./features/admin/components/orders/order-list/order-list').then(
            (m) => m.OrderList,
          ),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/components/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'management',
        loadComponent: () =>
          import('./features/admin/components/products/product-management/product-management').then(
            (m) => m.ProductManagement,
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/admin/components/settings/settings').then((m) => m.Settings),
      },
    ],
  },
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/components/product-list/product-list').then(
            (m) => m.ProductList,
          ),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found').then((m) => m.NotFound),
  },
];
