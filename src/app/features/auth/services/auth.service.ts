import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SignIn } from '../model/signIn.model';
import { AuthResponse, ChangePassword } from '../model/auth.response';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '@env/environment';
import { UserAuth } from '../model/userAuth.model';
import { LocalStorageService } from '@app/core/services/local-storage.service';
import { KEY_STORAGE } from '@app/core/enums/storage.enum';
import { SingUp } from '../model/signUp.model';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _apiUrl = environment.apiUrl;
  private _http = inject(HttpClient);
  private _localStorageService = inject(LocalStorageService);

  private _authStatus = signal<AuthStatus>('checking');

  private _user = signal<UserAuth | null>(null);

  private _token = signal<string | null | undefined>(
    this._localStorageService.getItem<AuthResponse>(KEY_STORAGE.DATA_USER)?.accessToken,
  );
  private _refreshToken = signal<string | null | undefined>(
    this._localStorageService.getItem<AuthResponse>(KEY_STORAGE.DATA_USER)?.refreshToken,
  );

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';
    if (this._user()) {
      return 'authenticated';
    }
    return 'not-authenticated';
  });

  user = computed<UserAuth | null>(() => this._user());
  token = computed(() => this._token());
  refreshToken = computed(() => this._refreshToken());

  // ─── Login ───────────────────────────────────────────────────────────────
  login(credentials: SignIn): Observable<AuthResponse> {
    return this._http.post<AuthResponse>(`${this._apiUrl}/auth/login`, credentials).pipe(
      map((response) => this.handleAuthSuccess(response)),
      catchError((error) => this.handleAuthError(error)),
    );
  }

  register(credentials: SingUp): Observable<AuthResponse> {
    return this._http.post<AuthResponse>(`${this._apiUrl}/auth/register`, credentials).pipe(
      map((response) => this.handleAuthSuccess(response)),
      catchError((error) => this.handleAuthError(error)),
    );
  }

  confirmPassword(payload: ChangePassword): Observable<AuthResponse> {
    return this._http.post<AuthResponse>(`${this._apiUrl}/auth/confirm-password`, payload).pipe(
      map((response) => this.handleAuthSuccess(response)),
      catchError((error) => this.handleAuthError(error)),
    );
  }

  getRefreshToken(): Observable<AuthResponse> {
    return this._http.get<AuthResponse>(`${this._apiUrl}/auth/refresh`);
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');
    this._localStorageService.removeItem(KEY_STORAGE.DATA_USER);
  }

  me(): Observable<UserAuth> {
    return this._http.get<UserAuth>(`${this._apiUrl}/auth/me`).pipe(
      tap((user) => {
        this._user.set(user);
        this._authStatus.set('authenticated');
      }),
    );
  }

  private handleAuthSuccess(response: AuthResponse) {
    if (response.status === 'SUCCESS') {
      this._authStatus.set('authenticated');
      this._localStorageService.setItem(KEY_STORAGE.DATA_USER, response);
      this._token.set(response.accessToken);
      this._refreshToken.set(response.refreshToken);
      this._user.set(response.user);
    }
    return response;
  }

  private handleAuthError(error: HttpErrorResponse) {
    this.logout();
    return throwError(() => error);
  }
}
