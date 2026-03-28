import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '@app/core/services/local-storage.service';
import { RoutesApp } from '@app/shared/const/routes.app';
import { Item } from '../../model/item.model';
import { QuantitySelector } from '@app/shared/ui/quantity-selector/quantity-selector';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-checkout-page',
  imports: [QuantitySelector, CurrencyPipe],
  templateUrl: './checkout-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CheckoutPage implements AfterViewInit, OnDestroy {
  private _router = inject(Router);
  private _storageService = inject(LocalStorageService);
  private onBeforeUnload = () => this.clearStorage();
  quantity = signal<number>(1);
  item = signal<Item | null>(null);
  totalPrice = computed(() => {
    const price = this.item()?.straw.price ?? 0;
    return price * this.quantity();
  });

  backShopping() {
    this.clearStorage();
    this._router.navigateByUrl(`/${RoutesApp.catalog}`);
  }

  ngAfterViewInit(): void {
    const item = this._storageService.getItem<Item>('item');
    const quantity = this._storageService.getItem<number>('quantity');

    // Si no existen los elementos, redirigir a "/"
    if (!item || !quantity) {
      this._router.navigateByUrl('/');
      return;
    }

    this.item.set(item);
    this.quantity.set(quantity);

    window.addEventListener('beforeunload', this.onBeforeUnload);
  }

  private clearStorage(): void {
    this._storageService.removeItem('item');
    this._storageService.removeItem('quantity');
  }

  ngOnDestroy(): void {
    this.clearStorage();
    window.removeEventListener('beforeunload', this.onBeforeUnload);
  }
}
