import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { HowItWork } from '../../components/how-it-work/how-it-work';
import { Carrousel } from '../../components/carrousel/carrousel';
import { FeaturedBullList } from '../../components/featured-bull-list/featured-bull-list';
import { HomeService } from '../../services/home.service';
import { Bull } from '@app/features/bulls/model/bull.model';
import { Router } from '@angular/router';
import { RoutesApp } from '@app/shared/const/routes.app';
import { BreedChips } from '../../components/breed-chips/breed-chips';
import { BreedService } from '@app/features/bulls/service/breed.service';
import { Breed } from '@app/features/bulls/model/breed.model';

@Component({
  selector: 'app-home-page',
  imports: [Carrousel, HowItWork, BreedChips, FeaturedBullList],
  templateUrl: './home-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePage implements OnInit {
  private _router = inject(Router);
  private _homeService = inject(HomeService);
  private _breedService = inject(BreedService);
  public breeds = signal<Breed[] | null>(null);
  public featuredBull = signal<Bull[]>([]);

  ngOnInit(): void {
    this.getBreeds();
    this._homeService.getFeaturedBulls().subscribe({
      next: (response) => {
        this.featuredBull.set(response);
      },
    });
  }

  navigateToCatalog(breed: string) {
    this._router.navigateByUrl(`/${RoutesApp.catalog}?breed=${breed}`);
  }

  getBreeds() {
    this._breedService.getBreeds().subscribe({
      next: (response) => {
        this.breeds.set(response);
      },
    });
  }
}
