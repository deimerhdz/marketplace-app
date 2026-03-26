import { UserAuth } from './userAuth.model';

export interface AuthResponse {
  status: string;
  accessToken: string;
  refreshToken: string;
  session: string;
  user: UserAuth;
}

export interface ChangePassword {
  email: string;
  newPassword: string;
  session: string;
}
