import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Paginated } from '@app/core/model/paginated-response.model';
import { RoutesApp } from '@app/shared/const/routes.app';
import { environment } from '@env/environment';
import { Bull } from '../model/bull.model';
import { catchError, Observable, throwError } from 'rxjs';
import { CreateBull } from '../model/create-bull.model';
import { CreateStraw } from '../model/createStraw.model';
import { Straw } from '../model/straw.model';
import { MediaFile } from '@app/core/model/media-file.model';
export type ResourceType = 'IMAGE' | 'VIDEO' | 'GALLERY' | 'DOCUMENT';
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

  update(id: string, updateBull: CreateBull) {
    return this._http.put<Bull>(`${this._apiUrl}/${RoutesApp.bulls}/${id}`, updateBull);
  }

  getById(id: string) {
    return this._http.get<Bull>(`${this._apiUrl}/${RoutesApp.bulls}/${id}`);
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

  getUploadUrls(path: string, files: File[]) {
    const params = new HttpParams().set('filePath', path);
    const body = {
      files: files.map((f) => ({ key: f.name, contentType: f.type })),
    };
    return this._http.post<{ urls: string[] }>(`${this._apiUrl}/files/pre-signed-urls`, body, {
      params,
    });
  }

  deleteResource(id: string, key: string, resource: ResourceType) {
    return this._http.delete<Bull>(
      `${this._apiUrl}/${RoutesApp.bulls}/resource/${id}?key=${key}&resource=${resource}`,
    );
  }

  updateResource(id: string, files: MediaFile[], resource: ResourceType) {
    return this._http.put<Bull>(
      `${this._apiUrl}/${RoutesApp.bulls}/update-resource/${id}?resource=${resource}`,
      {
        files,
      },
    );
  }
}
