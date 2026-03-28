import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EmailInput } from '@app/shared/ui/email-input/email-input';
import { PasswordInput } from '@app/shared/ui/password-input/password-input';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutesApp } from '@app/shared/const/routes.app';
import { AuthResponse } from '../../model/auth.response';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, PasswordInput, EmailInput],
  templateUrl: './register-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterPage {
  private _returnUrl = '';
  private _router = inject(Router);
  private _fb = inject(FormBuilder);
  private _authService = inject(AuthService);
  public hasError = signal<boolean | null>(null);
  private _route: ActivatedRoute = inject(ActivatedRoute);
  form: FormGroup = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    fullName: ['', [Validators.required, this.fullNameValidator]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    this._returnUrl = this._route.snapshot.queryParams['returnUrl'] || '';
  }
  // Valida que haya al menos nombre y apellido
  fullNameValidator(control: FormControl) {
    if (!control.value) return null;

    const parts = control.value.trim().split(' ');
    return parts.length >= 2 ? null : { fullNameInvalid: true };
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, fullName, password } = this.form.value;

    // Separar nombre y apellido
    const parts = fullName.trim().split(' ');
    const name = parts[0];
    const lastName = parts.slice(1).join(' ');

    const payload = {
      email,
      name,
      lastName,
      password,
    };
    this._authService.register(payload).subscribe({
      next: (response) => this.handleRedirect(response),
      error: () => {
        this.setError();
      },
    });
    // Aquí haces el POST al backend
  }
  private handleRedirect(response: AuthResponse) {
    if (this._returnUrl.includes(RoutesApp.bull)) {
      this._router.navigateByUrl(`/${RoutesApp.checkout}`);
    } else {
      if (response.status === 'SUCCESS') {
        this._router.navigateByUrl(`/`);
        return;
      }
      this.setError();
    }
  }

  goToLogin() {
    this._router.navigate([`/${RoutesApp.auth}/${RoutesApp.login}`], {
      queryParams: this._returnUrl ? { returnUrl: this._returnUrl } : {},
    });
  }
  setError() {
    this.hasError.set(true);
    setTimeout(() => {
      this.hasError.set(false);
    }, 2000);
  }
}
