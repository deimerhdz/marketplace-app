import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/features/auth/services/auth.service';
import { RoutesApp } from '@app/shared/const/routes.app';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  template: `
    <nav class="max-w-7xl  mx-auto">
      <div class="navbar bg-base-100">
        <div class="navbar-start">
          <a class="text-xl font-bold" routerLink="/">Tauru pro</a>
        </div>

        <div class="navbar-end">
          @if (authService.authStatus() === 'authenticated') {
            <div class="flex items-center gap-2">
              <div class="tooltip tooltip-bottom" [attr.data-tip]="username()">
                <button class="btn btn-ghost">
                  <i class="fa-solid fa-user block md:hidden"></i>
                </button>
              </div>

              <p class="hidden md:block ">{{ username() }}</p>
              <button class="btn btn-error" (click)="logOut()">Salir</button>
            </div>
          } @else {
            <a class="btn" [routerLink]="login()">Iniciar Sesión</a>
          }
        </div>
      </div>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  public readonly login = computed(() => `${RoutesApp.auth}/${RoutesApp.login}`);

  private _router = inject(Router);
  public authService = inject(AuthService);
  public username = computed(
    () => `${this.authService.user()?.name} ${this.authService.user()?.lastName} `,
  );
  logOut() {
    this.authService.logout();
    this._router.navigateByUrl(`/`);
  }
}
