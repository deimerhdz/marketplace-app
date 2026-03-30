import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
} from '@angular/core';
import { FeaturedBullList } from '../../components/featured-bull-list/featured-bull-list';
import { CatalogService } from '@app/features/catalog/service/catalog.service';
import { BreedService } from '@app/features/bulls/service/breed.service';
import { BreedChips } from '../../components/breed-chips/breed-chips';
import { HowItWork } from '../../components/how-it-work/how-it-work';
import { Carrousel } from '../../components/carrousel/carrousel';
import { Breed } from '@app/features/bulls/model/breed.model';
import { Bull } from '@app/features/bulls/model/bull.model';
import { RoutesApp } from '@app/shared/const/routes.app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [Carrousel, HowItWork, BreedChips, FeaturedBullList],
  templateUrl: './home-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePage implements AfterViewInit {
  private _router = inject(Router);
  private _catalogService = inject(CatalogService);
  private _breedService = inject(BreedService);
  public breeds = signal<Breed[] | null>(null);
  public recentBulls = signal<Bull[] | null>(Array(4).fill(null));

  ngAfterViewInit(): void {
    this.getBreeds();
    this.loadRecentBulls();
  }
  navigateToCatalog(breed: string) {
    this._router.navigateByUrl(`/${RoutesApp.catalog}?breed=${breed}`);
  }

  getBreeds() {
    this._breedService.getBreeds().subscribe({
      next: (response) => {
        this.breeds.set(response);
      },
      error: (err) => {
        console.error('Error en getBreeds:', err);
      },
    });
  }

  loadRecentBulls() {
    this._catalogService.getNew(10).subscribe({
      next: (response) => {
        this.recentBulls.set(response);
      },
      error: (err) => {
        console.error('Error en loadRecentBulls:', err); // 👈 ¿hay algún error silencioso?
      },
    });
  }
}
