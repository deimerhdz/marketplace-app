import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RoutesApp } from '@app/shared/const/routes.app';
import { UserService } from '../../service/user.service';
import { CreateUser } from '../../model/create-user.model';
import { AlertMessageService } from '@app/shared/services/alert-message.service';

@Component({
  selector: 'app-user-add-page',
  imports: [ReactiveFormsModule],
  templateUrl: './user-add-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UserAddPage {
  private _fb = inject(FormBuilder);
  private _userService = inject(UserService);
  private _router = inject(Router);
  private _alertMessageService = inject(AlertMessageService);

  form: FormGroup = this._fb.group({
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required],
    supplier: this._fb.group({
      nit: [''],
      phone: [''],
      countryCode: ['+57'],
      legalName: [''],
    }),
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const bull = this.form.value as CreateUser;
    this._userService.create(bull).subscribe({
      next: () => {
        this._alertMessageService.success('Usuario registrado con éxito.');
        this._router.navigateByUrl(`${RoutesApp.admin}/${RoutesApp.users}`);
      },
      error: (error) => {
        this._alertMessageService.warning(error);
      },
    });
  }

  back() {
    this._router.navigateByUrl(`/${RoutesApp.admin}/${RoutesApp.users}`);
  }
}
