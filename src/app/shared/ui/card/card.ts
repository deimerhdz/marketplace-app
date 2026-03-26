import { ImagePipe } from '@app/shared/pipe/image.pipe';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { Bull } from '@app/features/bulls/model/bull.model';
import { Straw } from '@app/features/bulls/model/straw.model';
import { CurrencyPipe } from '@angular/common';
import { StrawSelector } from '../straw-selector/straw-selector';

@Component({
  selector: 'app-card',
  imports: [ImagePipe, StrawSelector, CurrencyPipe],
  template: `
    <div class="card bg-base-100 shadow-sm">
      <figure class="aspect-video w-full overflow-hidden bg-base-200">
        <img
          [src]="item()?.image?.key | imagePipe"
          [alt]="item()?.name"
          class="w-full h-full object-cover"
        />
      </figure>
      <div class="card-body">
        <h2 class="card-title">{{ item()?.name }}</h2>
        <p>{{ item()?.breed?.name }}</p>
        <app-straw-selector
          [straws]="item()?.straws!"
          size="btn-xs"
          (strawSelected)="selectStraw($event)"
        />
        <div class="card-actions justify-end">
          <p class="font-bold text-2xl">
            {{ selectedStraw()?.price || 0 | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}
          </p>
          <button class="btn btn-success text-white" (click)="detail()">Ver detalles</button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  item = input<Bull>();
  selectedStraw = signal<Straw | null>(null);
  clickChange = output<{ slug?: string; sku?: string }>();

  selectStraw(straw: Straw) {
    this.selectedStraw.set(straw);
  }

  detail() {
    this.clickChange.emit({ slug: this.item()?.slug, sku: this.selectedStraw()?.sku });
  }
}
