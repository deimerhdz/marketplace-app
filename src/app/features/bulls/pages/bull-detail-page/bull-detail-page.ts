import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
  OnInit,
  computed,
} from '@angular/core';
import { Bull } from '../../model/bull.model';
import { Router } from '@angular/router';
import { RoutesApp } from '@app/shared/const/routes.app';
import { BullService, ResourceType } from '../../service/bull.service';
import { BullInfo } from '../../components/bull-info/bull-info';
import { CreateStraw } from '../../model/createStraw.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Straw } from '../../model/straw.model';
import { ImagePipe } from '@app/shared/pipe/image.pipe';
import { AlertMessageService } from '@app/shared/services/alert-message.service';
import { UploadGallery } from '@app/shared/ui/upload-gallery/upload-gallery';
import { UploadVideo } from '@app/shared/ui/upload-video/upload-video';
import { UploadFile } from '@app/shared/ui/upload-file/upload-file';
import { Table, TableAction, TableColumn, TableFooter } from '@app/shared/ui/table/table';
import { finalize, from, map, Observable, switchMap } from 'rxjs';
import { MediaFile } from '@app/core/model/media-file.model';
import { Loader } from '@app/shared/ui/loader/loader';
@Component({
  selector: 'app-bull-detail-page',
  imports: [
    BullInfo,
    ImagePipe,
    UploadVideo,
    UploadFile,
    UploadGallery,
    Loader,
    Table,
    ReactiveFormsModule,
  ],
  templateUrl: './bull-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BullDetailPage implements OnInit {
  private _router = inject(Router);
  private _bullService = inject(BullService);
  private _alertMessageService = inject(AlertMessageService);
  private _gallery = signal<MediaFile[]>([]);

  gallery = computed(() => {
    return this.bull()?.gallery ?? [];
  });
  video = computed(() => {
    return this.bull()?.video ?? null;
  });
  document = computed(() => {
    return this.bull()?.geneticEvaluation ?? null;
  });

  id = input.required<string>();
  bull = signal<Bull | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  photoPreview = signal<string | null>(null);

  //formulario
  private _fb = inject(FormBuilder);

  // Inventario (mock)
  straws = signal<Straw[]>([]);

  // ── Modal de agregar pajilla ──
  strawModal = signal<{ mode: 'create' | 'edit'; straw?: Straw } | null>(null);
  strawForm!: FormGroup;
  savingStraw = signal(false);

  isEditing = computed(() => {
    return this.strawModal()?.mode === 'edit';
  });
  modalTitle = computed(() => {
    return this.isEditing() ? 'Editar pajilla' : 'Nueva pajilla';
  });
  saveLabel = computed(() => {
    return this.isEditing() ? 'Guardar cambios' : 'Guardar pajilla';
  });

  //table config
  columns: TableColumn<Straw>[] = [
    { key: 'sku', label: 'Código', type: 'mono' },
    { key: 'type', label: 'Descripción', type: 'text' },
    { key: 'price', label: 'Precio', type: 'currency', currency: 'COP' },
    { key: 'minOrder', label: 'Orden minima', type: 'text' },
    {
      key: 'inventory.stock',
      label: 'Stock actual',
      type: 'stock',
      valueFn: (row) => row.inventory.stock,
      criticalFn: (row) => this.isLowStock(row),
    },
    {
      key: 'inventory.minStock',
      label: 'Stock mínimo',
      valueFn: (row) => row.inventory.minStock,
    },
    {
      key: 'status',
      label: 'Estado',
      type: 'badge',
      badgeFn: (row) =>
        this.isLowStock(row)
          ? { text: 'Stock crítico', variant: 'error' }
          : { text: 'OK', variant: 'success' },
    },
  ];

  actions: TableAction<Straw>[] = [
    { icon: 'fa-solid fa-pen', title: 'Editar', onClick: (row) => this.openEditModal(row) },
  ];

  footer = computed<TableFooter>(() => ({
    label: 'Total en stock:',
    value: `${this.totalPajillas} uds.`,
    colspanBefore: 3,
    colspanAfter: 3,
  }));

  //loadings
  uploading = signal(false);

  ngOnInit() {
    this.loadBull();
    this.loadStraws();
  }

  openCreateModal() {
    this.strawForm = this._fb.group({
      type: ['CONVENTIONAL', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      minOrder: [1, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      minStock: [0, [Validators.required, Validators.min(0)]],
    });
    this.strawModal.set({ mode: 'create' });
  }

  openEditModal(straw: Straw) {
    this.strawForm = this._fb.group({
      price: [straw.price, [Validators.required, Validators.min(0)]],
      stock: [straw.inventory.stock, [Validators.required, Validators.min(0)]],
      minStock: [straw.inventory.minStock, [Validators.required, Validators.min(0)]],
    });
    this.strawModal.set({ mode: 'edit', straw });
  }
  closeModal() {
    this.strawModal.set(null);
  }

  saveStraw() {
    if (this.strawForm.invalid) {
      this.strawForm.markAllAsTouched();
      return;
    }
    this.savingStraw.set(true);

    if (this.isEditing()) {
      // lógica de edición (ajusta según tu servicio)
      const { price, stock, minStock } = this.strawForm.value;
      console.log('Editando:', { price, stock, minStock });
      this.savingStraw.set(false);
      this.closeModal();
    } else {
      const { type, price, minOrder, stock, minStock } = this.strawForm.value;
      const payload: CreateStraw = {
        bullId: this.id(),
        type,
        price,
        minOrder,
        inventory: { stock, minStock },
      };
      this._bullService.createStraw(payload).subscribe({
        next: () => {
          this.savingStraw.set(false);
          this._alertMessageService.success('La pajilla ha sido agregada.');
          this.closeModal();
          this.loadStraws();
        },
        error: (error) => {
          this._alertMessageService.warning(error);
          this.savingStraw.set(false);
        },
      });
    }
  }

  isLowStock(item: Straw): boolean {
    return item.inventory.stock <= item.inventory.minStock;
  }
  // Tabs
  activeTab = signal<'info' | 'stock' | 'gallery' | 'video' | 'genetic'>('info');

  onPhotoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Preview local inmediato
    const reader = new FileReader();
    reader.onload = () => this.photoPreview.set(reader.result as string);
    reader.readAsDataURL(file);

    this.uploadFile(
      file,
      `supplier/bull/${this.id()}/`,
      (key, contentType) =>
        this._bullService.updateResource(this.id(), [{ key, contentType }], 'IMAGE'),
      'Imagen actualizada con éxito!',
    );
  }

  setTab(tab: 'info' | 'stock' | 'gallery' | 'video' | 'genetic') {
    this.activeTab.set(tab);
  }

  onGallerySelected(files: File[]) {
    this.uploading.set(true);

    const path = `supplier/bull/${this.id()}/gallery/`;

    // 1. Pide todas las URLs prefirmadas de una vez
    this._bullService.getUploadUrls(path, files).subscribe({
      next: async ({ urls }) => {
        try {
          // 2. Sube todos los archivos a S3 en paralelo
          await Promise.all(
            urls.map((url: string, i: number) => this._bullService.uploadFileToS3(url, files[i])),
          );

          // 3. Extrae los keys de las URLs
          const mediaFiles = urls.map((url: string, i: number) => ({
            key: url.split('?')[0].split('.com/')[1],
            contentType: files[i].type,
          }));

          // 4. Actualiza la galería en BD
          this._bullService.updateResource(this.id(), mediaFiles, 'GALLERY').subscribe({
            next: (response) => {
              this.bull.update((bull) => (bull ? { ...bull, gallery: response.gallery } : bull));
              this._alertMessageService.success('Galería actualizada con éxito!');
              this.uploading.set(false);
            },
            error: (err) => {
              this._alertMessageService.error('Error actualizando galería: ' + err);
              this.uploading.set(false);
            },
          });
        } catch (err) {
          this._alertMessageService.error('Error subiendo archivos: ' + err);
          this.uploading.set(false);
        }
      },
      error: (err) => {
        this._alertMessageService.error('Error obteniendo URLs prefirmadas: ' + err);
        this.uploading.set(false);
      },
    });
  }

  onVideoSelected(file: File) {
    this.uploadFile(
      file,
      `supplier/bull/${this.id()}/videos/`,
      (key, contentType) =>
        this._bullService.updateResource(this.id(), [{ key, contentType }], 'VIDEO'),
      'Video actualizado con éxito!',
    );
  }

  onDocumentSelected(file: File) {
    this.uploadFile(
      file,
      `supplier/bull/${this.id()}/documents/`,
      (key, contentType) =>
        this._bullService.updateResource(this.id(), [{ key, contentType }], 'DOCUMENT'),
      'Documento actualizado con éxito!',
    );
  }

  loadBull() {
    this.loading.set(true);
    this._bullService.getById(this.id()).subscribe({
      next: (data) => {
        this.bull.set(data);
        this._gallery.set(data.gallery);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el toro.');
        this.loading.set(false);
      },
    });
  }

  loadStraws() {
    this.loading.set(true);
    this._bullService.getStraws(this.id()).subscribe({
      next: (data) => {
        this.straws.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar las pajillas.');
        this.loading.set(false);
      },
    });
  }

  goBack() {
    this._router.navigateByUrl(`/${RoutesApp.admin}/${RoutesApp.bulls}`);
  }

  handleDelete(key: string, resourceType: ResourceType) {
    this._bullService.deleteResource(this.id(), key, resourceType).subscribe({
      next: (data) => {
        this.bull.set(data);
        this._alertMessageService.success('Imagen eliminada con éxito!');
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo eliminar la imagen.');
        this.loading.set(false);
      },
    });
  }

  get totalPajillas(): number {
    return this.straws().reduce((acc, p) => acc + p.inventory.stock, 0);
  }

  private uploadFile(
    file: File,
    path: string,
    updateFn: (key: string, contentType: string) => Observable<unknown>,
    successMessage: string,
  ) {
    this.uploading.set(true);

    this._bullService
      .getUploadUrl(path, file.name, file.type)
      .pipe(
        switchMap(({ url }) =>
          from(this._bullService.uploadFileToS3(url, file)).pipe(
            map(() => {
              const key = url.split('?')[0].split('.com/')[1];
              return { key, contentType: file.type };
            }),
          ),
        ),
        switchMap(({ key, contentType }) => updateFn(key, contentType)),
        finalize(() => this.uploading.set(false)),
      )
      .subscribe({
        next: () => this._alertMessageService.success(successMessage),
        error: (err) => this._alertMessageService.error('Error en la subida: ' + err),
      });
  }
}
