import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesApp } from '@app/shared/const/routes.app';

@Component({
  selector: 'app-login-page',
  imports: [],
  templateUrl: './login-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginPage {
  private _router = inject(Router);

  login() {
    this._router.navigateByUrl(`${RoutesApp.admin}/${RoutesApp.dashboard}`);
  }
}
