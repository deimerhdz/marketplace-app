import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { Bull } from '@app/features/bulls/model/bull.model';
import { Straw } from '@app/features/bulls/model/straw.model';

@Component({
  selector: 'app-card',
  imports: [],
  template: `
    <div class="card bg-base-100 shadow-sm">
      <figure>
        <img
          src="https://i.pinimg.com/736x/ab/98/0b/ab980b250899edb835262e537b113edc.jpg"
          alt="Shoes"
        />
      </figure>
      <div class="card-body">
        <h2 class="card-title">{{ item()?.name }}</h2>
        <p>{{ item()?.breed?.name }}</p>
        <div class="flex gap-2">
          @for (straw of item()?.straws; track straw) {
            <button
              class="btn btn-xs"
              [class.btn-outline]="selectedStraw()?.id === straw.id"
              [class.btn-success]="selectedStraw()?.id === straw.id"
              [class.hover:bg-transparent]="selectedStraw()?.id === straw.id"
              (click)="selectStraw(straw)"
            >
              {{ straw.type }}
            </button>
          }
          <!-- <button class="btn btn-xs">Convencional</button> -->
        </div>
        <div class="card-actions justify-end">
          <p class="font-bold text-2xl">$ {{ selectedStraw()?.price || 0 }}</p>
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
  constructor() {
    //  cuando cambia el item, selecciona el primero automáticamente
    effect(() => {
      const bull = this.item();

      if (bull?.straws?.length) {
        this.selectedStraw.set(bull.straws[0]);
      }
    });
  }

  selectStraw(straw: Straw) {
    this.selectedStraw.set(straw);
  }

  detail() {
    this.clickChange.emit({ slug: this.item()?.slug, sku: this.selectedStraw()?.sku });
  }
}
