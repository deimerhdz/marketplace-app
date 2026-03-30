import { Component, input, model, output, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-quantity-selector',
  template: `
    <div class="flex items-center gap-3">
      <button class="btn btn-sm " (click)="decrement()" [disabled]="quantity() <= min()">−</button>
      <span class="text-lg font-semibold w-8 text-center">{{ quantity() }}</span>
      <button class="btn btn-sm " (click)="increment()">+</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuantitySelector implements OnInit {
  min = input<number>(1);
  quantity = model<number>(1); // two-way binding
  quantityChange = output<number>();

  ngOnInit() {
    // Inicializar con el mínimo cuando cambia la pajilla
    this.quantity.set(this.min());
  }

  increment() {
    this.quantity.update((q) => q + 1);
    this.quantityChange.emit(this.quantity());
  }

  decrement() {
    if (this.quantity() <= this.min()) return;
    this.quantity.update((q) => q - 1);
    this.quantityChange.emit(this.quantity());
  }
}
