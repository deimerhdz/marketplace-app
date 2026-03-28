import { MediaFile } from '@app/core/model/media-file.model';
import { Straw } from '@app/features/bulls/model/straw.model';

export interface Item {
  image: MediaFile;
  name: string;
  breed: string;
  straw: Straw;
}
