import { Routes } from '@angular/router';
import { RoutesApp } from '../../shared/const/routes.app';

export default [
  { path: RoutesApp.root, loadComponent: () => import(`./pages/user-list-page/user-list-page`) },
  { path: RoutesApp.new, loadComponent: () => import(`./pages/user-add-page/user-add-page`) },
] as Routes;
