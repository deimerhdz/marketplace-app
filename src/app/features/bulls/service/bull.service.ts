import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Paginated } from '@app/core/model/paginated-response.model';
import { RoutesApp } from '@app/shared/const/routes.app';
import { environment } from '@env/environment';
import { Bull } from '../model/bull.model';
import { catchError, Observable, throwError } from 'rxjs';
import { CreateBull } from '../model/create-bull.model';
import { CreateStraw } from '../model/createStraw.model';
import { Straw } from '../model/straw.model';

@Injectable({
  providedIn: 'root',
})
export class BullService {
  private _apiUrl = environment.apiUrl;
  private _http = inject(HttpClient);

  getBulls(page: number, elements: number): Observable<Paginated<Bull>> {
    return this._http.get<Paginated<Bull>>(
      `${this._apiUrl}/${RoutesApp.bulls}?page=${page}&elements=${elements}`,
    );
  }

  create(newBull: CreateBull) {
    return this._http.post<Bull>(`${this._apiUrl}/${RoutesApp.bulls}`, newBull);
  }

  getById(id: string) {
    return this._http.get<Bull>(`${this._apiUrl}/${RoutesApp.bulls}/${id}`);
  }

  updateImage(id: string, key: string, contentType: string) {
    return this._http.put<Bull>(`${this._apiUrl}/${RoutesApp.bulls}/image/${id}`, {
      key,
      contentType,
    });
  }

  getStraws(bullId: string) {
    return this._http.get<Straw[]>(`${this._apiUrl}/${RoutesApp.straws}/${bullId}`);
  }

  createStraw(dto: CreateStraw): Observable<unknown> {
    return this._http
      .post(`${this._apiUrl}/${RoutesApp.straws}`, dto)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error.error.error)));
  }

  getUploadUrl(filePath: string, filename: string, contentType: string) {
    return this._http.post<{ url: string; file: string }>(
      `${this._apiUrl}/files/pre-signed-url?filename=${filename}&contentType=${contentType}&filePath=${filePath}`,
      {},
    );
  }

  uploadFileToS3(url: string, file: File) {
    return fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file.slice(0, file.size, file.type),
    });
  }
}
