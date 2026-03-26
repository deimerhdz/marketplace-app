import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '@app/shared/ui/sidebar/sidebar';
import { Toolbar } from '@app/shared/ui/toolbar/toolbar';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, Sidebar, Toolbar],
  template: `
    <section class="flex">
      <app-sidebar> </app-sidebar>
      <div class="w-full">
        <app-toolbar />
        <div class="container mx-auto py-4 px-2">
          <router-outlet />
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AdminLayout {}
