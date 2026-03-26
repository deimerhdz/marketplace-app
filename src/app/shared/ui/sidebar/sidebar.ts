import { ChangeDetectionStrategy, Component, computed, ElementRef, ViewChild } from '@angular/core';
import { RoutesApp } from '@app/shared/const/routes.app';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuSidebar {
  title: string;
  route: string;
  icon: string;
}
@Component({
  selector: 'app-sidebar',
  template: `
    <div class="drawer lg:drawer-open">
      <input #drawerToggle id="my-drawer-3" type="checkbox" class="drawer-toggle" />

      <div class="drawer-side">
        <label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"></label>
        <ul class="menu bg-base-200 min-h-full w-60 md:w-80 p-4">
          <!-- Sidebar content here -->
          @for (item of menu(); track item.title) {
            <li [routerLink]="item.route" routerLinkActive="menu-active">
              <button class="" [attr.data-tip]="item.title" (click)="closeDrawer()">
                <span>{{ item.title }}</span>
              </button>
            </li>
          }
        </ul>
      </div>
    </div>
  `,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  menu = computed<MenuSidebar[]>(() => {
    return [
      {
        title: 'Inicio',
        route: `/${RoutesApp.admin}/${RoutesApp.dashboard}`,
        icon: 'fa-solid fa-house',
      },
      {
        title: 'Ordenes',
        route: `/${RoutesApp.admin}/${RoutesApp.orders}`,
        icon: 'fa-solid fa-clipboard-list',
      },
      {
        title: 'Toros',
        route: `/${RoutesApp.admin}/${RoutesApp.bulls}`,
        icon: 'fa-solid fa-cow',
      },
      {
        title: 'Configuración',
        route: `/${RoutesApp.admin}/${RoutesApp.settings}`,
        icon: 'fa-solid fa-gear',
      },
    ];
  });

  @ViewChild('drawerToggle') drawerToggle!: ElementRef<HTMLInputElement>;

  closeDrawer() {
    if (window.innerWidth < 1024) {
      this.drawerToggle.nativeElement.checked = false;
    }
  }
}
