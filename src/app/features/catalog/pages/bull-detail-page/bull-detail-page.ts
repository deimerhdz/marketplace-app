import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesApp } from '@app/shared/const/routes.app';
import { Breadcrumb } from '@app/shared/ui/breadcrumb/breadcrumb';
import { Gallery } from '@app/shared/ui/gallery/gallery';

@Component({
  selector: 'app-bull-detail-page',
  imports: [Breadcrumb, Gallery],
  templateUrl: './bull-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BullDetailPage {
  private _router = inject(Router);

  checkout() {
    this._router.navigateByUrl(`/${RoutesApp.checkout}`);
  }
}
