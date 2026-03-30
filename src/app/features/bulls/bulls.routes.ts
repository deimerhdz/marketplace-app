import { Routes } from '@angular/router';
import { RoutesApp } from '../../shared/const/routes.app';

export default [
  { path: RoutesApp.root, loadComponent: () => import(`./pages/bull-list-page/bull-list-page`) },
  { path: RoutesApp.new, loadComponent: () => import(`./pages/bull-add-page/bull-add-page`) },
  {
    path: `${RoutesApp.edit}/:id`,
    loadComponent: () => import(`./pages/bull-add-page/bull-add-page`),
  },
  {
    path: `${RoutesApp.detail}/:id`,
    loadComponent: () => import(`./pages/bull-detail-page/bull-detail-page`),
  },
] as Routes;
