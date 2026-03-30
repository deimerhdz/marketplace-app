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
  selector: 'app-upload-video',
  imports: [],
  template: `
    <div class="card bg-base-100 shadow-md border border-base-200">
      <div class="card-body">
        <h3 class="card-title text-lg mb-4">Video del toro</h3>

        @if (!videoPreview()) {
          <label
            class="flex flex-col items-center justify-center h-48 border-2 border-dashed border-base-300 rounded-xl cursor-pointer hover:border-success transition-colors text-base-content/40 gap-2"
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
                d="M15 10l4.553-2.277A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
              />
            </svg>
            <span class="text-sm font-medium">Haz clic para subir un video</span>
            <span class="text-xs">MP4, MOV, AVI — máx. 200MB</span>
            <input type="file" accept="video/*" class="hidden" (change)="onVideoSelected($event)" />
          </label>
        } @else {
          <div class="flex flex-col gap-3">
            <video
              [src]="videoPreview()!"
              controls
              class="w-full rounded-xl border border-base-200 max-h-64 md:max-w-64"
            ></video>
            <div class="flex justify-between items-center">
              <span class="text-sm text-base-content/60">{{ videoFile()?.name }}</span>
              <div class="flex gap-2">
                <button class="btn btn-error btn-sm text-white" (click)="removeVideo()">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadVideo {
  private _alertMessageService = inject(AlertMessageService);
  video = output<File>();
  videoPreview = signal<string | null>(null);
  previewVideo = input<MediaFile | null>();
  videoFile = signal<File | null>(null);
  handleDelete = output<string>();
  constructor() {
    effect(() => {
      const preview = this.previewVideo();
      this.videoPreview.set(preview ? `${environment.cdnUrl}/${preview.key}` : '');
    });
  }

  onVideoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.video.emit(file);
    this.videoPreview.set(URL.createObjectURL(file));
  }

  removeVideo() {
    this._alertMessageService
      .confirm('¿Estás seguro?', 'Esta acción eliminará la imagen permanentemente.')
      .then((result) => {
        if (result.isConfirmed) {
          const fileKey = this.previewVideo()?.key;
          this.handleDelete.emit(fileKey ?? '');
          this.videoPreview.set(null);
          this.videoFile.set(null);
        }
      });
  }
}
