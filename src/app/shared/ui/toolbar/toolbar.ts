import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/features/auth/services/auth.service';
import { RoutesApp } from '@app/shared/const/routes.app';

@Component({
  selector: 'app-toolbar',
  imports: [],
  template: `
    <nav class="navbar bg-base-100 border-b border-b-gray-100 justify-between items-center">
      <div class="flex">
        <label for="my-drawer-3" class="btn drawer-button lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block h-5 w-5 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </label>
        <a class="btn btn-ghost text-xl">Tauru pro</a>
      </div>
      @if (authService.authStatus() === 'authenticated') {
        <div class="flex items-center gap-2">
          <p class="hidden md:block ">
            {{ authService.user()?.name }} {{ authService.user()?.lastName }}
          </p>
          <button class="btn btn-error text-white" (click)="logOut()">Salir</button>
        </div>
      }
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toolbar {
  private _router = inject(Router);
  public authService = inject(AuthService);

  logOut() {
    this.authService.logout();
    this._router.navigateByUrl(`/${RoutesApp.auth}/${RoutesApp.login}`);
  }
}
