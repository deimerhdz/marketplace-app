import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { RoutesApp } from '@app/shared/const/routes.app';
import { BreedService } from '../../service/breed.service';
import { Breed } from '../../model/breed.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BullService } from '../../service/bull.service';
import { CreateBull } from '../../model/create-bull.model';
import { Location } from '@angular/common';
@Component({
  selector: 'app-bull-add-page',
  imports: [ReactiveFormsModule],
  templateUrl: './bull-add-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BullAddPage implements OnInit {
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private _location = inject(Location);
  private _breedService = inject(BreedService);
  private _bullService = inject(BullService);
  error = signal<string | null>(null);
  id = input.required<string>();
  breeds = signal<Breed[] | null>(null);
  form = this._fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    numRegister: ['', [Validators.required]],
    breedId: ['', [Validators.required]],
    birthDate: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(10)]],
  });

  titlePage = computed(() => (this.id() ? 'Editar toro' : 'Agregar nuevo toro'));
  submitButtonText = computed(() => (this.id() ? 'Guardar cambios' : 'Agregar toro'));
  ngOnInit(): void {
    this.getBreeds();
    this.loadBull();
  }
  isInvalid(field: string) {
    const control = this.form.get(field);
    return control?.invalid && control?.touched;
  }

  getError(field: string): string {
    const control = this.form.get(field);
    if (control?.hasError('required')) return 'Este campo es obligatorio.';
    if (control?.hasError('minlength')) {
      const min = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${min} caracteres.`;
    }
    return '';
  }

  getBreeds() {
    this._breedService.getBreeds().subscribe({
      next: (response) => {
        this.breeds.set(response);
      },
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const bull = this.form.value as CreateBull;
    const request = this.id()
      ? this._bullService.update(this.id(), bull)
      : this._bullService.create(bull);

    request.subscribe({
      next: (response) => {
        this._router.navigateByUrl(
          `${RoutesApp.admin}/${RoutesApp.bulls}/${RoutesApp.detail}/${response.id}`,
        );
      },
    });
  }

  back() {
    this._location.back();
  }

  loadBull() {
    if (!this.id()) return;
    this._bullService.getById(this.id()).subscribe({
      next: (data) => {
        this.form.patchValue({
          name: data.name,
          numRegister: data.numRegister,
          breedId: data.breed.id,
          birthDate: data.birthDate,
          description: data.description,
        });
      },
      error: () => {
        this.error.set('No se pudo cargar el toro.');
      },
    });
  }
}
