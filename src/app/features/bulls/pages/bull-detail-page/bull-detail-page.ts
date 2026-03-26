import { ChangeDetectionStrategy, Component, inject, input, signal, OnInit } from '@angular/core';
import { Bull } from '../../model/bull.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { RoutesApp } from '@app/shared/const/routes.app';
import { BullService } from '../../service/bull.service';
import { MediaFile } from '@app/core/model/media-file.model';

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
  imports: [DatePipe, CurrencyPipe],
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
  pajillas = signal<Pajilla[]>([
    {
      id: 1,
      code: 'PAJ-001',
      name: 'Pajilla convencional 0.5ml',
      price: 25000,
      stock: 40,
      minStock: 10,
    },
    { id: 2, code: 'PAJ-002', name: 'Pajilla sexada hembra', price: 85000, stock: 8, minStock: 15 },
    { id: 3, code: 'PAJ-003', name: 'Pajilla sexada macho', price: 80000, stock: 12, minStock: 10 },
  ]);
  isLowStock(item: Pajilla): boolean {
    return item.stock <= item.minStock;
  }
  // Tabs
  activeTab = signal<'info' | 'stock' | 'gallery' | 'video' | 'genetic'>('info');
  onPhotoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview.set(reader.result as string);
    };
    reader.readAsDataURL(file);
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
  ngOnInit() {
    this.loadBull();
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

  goBack() {
    this._router.navigateByUrl(`/${RoutesApp.admin}/${RoutesApp.bulls}`);
  }

  get totalPajillas(): number {
    return this.pajillas().reduce((acc, p) => acc + p.stock, 0);
  }
}
