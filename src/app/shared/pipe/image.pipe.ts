import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '@env/environment';

@Pipe({
  name: 'imagePipe',
  pure: false,
  standalone: true,
})
export class ImagePipe implements PipeTransform {
  protected cdnUrl = environment.cdnUrl;

  transform(s3Key: string | null | undefined): string {
    if (!s3Key) {
      return 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg';
    }

    return `${this.cdnUrl}/${s3Key}`;
  }
}
