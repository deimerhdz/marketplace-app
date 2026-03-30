import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Bull } from '../../model/bull.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-bull-info',
  imports: [DatePipe],
  template: `
    <div class="card bg-base-100 shadow-md border border-base-200">
      <div class="card-body">
        <h3 class="card-title text-lg mb-2">Información general</h3>
        <div class="grid grid-cols-2 gap-x-8 gap-y-3">
          <div>
            <p class="text-xs text-base-content/50 uppercase tracking-wide mb-1">Nombre</p>
            <p class="font-semibold">{{ bull().name }}</p>
          </div>
          <div>
            <p class="text-xs text-base-content/50 uppercase tracking-wide mb-1">
              Número de registro
            </p>
            <p class="font-semibold">{{ bull().numRegister }}</p>
          </div>
          <div>
            <p class="text-xs text-base-content/50 uppercase tracking-wide mb-1">Raza</p>
            <p class="font-semibold">{{ bull().breed.name }}</p>
          </div>
          <div>
            <p class="text-xs text-base-content/50 uppercase tracking-wide mb-1">
              Fecha de nacimiento
            </p>
            <p class="font-semibold">{{ bull().birthDate | date: 'dd/MM/yyyy' }}</p>
          </div>
          <div class="col-span-2">
            <p class="text-xs text-base-content/50 uppercase tracking-wide mb-1">Descripción</p>
            <p class="font-semibold leading-relaxed">{{ bull().description }}</p>
          </div>
        </div>
        <div class="card-actions justify-end mt-4">
          <button class="btn btn-outline btn-sm">Editar</button>
          <button class="btn btn-error btn-sm text-white">Archivar</button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BullInfo {
  bull = input.required<Bull>();
}
