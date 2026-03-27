import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { catchError, concatMap, EMPTY, finalize, throwError } from 'rxjs';
import { RefreshTokenManageService } from '../services/refreshToken.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const ErrorApiInterceptor = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const refreshTokenManageService = inject(RefreshTokenManageService);
  const router = inject(Router);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status == HttpStatusCode.Unauthorized) {
        console.log('****INICIANDO REFRESH TOKEN****');
        refreshTokenManageService.isRefreshing = true;

        return authService.getRefreshToken().pipe(
          finalize(() => (refreshTokenManageService.isRefreshing = false)),
          concatMap((response) => {
            refreshTokenManageService.updateTokens(response.accessToken, response.refreshToken);

            console.log('****TOKEN ACTUALIZADO****');

            const requestClone = refreshTokenManageService.addTokenHeader(request);
            return next(requestClone);
          }),
          catchError(() => {
            console.log('*******ERROR EN EL REFRESH TOKEN********');
            authService.logout();
            router.navigateByUrl('/');
            return EMPTY;
          }),
        );
      }

      return throwError(() => error);
    }),
  );
};
