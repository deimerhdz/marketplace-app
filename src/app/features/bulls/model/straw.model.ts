import { Inventory } from './inventory.model';
import { StrawType } from '../enums/straw.enum';

export interface Straw {
  id: string;
  sku: string;
  price: number;
  type: StrawType;
  minOrder: number;
  inventory: Inventory;
}
