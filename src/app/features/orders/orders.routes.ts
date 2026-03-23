import { Routes } from '@angular/router';
import { RoutesApp } from '../../shared/const/routes.app';

export default [
  { path: RoutesApp.root, loadComponent: () => import(`./pages/order-list-page/order-list-page`) },
] as Routes;
