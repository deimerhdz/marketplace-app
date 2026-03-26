import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { Breed } from '@app/features/bulls/model/breed.model';

@Component({
  selector: 'app-breed-chips',
  imports: [],
  templateUrl: './breed-chips.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreedChips {
  breeds = input.required<Breed[]>();

  breedSelected = output<string>();

  selected = signal<string | null>(null);

  select(breed: Breed) {
    if (this.selected() === breed.id) {
      // Toggle off → emite vacío (todos)
      this.selected.set(null);
      this.breedSelected.emit('');
    } else {
      this.selected.set(breed.id);
      this.breedSelected.emit(breed.name);
    }
  }
}
