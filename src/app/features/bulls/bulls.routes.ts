import { Routes } from '@angular/router';
import { RoutesApp } from '../../shared/const/routes.app';

export default [
  { path: RoutesApp.root, loadComponent: () => import(`./pages/bull-list-page/bull-list-page`) },
] as Routes;
