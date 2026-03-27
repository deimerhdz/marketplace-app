import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import {
  URL_AUTH_CONFIRM_PASS,
  URL_AUTH_REFRESH,
  URL_AUTH_SIGNIN,
  URL_BREEDS,
  URL_CATALOG,
} from '@app/core/const/api';
import { RefreshTokenManageService } from '../services/refreshToken.service';
import { EMPTY } from 'rxjs';
import { Router } from '@angular/router';

const PUBLIC_URLS = [URL_AUTH_SIGNIN, URL_AUTH_CONFIRM_PASS, URL_BREEDS, URL_CATALOG];

export const ApiInterceptor = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const isPublic = PUBLIC_URLS.some((url) => request.url.includes(url));
  if (isPublic) return next(request);

  const refreshTokenService = inject(RefreshTokenManageService);

  if (request.url === URL_AUTH_REFRESH) {
    const requestClone = refreshTokenService.addTokenHeader(request);
    return next(requestClone);
  }

  if (refreshTokenService.isRefreshing) {
    return EMPTY;
  }

  const dataUser = refreshTokenService.getDataUser();

  if (!dataUser || !dataUser.accessToken) {
    inject(Router).navigateByUrl('/');
    return EMPTY;
  }

  const requestClone = refreshTokenService.addTokenHeader(request);

  return next(requestClone);
};
