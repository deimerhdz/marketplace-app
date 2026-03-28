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
import { AuthService } from '@app/features/auth/services/auth.service';
import { QuantitySelector } from '@app/shared/ui/quantity-selector/quantity-selector';

import { LocalStorageService } from '@app/core/services/local-storage.service';

@Component({
  selector: 'app-bull-detail-page',
  imports: [Breadcrumb, CurrencyPipe, QuantitySelector, Gallery, StrawSelector],
  templateUrl: './bull-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BullDetailPage implements OnInit {
  private _catalogService = inject(CatalogService);
  private _storageService = inject(LocalStorageService);
  private authStatus = inject(AuthService).authStatus();
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
  quantity = signal<number>(1);

  totalPrice = computed(() => {
    const price = this.selectedStraw()?.price ?? 0;
    return price * this.quantity();
  });

  getBull() {
    this._catalogService.getDetail(this.slug()!).subscribe({
      next: (response) => {
        this.bull.set(response);
      },
    });
  }

  checkout() {
    this._storageService.setItem('quantity', this.quantity());
    this._storageService.setItem('item', {
      image: this.bull()?.image,
      breed: this.bull()?.breed.name,
      name: this.bull()?.name,
      straw: this.selectedStraw(),
    });
    if (this.authStatus === 'authenticated') {
      this._router.navigateByUrl(`/${RoutesApp.checkout}`);
    } else {
      this._router.navigate([`/${RoutesApp.auth}/${RoutesApp.login}`], {
        queryParams: { returnUrl: this._router.url },
      });
      return;
    }
  }

  selectStraw(straw: Straw) {
    this.selectedStraw.set(straw);
    this.quantity.set(straw.minOrder);
  }
}
