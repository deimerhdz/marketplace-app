import { FormControl } from '@angular/forms';

export interface SignIn {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}
