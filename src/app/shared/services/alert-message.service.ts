import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AlertMessageService {
  message(title: string, message: string, icon?: SweetAlertIcon) {
    Swal.fire({ icon, title, text: message });
  }
}
