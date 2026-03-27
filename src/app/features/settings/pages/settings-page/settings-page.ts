import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface ProfileDto {
  id: string;
  userId: string;
  nit: string;
  legalName: string;
  email: string;
  phone: string;
  image?: { key: string } | null;
}

@Component({
  selector: 'app-settings-page',
  imports: [ReactiveFormsModule],
  templateUrl: './settings-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SettingsPage implements OnInit {
  // private _settingsService = inject(SettingsService);

  profile = signal<ProfileDto | null>(null);
  saving = signal(false);
  photoPreview = signal<string | null>(null);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[+]?[\d\s\-().]{7,20}$/),
    ]),
  });

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    // this._settingsService.getProfile().subscribe({
    //   next: (data) => {
    //     this.profile.set(data);
    //     this.patchForm(data);
    //   },
    // });

    // Mock mientras conectas el servicio:
    const mock: ProfileDto = {
      id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      userId: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy',
      nit: '900.123.456-7',
      legalName: 'Ganadería La Esperanza S.A.S',
      email: 'contacto@laesperanza.com',
      phone: '+57 300 123 4567',
      image: null,
    };
    this.profile.set(mock);
    this.patchForm(mock);
  }

  patchForm(data: ProfileDto): void {
    this.form.patchValue({
      email: data.email,
      phone: data.phone,
    });
  }

  onPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.photoPreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.saving.set(true);
    const { email, phone } = this.form.value;
    console.log('Guardando:', { email, phone });

    // this._settingsService.updateProfile({ email, phone }).subscribe({
    //   next: () => this.saving.set(false),
    //   error: () => this.saving.set(false),
    // });

    // Mock:
    setTimeout(() => this.saving.set(false), 1000);
  }

  resetForm(): void {
    const current = this.profile();
    if (current) this.patchForm(current);
    this.form.markAsUntouched();
  }
}
