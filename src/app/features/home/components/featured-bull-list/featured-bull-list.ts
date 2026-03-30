import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  input,
} from '@angular/core';
import { Card } from '../../../../shared/ui/card/card';
import { Bull } from '@app/features/bulls/model/bull.model';
import { Router } from '@angular/router';
import { RoutesApp } from '@app/shared/const/routes.app';
import { Carrousel } from '../carrousel/carrousel';

@Component({
  selector: 'app-featured-bull-list',
  imports: [Card, Carrousel],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <section class="flex flex-col gap-8 py-12">
      <div class="flex flex-col gap-4 md:flex-row md:items-end justify-center">
        <ng-content />
      </div>

      <!-- <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"> -->
      @if (bulls()?.length === 0) {
        <div
          class="col-span-full flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-base-300 bg-base-100 py-20 text-center"
        >
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-base-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-base-content/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
              />
            </svg>
          </div>
          <div class="flex flex-col gap-1">
            <h3 class="text-lg font-semibold text-base-content">Próximamente</h3>
            <p class="text-sm text-base-content/50 max-w-xs">
              Estamos preparando nuevos ejemplares. Vuelve pronto para descubrir nuestro catálogo.
            </p>
          </div>
          <div class="badge badge-outline badge-lg gap-2 mt-2">
            <span class="inline-block h-2 w-2 rounded-full bg-warning animate-pulse"></span>
            En preparación
          </div>
        </div>
      } @else {
        <app-carrousel
          className="h-100"
          [loop]="true"
          [delay]="4000"
          [slides]="4"
          [pagination]="true"
          [navigation]="false"
        >
          @for (bull of bulls(); track bull?.slug ?? $index) {
            <swiper-slide>
              <app-card [item]="bull" (clickChange)="navigateToDetail($event)" />
            </swiper-slide>
          }
        </app-carrousel>
      }
      <!-- </div> -->
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturedBullList {
  bulls = input<Bull[] | null>(null);
  private _router = inject(Router);

  navigateToDetail(event: { slug?: string; sku?: string }) {
    this._router.navigateByUrl(
      `/${RoutesApp.catalog}/${RoutesApp.bull}/${event.slug}/${event.sku}`,
    );
  }
}
