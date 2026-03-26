import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesApp } from '@app/shared/const/routes.app';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { SignIn } from '../../model/signIn.model';
import { AuthService } from '../../services/auth.service';
import { ChangePassword } from '../../model/auth.response';

// Validador personalizado para contraseñas coincidentes
function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.get('newPassword')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return newPassword === confirmPassword ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginPage {
  private _router = inject(Router);
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  public showNewPasswordForm = signal(false);

  public form: FormGroup = this._formBuilder.nonNullable.group<SignIn>({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  // ─── Formulario de nueva contraseña ───
  newPasswordForm = this._formBuilder.nonNullable.group(
    {
      email: [{ value: '', disabled: true }, Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      session: [''], // campo oculto, se llena desde el response
    },
    { validators: passwordsMatchValidator },
  );

  public hasError = signal<boolean | null>(null);

  get emailControl() {
    return this.form.get('email')!;
  }

  get passwordControl() {
    return this.form.get('password')!;
  }

  get newPasswordControl() {
    return this.newPasswordForm.get('newPassword')!;
  }
  get confirmPasswordControl() {
    return this.newPasswordForm.get('confirmPassword')!;
  }

  login() {
    this._router.navigateByUrl(`${RoutesApp.admin}/${RoutesApp.dashboard}`);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this._authService.login(this.form.value).subscribe({
      next: (response) => {
        if (response.status === 'SUCCESS') {
          this._router.navigateByUrl(`${RoutesApp.admin}/${RoutesApp.dashboard}`);
          return;
        } else if (response.status === 'NEW_PASSWORD_REQUIRED') {
          this.newPasswordForm.patchValue({
            email: this.form.value.email,
            session: response.session, // asume que el response trae el session token
          });
          this.showNewPasswordForm.set(true);
          return;
        }

        this.hasError.set(true);
        setTimeout(() => {
          this.hasError.set(false);
        }, 2000);
      },
    });
  }

  submitNewPassword() {
    if (this.newPasswordForm.invalid) {
      this.newPasswordForm.markAllAsTouched();
      return;
    }

    const payload: ChangePassword = {
      email: this.newPasswordForm.getRawValue().email,
      newPassword: this.newPasswordForm.value.newPassword!,
      session: this.newPasswordForm.value.session!,
    };

    this._authService.confirmPassword(payload).subscribe({
      next: (response) => {
        if (response.status === 'SUCCESS') {
          this._router.navigateByUrl(`${RoutesApp.admin}/${RoutesApp.dashboard}`);
          return;
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
