import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../service/user.service';
import { Paginated } from '@app/core/model/paginated-response.model';
import { User } from '../../model/user.model';
import { PaginatedTable } from '@app/shared/ui/paginated-table/paginated-table';
import { TableAction, TableColumn } from '@app/shared/ui/table/table';
import { Router } from '@angular/router';
import { RoutesApp } from '@app/shared/const/routes.app';

@Component({
  selector: 'app-user-list-page',
  imports: [PaginatedTable],
  templateUrl: './user-list-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UserListPage implements OnInit {
  private _userService = inject(UserService);
  private _router = inject(Router);

  loading = signal(false);
  bulls = signal<Paginated<User> | null>(null);

  queryParams = signal({ page: 0, size: 10 });
  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this._userService.getUsers(this.queryParams()).subscribe({
      next: (response) => {
        this.bulls.set(response);
      },
      error: () => {
        console.log();
      },
    });
  }

  columns: TableColumn<User>[] = [
    { key: 'id', label: 'Id' },
    { key: 'name', label: 'Nombre' },
    { key: 'lastName', label: 'Apellidos' },
    { key: 'email', label: 'Nombre' },
    { key: 'role', label: 'Rol' },
    // { key: 'breed.name', label: 'Raza', valueFn: (row) => row.breed.name },
  ];

  actions: TableAction<User>[] = [
    {
      icon: 'fa-regular fa-eye',
      class: 'btn-info text-white',
      title: 'Ver detalles',
      onClick: (row) => console.log(row),
    },
  ];

  onPageChange(event: { page: number; size: number }) {
    this.queryParams.set(event);
    this.loadUsers();
  }

  createUser() {
    this._router.navigateByUrl(`${RoutesApp.admin}/${RoutesApp.users}/${RoutesApp.new}`);
  }
}
