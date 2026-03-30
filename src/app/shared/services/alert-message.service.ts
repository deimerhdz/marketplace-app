import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AlertMessageService {
  private showAlert(title: string, message: string, icon: SweetAlertIcon = 'info') {
    Swal.fire({
      title,
      text: message,
      icon,
    });
  }

  message(title: string, message: string, icon: SweetAlertIcon = 'info') {
    this.showAlert(title, message, icon);
  }

  success(message: string) {
    this.showAlert('Éxito', message, 'success');
  }

  error(message: string) {
    this.showAlert('Error', message, 'error');
  }

  warning(message: string) {
    this.showAlert('Advertencia', message, 'warning');
  }

  info(message: string) {
    this.showAlert('Información', message, 'info');
  }

  async confirm(title: string, text: string) {
    return await Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar',
    });
  }
}
