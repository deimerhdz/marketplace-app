import { UserRole } from '@app/core/enums/role.enum';

export interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  cognitoSub: string;
  role: UserRole;
  active: boolean;
}
