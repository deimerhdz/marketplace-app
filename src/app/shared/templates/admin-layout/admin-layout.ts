import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '@app/shared/ui/sidebar/sidebar';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, Sidebar],
  template: `
    <app-sidebar>
      <router-outlet />
    </app-sidebar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AdminLayout {}
