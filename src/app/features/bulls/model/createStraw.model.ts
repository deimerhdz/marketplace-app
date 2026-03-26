export type StrawType = 'CONVENTIONAL' | 'SEXED';
export interface CreateStraw {
  bullId: string;
  price: number;
  type: StrawType;
  minOrder: number;
  inventory: { stock: number; minStock: number };
}
