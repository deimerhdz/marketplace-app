import { ChangeDetectionStrategy, Component, inject, input, signal, OnInit } from '@angular/core';
import { Bull } from '../../model/bull.model';
import { CurrencyPipe, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { RoutesApp } from '@app/shared/const/routes.app';
import { BullService } from '../../service/bull.service';
import { MediaFile } from '@app/core/model/media-file.model';
import { BullInfo } from '../../components/bull-info/bull-info';
import { CreateStraw } from '../../model/createStraw.model';
import { FormsModule } from '@angular/forms';
import { Straw } from '../../model/straw.model';
import { ImagePipe } from '@app/shared/pipe/image.pipe';

export interface Pajilla {
  id: number;
  code: string;
  name: string;
  price: number;
  stock: number;
  minStock: number;
}

@Component({
  selector: 'app-bull-detail-page',
  imports: [BullInfo, ImagePipe, CurrencyPipe, JsonPipe, FormsModule],
  templateUrl: './bull-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BullDetailPage implements OnInit {
  private _router = inject(Router);
  private bullService = inject(BullService);

  id = input.required<string>();
  bull = signal<Bull | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  photoPreview = signal<string | null>(null);
  // Galería de imágenes
  galleryImages = signal<MediaFile[]>([]);
  galleryPreviews = signal<string[]>([]);

  // Video
  videoPreview = signal<string | null>(null);
  videoFile = signal<File | null>(null);

  // Evaluación genética
  geneticFile = signal<File | null>(null);
  geneticFileName = signal<string | null>(null);

  // Inventario (mock)
  straws = signal<Straw[]>([]);

  // ── Modal de agregar pajilla ──
  showStrawModal = signal(false);
  savingStraw = signal(false);

  strawForm = signal<CreateStraw>({
    bullId: '',
    price: 0,
    type: 'CONVENTIONAL',
    minOrder: 1,
    inventory: { stock: 0, minStock: 0 },
  });

  uploading = signal(false);

  ngOnInit() {
    this.loadBull();
    this.loadStraws();
  }
  openPajillaModal() {
    this.strawForm.set({
      bullId: this.id(),
      price: 0,
      type: 'CONVENTIONAL',
      minOrder: 1,
      inventory: { stock: 0, minStock: 0 },
    });
    this.showStrawModal.set(true);
  }

  closeStrawModal() {
    this.showStrawModal.set(false);
  }

  updateForm(partial: Partial<CreateStraw>) {
    this.strawForm.update((f) => ({ ...f, ...partial }));
  }

  updateInventory(partial: Partial<CreateStraw['inventory']>) {
    this.strawForm.update((f) => ({
      ...f,
      inventory: { ...f.inventory, ...partial },
    }));
  }

  savePajilla() {
    this.savingStraw.set(true);
    this.bullService.createStraw(this.strawForm()).subscribe({
      next: () => {
        this.savingStraw.set(false);
        this.closeStrawModal();
        this.loadStraws(); // refresca datos
      },
      error: () => {
        this.savingStraw.set(false);
      },
    });
  }

  isLowStock(item: Straw): boolean {
    return item.inventory.stock <= item.inventory.minStock;
  }
  // Tabs
  activeTab = signal<'info' | 'stock' | 'gallery' | 'video' | 'genetic'>('info');

  onPhotoSelected(event: Event) {
    this.uploading.set(true);
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview.set(reader.result as string);
    };
    reader.readAsDataURL(file);
    const path = `supplier/bull/${this.id()}/`;
    // 1. Pedir URL prefirmada
    this.bullService.getUploadUrl(path, file.name, file.type).subscribe({
      next: async ({ url }) => {
        try {
          const response = await this.bullService.uploadFileToS3(url, file);
          console.log(' Subido correctamente', response);
          this.uploading.set(false);
          const cleanUrl = url.split('?')[0];
          const key = cleanUrl.split('.com/')[1];
          this.bullService.updateImage(this.id(), key, file.type).subscribe({
            next: (bull) => {
              console.log(' Imagen actualizada', bull);
              this.uploading.set(false);
            },
            error: (err) => {
              console.error(' Error actualizando imagen', err);
              this.uploading.set(false);
            },
          });
        } catch (e) {
          console.error(' Error subiendo', e);
          this.uploading.set(false);
        }
      },

      error: () => {
        console.error('Error obteniendo URL prefirmada');
        this.uploading.set(false);
      },
    });
  }

  setTab(tab: 'info' | 'stock' | 'gallery' | 'video' | 'genetic') {
    this.activeTab.set(tab);
  }

  onGallerySelected(event: Event) {
    const files = Array.from((event.target as HTMLInputElement).files ?? []);
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

  onVideoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.videoFile.set(file);
    this.videoPreview.set(URL.createObjectURL(file));
  }

  onGeneticSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.geneticFile.set(file);
    this.geneticFileName.set(file.name);
  }

  removeVideo() {
    this.videoPreview.set(null);
    this.videoFile.set(null);
  }

  removeGenetic() {
    this.geneticFile.set(null);
    this.geneticFileName.set(null);
  }

  loadBull() {
    this.loading.set(true);
    this.bullService.getById(this.id()).subscribe({
      next: (data) => {
        this.bull.set(data);
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
    this.bullService.getStraws(this.id()).subscribe({
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

  get totalPajillas(): number {
    return this.straws().reduce((acc, p) => acc + p.inventory.stock, 0);
  }
}
