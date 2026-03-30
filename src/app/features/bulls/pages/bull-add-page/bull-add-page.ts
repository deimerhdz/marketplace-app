import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesApp } from '@app/shared/const/routes.app';
import { BreedService } from '../../service/breed.service';
import { Breed } from '../../model/breed.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BullService } from '../../service/bull.service';
import { CreateBull } from '../../model/create-bull.model';

@Component({
  selector: 'app-bull-add-page',
  imports: [ReactiveFormsModule],
  templateUrl: './bull-add-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BullAddPage implements OnInit {
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private _breedService = inject(BreedService);
  private _bullService = inject(BullService);

  breeds = signal<Breed[] | null>(null);
  form = this._fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    numRegister: ['', [Validators.required]],
    breedId: ['', [Validators.required]],
    birthDate: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(10)]],
  });

  ngOnInit(): void {
    this.getBreeds();
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
    this._bullService.create(bull).subscribe({
      next: (response) => {
        this._router.navigateByUrl(
          `${RoutesApp.admin}/${RoutesApp.bulls}/${RoutesApp.detail}/${response.id}`,
        );
      },
    });
  }

  back() {
    this._router.navigateByUrl(`/${RoutesApp.admin}/${RoutesApp.bulls}`);
  }
}
