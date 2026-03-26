import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { Breed } from '@app/features/bulls/model/breed.model';

@Component({
  selector: 'app-breed-filter',
  imports: [],
  templateUrl: './breed-filter.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreedFilter {
  breeds = input.required<Breed[] | null>();
  defaultBreed = input<string | null>(null);
  breedSelected = output<string>();

  selected = signal<string | null>(null);
  isOpen = signal(false);
  constructor() {
    // Sincroniza cuando llega el valor por defecto
    effect(() => {
      const def = this.defaultBreed();
      if (def) {
        const match = this.breeds()?.find((b) => b.id === def || b.name === def);
        if (match) {
          this.selected.set(match.id);
          this.breedSelected.emit(match.name);
        }
      }
    });
  }
  select(breed: Breed) {
    this.selected.set(breed.id);
    this.breedSelected.emit(breed.name);
  }

  clear() {
    this.selected.set(null);
    this.breedSelected.emit('');
  }

  togglePanel() {
    this.isOpen.update((v) => !v);
  }
}
