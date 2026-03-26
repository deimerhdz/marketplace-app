import { ChangeDetectionStrategy, Component, inject, signal, OnInit, effect } from '@angular/core';
import { Bull } from '@app/features/bulls/model/bull.model';
import { CatalogService } from '../../service/catalog.service';
import { Card } from '@app/shared/ui/card/card';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutesApp } from '@app/shared/const/routes.app';
import { BreedFilter } from '../../component/breed-filter/breed-filter';
import { BreedService } from '@app/features/bulls/service/breed.service';
import { Breed } from '@app/features/bulls/model/breed.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-catalog-page',
  imports: [Card, BreedFilter],
  templateUrl: './catalog-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CatalogPage implements OnInit {
  private _router = inject(Router);
  private _catalogService = inject(CatalogService);
  private _route = inject(ActivatedRoute);
  private _breedService = inject(BreedService);
  public breeds = signal<Breed[] | null>(null);
  public bulls = signal<Bull[]>([]);
  breedFromRoute = toSignal(
    this._route.queryParamMap.pipe(map((params) => params.get('breed') ?? null)),
    { initialValue: null },
  );
  constructor() {
    // 👇 Única fuente de verdad — reacciona solo al cambio de URL
    effect(() => {
      const breed = this.breedFromRoute();
      this.getBullByBreed(breed ?? '');
    });
  }
  ngOnInit(): void {
    this.getBreeds();
  }

  navigateToDetail(event: { slug?: string; sku?: string }) {
    this._router.navigateByUrl(
      `/${RoutesApp.catalog}/${RoutesApp.bull}/${event.slug}/${event.sku}`,
    );
  }

  getBullByBreed(breed: string) {
    this._catalogService.getBullsByBreed(breed).subscribe({
      next: (response) => {
        this.bulls.set(response);
      },
    });
  }

  getBreeds() {
    this._breedService.getBreeds().subscribe({
      next: (response) => {
        this.breeds.set(response);
      },
    });
  }

  onBreedSelected(breed: string) {
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: { breed: breed || null },
      queryParamsHandling: 'merge',
    });
  }
}
