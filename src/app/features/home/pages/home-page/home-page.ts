import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { HowItWork } from '../../components/how-it-work/how-it-work';
import { Carrousel } from '../../components/carrousel/carrousel';
import { FeaturedBullList } from '../../components/featured-bull-list/featured-bull-list';
import { HomeService } from '../../services/home.service';
import { Bull } from '@app/features/bulls/model/bull.model';
import { Router } from '@angular/router';
import { RoutesApp } from '@app/shared/const/routes.app';

@Component({
  selector: 'app-home-page',
  imports: [Carrousel, HowItWork, FeaturedBullList],
  templateUrl: './home-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePage implements OnInit {
  private _router = inject(Router);
  private _homeService = inject(HomeService);

  public featuredBull = signal<Bull[]>([]);

  ngOnInit(): void {
    this._homeService.getFeaturedBulls().subscribe({
      next: (response) => {
        this.featuredBull.set(response);
      },
    });
  }

  navigateToCatalog() {
    this._router.navigateByUrl(`/${RoutesApp.catalog}`);
  }
}
