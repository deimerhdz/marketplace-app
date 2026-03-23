import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Card } from '../../../../shared/ui/card/card';
import { Bull } from '@app/features/bulls/model/bull.model';

@Component({
  selector: 'app-featured-bull-list',
  imports: [Card],
  template: `
    <section class="flex flex-col gap-8 py-12">
      <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <ng-content />
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        @for (bull of bulls(); track bull.id) {
          <app-card [item]="bull" (clickChange)="navigateToDetail($event)" />
        }
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturedBullList {
  bulls = input<Bull[]>();

  navigateToDetail(event: { slug?: string; sku?: string }) {
    console.log(event);
  }
}
