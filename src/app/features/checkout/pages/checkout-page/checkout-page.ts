import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesApp } from '@app/shared/const/routes.app';

@Component({
  selector: 'app-checkout-page',
  imports: [],
  templateUrl: './checkout-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CheckoutPage {
  private _router = inject(Router);

  backShopping() {
    this._router.navigateByUrl(`/${RoutesApp.catalog}`);
  }
}
