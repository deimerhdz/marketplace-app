import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../ui/navbar/navbar';
import { Footer } from '../../ui/footer/footer';

@Component({
  selector: 'app-home-layout',
  imports: [RouterOutlet, Navbar, Footer],
  template: `
    <app-navbar />
    <main class=" bg-gray-50 min-h-screen flex flex-col">
      <section class="flex-1 w-full max-w-7xl mx-auto px-2">
        <router-outlet />
      </section>
      <app-footer />
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeLayout {}
