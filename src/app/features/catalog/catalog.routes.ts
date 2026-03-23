import { Routes } from '@angular/router';
import { RoutesApp } from '../../shared/const/routes.app';

export default [
  { path: RoutesApp.root, loadComponent: () => import(`./pages/catalog-page/catalog-page`) },
  {
    path: `${RoutesApp.bull}/:slug/:sku`,
    loadComponent: () => import(`./pages/bull-detail-page/bull-detail-page`),
  },
] as Routes;
