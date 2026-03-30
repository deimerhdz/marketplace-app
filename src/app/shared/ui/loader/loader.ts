import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-loader',
  imports: [],
  styleUrl: './loader.css',
  template: `
    @if (visible()) {
      <div class="loader-overlay" role="status" aria-live="polite" [attr.aria-label]="message()">
        <div class="loader-content">
          <!-- Spinner DaisyUI -->
          <span class="loading loading-spinner loading-lg text-success"></span>

          <!-- Mensaje personalizado -->
          <p class="loader-message">{{ message() }}</p>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Loader {
  /** Controla si el loader es visible */
  visible = input<boolean>(true);

  /** Mensaje personalizado que se muestra bajo el spinner */
  message = input<string>('Cargando...');
}
