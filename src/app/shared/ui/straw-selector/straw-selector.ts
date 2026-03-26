import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { Straw } from '@app/features/bulls/model/straw.model';

@Component({
  selector: 'app-straw-selector',
  imports: [],
  template: `
    <div class="flex flex-wrap gap-2">
      @for (straw of straws(); track straw.sku) {
        <button
          [class]="strawClass(straw)"
          (click)="select(straw)"
          (keydown.enter)="select(straw)"
          (keydown.space)="select(straw)"
        >
          {{ straw.type }}
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StrawSelector {
  straws = input.required<Straw[]>();
  size = input<'btn-xs' | 'btn-sm' | 'btn-md' | 'btn-lg'>('btn-xs'); // 👈 por defecto btn-xs

  strawSelected = output<Straw>();

  selected = signal<Straw | null>(null);

  constructor() {
    // Selecciona el primero automáticamente cuando llegan las pajillas
    effect(() => {
      const list = this.straws();
      if (list?.length) {
        this.selected.set(list[0]);
        this.strawSelected.emit(list[0]);
      }
    });
  }

  select(straw: Straw) {
    this.selected.set(straw);
    this.strawSelected.emit(straw);
  }

  strawClass(straw: Straw): string {
    const size = this.size();
    return this.selected()?.sku === straw.sku
      ? `btn ${size} btn-outline btn-success`
      : `btn ${size} btn-outline`;
  }
}
