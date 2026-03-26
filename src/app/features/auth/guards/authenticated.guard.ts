import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RoutesApp } from '@app/shared/const/routes.app';

export const AuthenticatedGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.token();

  if (!token) {
    router.navigateByUrl(`/${RoutesApp.auth}/${RoutesApp.login}`);
    return false;
  }

  return true;
};
