import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './features/auth/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('marketplace-app');
  private _authService = inject(AuthService);

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    this._authService.me().subscribe();
  }
}
