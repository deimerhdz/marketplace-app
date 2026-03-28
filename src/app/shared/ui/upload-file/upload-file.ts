import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-upload-file',
  imports: [],
  template: `
    <div class="card bg-base-100 shadow-md border border-base-200">
      <div class="card-body">
        <h3 class="card-title text-lg mb-4">Evaluación genética</h3>

        @if (!fieName()) {
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"
              />
            </svg>
            <span class="text-sm font-medium">Haz clic para subir el documento</span>
            <span class="text-xs">PDF, DOC, DOCX, XLS — máx. 20MB</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              class="hidden"
              (change)="onFileSelected($event)"
            />
          </label>
        } @else {
          <div
            class="flex items-center justify-between p-4 border border-base-200 rounded-xl bg-base-200/50"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 text-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <p class="font-semibold text-sm">{{ fieName() }}</p>
                <p class="text-xs text-base-content/50">Listo para guardar</p>
              </div>
            </div>
            <div class="flex gap-2">
              <button class="btn btn-error btn-sm text-white" (click)="removeFile()">
                Eliminar
              </button>
              <button class="btn btn-success btn-sm text-white">Guardar</button>
            </div>
          </div>
        }

        <!-- Documentos ya subidos (mock) -->
        <div class="mt-4">
          <p class="text-xs text-base-content/50 uppercase tracking-wide mb-2">
            Documentos guardados
          </p>
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between p-3 border border-base-200 rounded-lg">
              <div class="flex items-center gap-2">
                <span class="badge badge-success badge-sm text-white">PDF</span>
                <span class="text-sm">evaluacion_genetica_2023.pdf</span>
              </div>
              <div class="flex gap-2">
                <button class="btn btn-ghost btn-xs">Ver</button>
                <button class="btn btn-ghost btn-xs text-error">✕</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadFile {
  file = signal<File | null>(null);
  fieName = signal<string | null>(null);

  document = output<File>();

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.file.set(file);
    this.fieName.set(file.name);
    this.document.emit(file);
  }

  removeFile() {
    this.file.set(null);
    this.fieName.set(null);
  }
}
