import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { BullService } from '../../service/bull.service';
import { Paginated } from '@app/core/model/paginated-response.model';
import { Bull } from '../../model/bull.model';
import { Router } from '@angular/router';
import { RoutesApp } from '@app/shared/const/routes.app';

@Component({
  selector: 'app-bull-list-page',
  imports: [],
  templateUrl: './bull-list-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BullListPage implements OnInit {
  private _router = inject(Router);
  private _bullService = inject(BullService);
  loading = signal(false);
  bulls = signal<Paginated<Bull> | null>(null);

  ngOnInit(): void {
    this.getBulls();
  }

  getBulls() {
    this.loading.set(true);
    this._bullService.getBulls(0, 8).subscribe({
      next: (response) => {
        this.bulls.set(response);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  detail(id: string) {
    this._router.navigateByUrl(`/${RoutesApp.admin}/${RoutesApp.bulls}/${RoutesApp.detail}/${id}`);
  }

  newBull() {
    this._router.navigateByUrl(`/${RoutesApp.admin}/${RoutesApp.bulls}/${RoutesApp.new}`);
  }
}
