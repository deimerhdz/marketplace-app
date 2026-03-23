import { Injectable } from '@angular/core';
import { StrawType } from '@app/features/bulls/enums/straw.enum';
import { Bull } from '@app/features/bulls/model/bull.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private bulls: Bull[] = [
    {
      id: 'bull-1',
      name: 'Toro Alfa',
      stud: 'Rancho Norte',
      slug: 'toro-alfa',
      breed: { id: 'b1', name: 'Angus' },
      straws: [
        { id: 's1', sku: 'SKU-001', price: 45.5, type: StrawType.SEXED, minOrder: 5 },
        { id: 's1b', sku: 'SKU-001B', price: 40.0, type: StrawType.CONVENTIONAL, minOrder: 10 },
      ],
      birthDate: '2018-03-12T00:00:00.000Z',
      video: { key: 'video1.mp4', contentType: 'video/mp4' },
      image: { key: 'img1.jpg', contentType: 'image/jpeg' },
      description: 'Toro fuerte y fértil',
      isFeature: true,
      gallery: [
        { key: 'g1.jpg', contentType: 'image/jpeg' },
        { key: 'g1b.jpg', contentType: 'image/jpeg' },
      ],
    },
    {
      id: 'bull-2',
      name: 'Toro Bravo',
      stud: 'Hacienda Sur',
      slug: 'toro-bravo',
      breed: { id: 'b2', name: 'Brahman' },
      straws: [
        { id: 's2', sku: 'SKU-002', price: 38.2, type: StrawType.CONVENTIONAL, minOrder: 10 },
      ],
      birthDate: '2019-07-21T00:00:00.000Z',
      image: { key: 'img2.jpg', contentType: 'image/jpeg' },
      description: 'Gran resistencia al calor',
      isFeature: true,
      gallery: [],
    },
    {
      id: 'bull-3',
      name: 'Toro Elite',
      stud: 'Genética Plus',
      slug: 'toro-elite',
      breed: { id: 'b3', name: 'Hereford' },
      straws: [
        { id: 's3', sku: 'SKU-003', price: 52.0, type: StrawType.CONVENTIONAL, minOrder: 3 },
      ],
      birthDate: '2020-01-15T00:00:00.000Z',
      description: 'Excelente genética',
      isFeature: true,
      gallery: [{ key: 'g3.jpg', contentType: 'image/jpeg' }],
    },
    {
      id: 'bull-4',
      name: 'Toro Max',
      stud: 'Rancho Verde',
      slug: 'toro-max',
      breed: { id: 'b1', name: 'Angus' },
      straws: [
        { id: 's4', sku: 'SKU-004', price: 41.7, type: StrawType.CONVENTIONAL, minOrder: 8 },
      ],
      birthDate: '2017-11-03T00:00:00.000Z',
      description: 'Alta producción',
      isFeature: true,
      gallery: [],
    },
    {
      id: 'bull-5',
      name: 'Toro Titan',
      stud: 'Finca Dorada',
      slug: 'toro-titan',
      breed: { id: 'b2', name: 'Brahman' },
      straws: [
        { id: 's5', sku: 'SKU-005', price: 60.1, type: StrawType.CONVENTIONAL, minOrder: 2 },
      ],
      birthDate: '2016-06-10T00:00:00.000Z',
      video: { key: 'video5.mp4', contentType: 'video/mp4' },
      description: 'Gran tamaño corporal',
      isFeature: true,
      gallery: [],
    },
    {
      id: 'bull-6',
      name: 'Toro Zeus',
      stud: 'AgroElite',
      slug: 'toro-zeus',
      breed: { id: 'b4', name: 'Simmental' },
      straws: [
        { id: 's6', sku: 'SKU-006', price: 47.9, type: StrawType.CONVENTIONAL, minOrder: 6 },
      ],
      birthDate: '2018-09-09T00:00:00.000Z',
      description: 'Buen rendimiento',
      isFeature: true,
      gallery: [{ key: 'g6.jpg', contentType: 'image/jpeg' }],
    },
    {
      id: 'bull-7',
      name: 'Toro Fénix',
      stud: 'Campo Real',
      slug: 'toro-fenix',
      breed: { id: 'b5', name: 'Charolais' },
      straws: [{ id: 's7', sku: 'SKU-007', price: 55.0, type: StrawType.SEXED, minOrder: 4 }],
      birthDate: '2021-02-01T00:00:00.000Z',
      image: { key: 'img7.jpg', contentType: 'image/jpeg' },
      description: 'Alta fertilidad',
      isFeature: true,
      gallery: [],
    },
    {
      id: 'bull-8',
      name: 'Toro Rex',
      stud: 'Rancho Azul',
      slug: 'toro-rex',
      breed: { id: 'b3', name: 'Hereford' },
      straws: [{ id: 's8', sku: 'SKU-008', price: 39.5, type: StrawType.SEXED, minOrder: 12 }],
      birthDate: '2015-12-20T00:00:00.000Z',
      description: 'Clásico y confiable',
      isFeature: true,
      gallery: [],
    },
    {
      id: 'bull-9',
      name: 'Toro Atlas',
      stud: 'Hacienda Central',
      slug: 'toro-atlas',
      breed: { id: 'b2', name: 'Brahman' },
      straws: [
        { id: 's9', sku: 'SKU-009', price: 44.3, type: StrawType.CONVENTIONAL, minOrder: 7 },
      ],
      birthDate: '2019-04-14T00:00:00.000Z',
      description: 'Resistente',
      isFeature: true,
      gallery: [{ key: 'g9.jpg', contentType: 'image/jpeg' }],
    },
    {
      id: 'bull-10',
      name: 'Toro Nova',
      stud: 'Genética Prime',
      slug: 'toro-nova',
      breed: { id: 'b1', name: 'Angus' },
      straws: [{ id: 's10', sku: 'SKU-010', price: 62.0, type: StrawType.SEXED, minOrder: 3 }],
      birthDate: '2022-05-18T00:00:00.000Z',
      description: 'Nueva genética',
      isFeature: true,
      gallery: [],
    },
  ];

  /**
   * Obtener toros destacados
   */
  getBulls(): Observable<Bull[]> {
    return of(this.bulls.filter((b) => b.isFeature));
  }
}
