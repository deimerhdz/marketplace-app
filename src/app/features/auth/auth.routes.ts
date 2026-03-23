import { Routes } from '@angular/router';
import { RoutesApp } from '@app/shared/const/routes.app';

export default [
  { path: RoutesApp.login, loadComponent: () => import(`./pages/login-page/login-page`) },
  { path: RoutesApp.register, loadComponent: () => import(`./pages/register-page/register-page`) },
] as Routes;
