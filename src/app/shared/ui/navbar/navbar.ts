import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
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
          <a class="btn" [routerLink]="login()">Iniciar Sesión</a>
        </div>
      </div>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  public readonly login = computed(() => `${RoutesApp.auth}/${RoutesApp.login}`);
}
