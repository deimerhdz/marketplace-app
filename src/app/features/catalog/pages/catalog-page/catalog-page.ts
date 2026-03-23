import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { Bull } from '@app/features/bulls/model/bull.model';
import { CatalogService } from '../../service/catalog.service';
import { Card } from '@app/shared/ui/card/card';
import { Router } from '@angular/router';
import { RoutesApp } from '@app/shared/const/routes.app';

@Component({
  selector: 'app-catalog-page',
  imports: [Card],
  templateUrl: './catalog-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CatalogPage implements OnInit {
  private _router = inject(Router);
  private _catalogService = inject(CatalogService);

  public bulls = signal<Bull[]>([]);

  ngOnInit(): void {
    this._catalogService.getBulls().subscribe({
      next: (response) => {
        this.bulls.set(response);
      },
    });
  }

  navigateToDetail(event: { slug?: string; sku?: string }) {
    this._router.navigateByUrl(
      `/${RoutesApp.catalog}/${RoutesApp.bull}/${event.slug}/${event.sku}`,
    );
  }
}
