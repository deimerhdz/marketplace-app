import { FilePipe } from '@app/shared/pipe/file.pipe';
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { MediaFile } from '@app/core/model/media-file.model';
import { register, SwiperContainer } from 'swiper/element/bundle';
import { SwiperOptions } from 'swiper/types';
// register Swiper custom elements
register();
@Component({
  selector: 'app-gallery',
  imports: [FilePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './gallery.css',
  template: `
    <swiper-container init="false" class="mySwiper" thumbs-swiper=".mySwiper2" space-between="10">
      @for (item of gallery(); track $index) {
        <swiper-slide>
          <img
            class="w-full md:w-4/5 aspect-251/171 rounded-sm object-cover mx-auto mb-8"
            [src]="item.key | filePipe"
            [alt]="item.key"
          />
        </swiper-slide>
      }
    </swiper-container>

    <swiper-container
      id="thumbnail"
      init="false"
      class="mySwiper2 hidden md:block"
      free-mode="true"
      watch-slides-progress="true"
    >
      @if (gallery()?.length! > 1) {
        @for (item of gallery(); track $index) {
          <swiper-slide>
            <div class="slide-thumbnail">
              <img
                [src]="item.key | filePipe"
                class="w-full h-full object-cover rounded-sm"
                [alt]="item.key"
              />
            </div>
          </swiper-slide>
        }
      }
    </swiper-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Gallery implements OnInit {
  swiperElement = signal<SwiperContainer | null>(null);

  gallery = input<MediaFile[]>();

  ngOnInit(): void {
    this.config();
    this.configThumbnail();
  }

  config() {
    const swiperElementConstructor = document.querySelector('swiper-container');
    const swiperOptions: SwiperOptions = {
      slidesPerView: 1,
      pagination: true,
      autoplay: true,
      spaceBetween: 8,
    };
    Object.assign(swiperElementConstructor!, swiperOptions);
    this.swiperElement.set(swiperElementConstructor as SwiperContainer);
    this.swiperElement()?.initialize();
  }
  configThumbnail() {
    const swiperElementConstructor = document.querySelector('#thumbnail');
    const swiperOptions: SwiperOptions = {
      slidesPerView: 4,
      pagination: true,
      autoplay: true,
      spaceBetween: 8,
    };
    Object.assign(swiperElementConstructor!, swiperOptions);
    this.swiperElement.set(swiperElementConstructor as SwiperContainer);
    this.swiperElement()?.initialize();
  }
}
