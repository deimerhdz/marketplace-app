import { MediaFile } from '@app/core/model/media-file.model';
import { Breed } from './breed.model';
import { Straw } from './straw.model';

export interface Bull {
  id: string;
  name: string;
  stud: string;
  slug: string;
  breed: Breed;
  straws: Straw[];
  birthDate: string;
  video?: MediaFile;
  image?: MediaFile;
  description: string;
  isFeature: boolean;
  gallery: MediaFile[];
}
