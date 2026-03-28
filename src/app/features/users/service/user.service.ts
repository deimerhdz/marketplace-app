import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Paginated } from '@app/core/model/paginated-response.model';
import { RoutesApp } from '@app/shared/const/routes.app';
import { environment } from '@env/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '../model/user.model';
import { CreateUser } from '../model/create-user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _apiUrl = environment.apiUrl;
  private _http = inject(HttpClient);

  getUsers(params: { page: number; size: number }): Observable<Paginated<User>> {
    return this._http.get<Paginated<User>>(
      `${this._apiUrl}/${RoutesApp.users}?page=${params.page}&elements=${params.size}`,
    );
  }

  create(newUser: CreateUser) {
    return this._http
      .post<{
        message: string;
      }>(`${this._apiUrl}/${RoutesApp.users}/${RoutesApp.register}`, newUser)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error.error.error)));
  }
}
