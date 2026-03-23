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
      <input #drawerToggle id="my-drawer-4" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content">
        <!-- Navbar -->
        <nav class="navbar w-full bg-base-300">
          <label for="my-drawer-4" aria-label="open sidebar" class="btn btn-square btn-ghost">
            <!-- Sidebar toggle icon -->
            <i class="fa-solid fa-bars"></i>
          </label>
          <div class="px-4">
            <p class="text-xl font-semibold">Tauru pro</p>
          </div>
        </nav>
        <!-- Page content here -->
        <div class="p-4"><ng-content /></div>
      </div>

      <div class="drawer-side is-drawer-close:overflow-visible">
        <label for="my-drawer-4" aria-label="open sidebar" class="drawer-overlay"></label>
        <div
          class="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64"
        >
          <!-- Sidebar content here -->
          <ul class="menu w-full grow">
            <!-- List item -->
            @for (item of menu(); track item.title) {
              <li [routerLink]="item.route" routerLinkActive="menu-active">
                <button
                  class="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                  [attr.data-tip]="item.title"
                  (click)="closeDrawer()"
                >
                  <i [class]="item.icon"></i>
                  <!-- Home icon -->
                  <span class="is-drawer-close:hidden">{{ item.title }}</span>
                </button>
              </li>
            }
          </ul>
        </div>
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
