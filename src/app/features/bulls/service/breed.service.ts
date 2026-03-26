import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RoutesApp } from '@app/shared/const/routes.app';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Breed } from '../model/breed.model';

@Injectable({
  providedIn: 'root',
})
export class BreedService {
  private _apiUrl = environment.apiUrl;
  private _http = inject(HttpClient);

  getBreeds(): Observable<Breed[]> {
    return this._http.get<Breed[]>(`${this._apiUrl}/${RoutesApp.breeds}`);
  }
}
