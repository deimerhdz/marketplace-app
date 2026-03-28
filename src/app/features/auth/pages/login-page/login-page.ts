import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { AuthResponse, ChangePassword } from '../../model/auth.response';
import { PasswordInput } from '@app/shared/ui/password-input/password-input';
import { EmailInput } from '@app/shared/ui/email-input/email-input';

// Validador personalizado para contraseñas coincidentes
function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.get('newPassword')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return newPassword === confirmPassword ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, PasswordInput, EmailInput],
  templateUrl: './login-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginPage {
  private _router = inject(Router);
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _returnUrl = '';
  public showNewPasswordForm = signal(false);

  public form: FormGroup = this._formBuilder.nonNullable.group<SignIn>({
    email: new FormControl('', [
      Validators.email,
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    ]),
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

  constructor() {
    this._returnUrl = this._route.snapshot.queryParams['returnUrl'] || '';
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
      next: (response) => this.handleRedirect(response),
      error: () => {
        this.setError();
      },
    });
  }
  goToRegister() {
    this._router.navigate([`/${RoutesApp.auth}/${RoutesApp.register}`], {
      queryParams: this._returnUrl ? { returnUrl: this._returnUrl } : {},
    });
  }

  private handleRedirect(response: AuthResponse) {
    if (this._returnUrl.includes(RoutesApp.bull)) {
      this._router.navigateByUrl(`/${RoutesApp.checkout}`);
    } else {
      if (response.status === 'SUCCESS') {
        if (this._authService.user()?.role === 'CUSTOMER') {
          this._router.navigateByUrl(`/`);
        } else {
          this._router.navigateByUrl(`/${RoutesApp.admin}/${RoutesApp.dashboard}`);
        }
        return;
      } else if (response.status === 'NEW_PASSWORD_REQUIRED') {
        this.newPasswordForm.patchValue({
          email: this.form.value.email,
          session: response.session, // asume que el response trae el session token
        });
        this.showNewPasswordForm.set(true);
        return;
      }
      this.setError();
    }
  }

  setError() {
    this.hasError.set(true);
    setTimeout(() => {
      this.hasError.set(false);
    }, 2000);
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
