import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {} from '@app/features/bulls/enums/straw.enum';
import { Bull } from '@app/features/bulls/model/bull.model';

import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private _http = inject(HttpClient);
  private _apiUrl = environment.apiUrl;

  getNew(limit: number): Observable<Bull[]> {
    return this._http.get<Bull[]>(`${this._apiUrl}/catalog/recent?limit=${limit}`);
  }

  getDetail(slug: string): Observable<Bull> {
    return this._http.get<Bull>(`${this._apiUrl}/catalog/${slug}`);
  }

  getBullsByBreed(breed: string): Observable<Bull[]> {
    return this._http.get<Bull[]>(`${this._apiUrl}/catalog?name=${breed}`);
  }
}
