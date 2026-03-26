import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

import { RoutesApp } from '@app/shared/const/routes.app';

export const NotAuthenticatedGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.token();

  if (token) {
    router.navigateByUrl(`/${RoutesApp.admin}/${RoutesApp.dashboard}`);
    return false;
  }

  return true;
};
