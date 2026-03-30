import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { MediaFile } from '@app/core/model/media-file.model';
import { AlertMessageService } from '@app/shared/services/alert-message.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-upload-gallery',
  imports: [],
  template: `
    <div class="card bg-base-100 shadow-md border border-base-200">
      <div class="card-body">
        <div class="flex items-center justify-between mb-4">
          <h3 class="card-title text-lg mr-4">Galería de imágenes</h3>
          @if (errorMessage()) {
            <p class="text-xs text-error mt-1">{{ errorMessage() }}</p>
          }
          <label
            class="btn btn-success btn-sm text-white cursor-pointer"
            [class.btn-disabled]="galleryPreviews().length >= 3"
          >
            + Subir imágenes
            <input
              type="file"
              accept="image/*"
              multiple
              class="hidden"
              (change)="onGallerySelected($event)"
            />
          </label>
        </div>

        @if (galleryPreviews().length === 0) {
          <div
            class="flex flex-col items-center justify-center h-40 border-2 border-dashed border-base-300 rounded-xl text-base-content/40 gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-10 h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M3 16l4-4a3 3 0 014 0l4 4m0 0l1-1a3 3 0 014 0l2 2M3 20h18M21 8a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span class="text-sm">No hay imágenes. Sube algunas fotos del toro.</span>
          </div>
        } @else {
          <div class="grid grid-cols-3 gap-3">
            @for (img of galleryPreviews(); track $index) {
              <div
                class="relative group rounded-xl overflow-hidden border border-base-200 aspect-square"
              >
                <img [src]="img" class="w-full h-full object-cover" alt="Imagen del toro" />
                <button
                  class="absolute top-1 right-1 btn btn-xs btn-error text-white  transition-opacity"
                  (click)="removeGalleryImage($index, img)"
                >
                  ✕
                </button>
              </div>
            }
          </div>
        }

        @if (galleryPreviews().length > 0) {
          <ng-content></ng-content>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadGallery {
  private readonly MAX_IMAGES = 3;
  private _alertMessageService = inject(AlertMessageService);
  galleryPreviews = signal<string[]>([]);
  previewImages = input<MediaFile[] | null>();
  errorMessage = signal<string | null>(null);
  handleDelete = output<string>();
  images = output<File[]>();

  constructor() {
    effect(() => {
      const previews = this.previewImages();
      this.galleryPreviews.set(
        previews ? previews.map((file) => `${environment.cdnUrl}/${file.key}`) : [],
      );
    });
  }

  onGallerySelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);

    const available = this.MAX_IMAGES - this.galleryPreviews().length;

    if (available <= 0) {
      this.errorMessage.set(`Máximo ${this.MAX_IMAGES} imágenes permitidas.`);
      input.value = '';
      return;
    }

    const accepted = files.slice(0, available);

    if (files.length > available) {
      this.errorMessage.set(
        `Solo se agregaron ${accepted.length} imagen(es). Límite de ${this.MAX_IMAGES}.`,
      );
    } else {
      this.errorMessage.set(null);
    }

    this.images.emit(accepted);
    accepted.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        this.galleryPreviews.update((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    input.value = '';
  }

  removeGalleryImage(index: number, key: string) {
    this._alertMessageService
      .confirm('¿Estás seguro?', 'Esta acción eliminará la imagen permanentemente.')
      .then((result) => {
        if (result.isConfirmed) {
          this.galleryPreviews.update((prev) => prev.filter((_, i) => i !== index));

          if (key.startsWith(environment.cdnUrl)) {
            //update if domain changes
            const fileKey = key.split('.net/')[1];
            this.handleDelete.emit(fileKey);
          }
        }
      });
  }
}
