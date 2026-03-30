import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '@env/environment';

@Pipe({ name: 'safePdf', standalone: true })
export class SafePdfPipe implements PipeTransform {
  private _sanitizer = inject(DomSanitizer);

  transform(key: string | undefined): SafeResourceUrl {
    // #toolbar=0 oculta el botón de descarga del visor nativo
    return this._sanitizer.bypassSecurityTrustResourceUrl(`${environment.cdnUrl}/${key}`);
  }
}
