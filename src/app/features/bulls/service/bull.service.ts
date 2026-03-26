import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Paginated } from '@app/core/model/paginated-response.model';
import { RoutesApp } from '@app/shared/const/routes.app';
import { environment } from '@env/environment';
import { Bull } from '../model/bull.model';
import { Observable } from 'rxjs';
import { CreateBull } from '../model/create-bull.model';

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
    return this._http.post(`${this._apiUrl}/${RoutesApp.bulls}`, newBull);
  }

  getById(id: string) {
    return this._http.get<Bull>(`${this._apiUrl}/${RoutesApp.bulls}/${id}`);
  }
}
