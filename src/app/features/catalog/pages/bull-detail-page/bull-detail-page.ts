import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { RoutesApp } from '@app/shared/const/routes.app';
import { Breadcrumb } from '@app/shared/ui/breadcrumb/breadcrumb';
import { Gallery } from '@app/shared/ui/gallery/gallery';
import { CatalogService } from '../../service/catalog.service';
import { Bull } from '@app/features/bulls/model/bull.model';
import { StrawSelector } from '@app/shared/ui/straw-selector/straw-selector';
import { Straw } from '@app/features/bulls/model/straw.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-bull-detail-page',
  imports: [Breadcrumb, CurrencyPipe, Gallery, StrawSelector],
  templateUrl: './bull-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BullDetailPage implements OnInit {
  private _catalogService = inject(CatalogService);
  private _router = inject(Router);

  slug = input<string>();
  sku = input<string>();

  selectedStraw = signal<Straw | null>(null);
  bull = signal<Bull | null>(null);

  gallery = computed(() => {
    const bull = this.bull();

    return [...(bull?.image ? [bull.image] : []), ...(bull?.gallery ?? [])];
  });

  ngOnInit(): void {
    this.getBull();
  }

  getBull() {
    this._catalogService.getDetail(this.slug()!).subscribe({
      next: (response) => {
        this.bull.set(response);
      },
    });
  }

  checkout() {
    this._router.navigateByUrl(`/${RoutesApp.checkout}`);
  }
  selectStraw(straw: Straw) {
    console.log(straw);
    this.selectedStraw.set(straw);
  }
}
