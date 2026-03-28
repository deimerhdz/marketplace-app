import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-upload-gallery',
  imports: [],
  template: `
    <div class="card bg-base-100 shadow-md border border-base-200">
      <div class="card-body">
        <div class="flex items-center justify-between mb-4">
          <h3 class="card-title text-lg">Galería de imágenes</h3>
          <label class="btn btn-success btn-sm text-white cursor-pointer">
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
                  class="absolute top-1 right-1 btn btn-xs btn-error text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  (click)="removeGalleryImage($index)"
                >
                  ✕
                </button>
              </div>
            }
          </div>
        }

        @if (galleryPreviews().length > 0) {
          <div class="card-actions justify-end mt-4">
            <button class="btn btn-success btn-sm text-white">Guardar imágenes</button>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadGallery {
  galleryPreviews = signal<string[]>([]);

  images = output<File[]>();

  onGallerySelected(event: Event) {
    const files = Array.from((event.target as HTMLInputElement).files ?? []);
    this.images.emit(files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        this.galleryPreviews.update((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }

  removeGalleryImage(index: number) {
    this.galleryPreviews.update((prev) => prev.filter((_, i) => i !== index));
  }
}
