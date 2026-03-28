import { UserRole } from '@app/core/enums/role.enum';
import { CreateSupplier } from './supplier.model';

export interface CreateUser {
  id: string;
  email: string;
  name: string;
  lastName: string;
  role: UserRole;
  supplier: CreateSupplier;
}
