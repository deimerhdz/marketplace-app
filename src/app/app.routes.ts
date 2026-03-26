import { Routes } from '@angular/router';
import { RoutesApp } from './shared/const/routes.app';
import { NotAuthenticatedGuard } from './features/auth/guards/notAuthenticated.guard';
import { AuthenticatedGuard } from './features/auth/guards/authenticated.guard';

export const routes: Routes = [
  {
    path: RoutesApp.root,
    loadComponent: () => import(`@shared/templates/home-layout/home-layout`),
    children: [
      { path: RoutesApp.root, loadChildren: () => import(`@app/features/home/home.routes`) },
      {
        path: RoutesApp.catalog,
        loadChildren: () => import(`@app/features/catalog/catalog.routes`),
      },
      {
        path: RoutesApp.checkout,
        loadChildren: () => import(`@app/features/checkout/checkout.routes`),
      },
    ],
  },
  {
    path: RoutesApp.auth,
    loadComponent: () => import(`@shared/templates/home-layout/home-layout`),
    canMatch: [NotAuthenticatedGuard],
    children: [{ path: RoutesApp.root, loadChildren: () => import(`@features/auth/auth.routes`) }],
  },
  {
    path: RoutesApp.admin,
    canMatch: [AuthenticatedGuard],
    loadComponent: () => import(`@shared/templates/admin-layout/admin-layout`),
    children: [
      {
        path: RoutesApp.dashboard,
        loadChildren: () => import(`@features/dashboard/dashboard.routes`),
      },
      { path: RoutesApp.orders, loadChildren: () => import(`@features/orders/orders.routes`) },
      { path: RoutesApp.bulls, loadChildren: () => import(`@features/bulls/bulls.routes`) },
      {
        path: RoutesApp.settings,
        loadChildren: () => import(`@features/settings/settings.routes`),
      },
    ],
  },
];
