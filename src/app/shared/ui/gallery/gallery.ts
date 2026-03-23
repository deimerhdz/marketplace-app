import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  signal,
} from '@angular/core';
import { register, SwiperContainer } from 'swiper/element/bundle';
import { SwiperOptions } from 'swiper/types';
// register Swiper custom elements
register();
@Component({
  selector: 'app-gallery',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './gallery.css',
  template: `
    <swiper-container init="false" class="mySwiper" thumbs-swiper=".mySwiper2" space-between="10">
      <swiper-slide>
        <img
          class="w-full md:w-4/5 aspect-251/171 rounded-sm object-cover mx-auto mb-8"
          src="https://i.pinimg.com/736x/89/c4/25/89c4258772dbc825a6f245227ef52fe5.jpg"
          alt="image"
        />
      </swiper-slide>
      <swiper-slide>
        <img
          class="w-full md:w-4/5 aspect-251/171 rounded-sm object-cover mx-auto mb-8"
          src="https://a.storyblok.com/f/160385/aabd501b3d/toro-brahman-lecherias.jpg"
          alt="image"
        />
      </swiper-slide>
      <swiper-slide>
        <img
          class="w-full md:w-4/5 aspect-251/171 rounded-sm object-cover mx-auto mb-8"
          src="https://images.engormix.com/forums/ph-20170506_114615-S-12006-brah.jpg"
          alt="image"
        />
      </swiper-slide>
      <swiper-slide>
        <img
          class="w-full md:w-4/5 aspect-251/171 rounded-sm object-cover mx-auto mb-8"
          src="https://a.storyblok.com/f/160385/0b4ecc9e51/caracteristicas_toro_brahman.jpg/m/?w=256&q=100"
          alt="image"
        />
      </swiper-slide>
    </swiper-container>

    <swiper-container
      id="thumbnail"
      init="false"
      class="mySwiper2 hidden md:block"
      free-mode="true"
      watch-slides-progress="true"
    >
      <swiper-slide>
        <div class="slide-thumbnail">
          <img
            src="https://i.pinimg.com/736x/89/c4/25/89c4258772dbc825a6f245227ef52fe5.jpg"
            class="w-full h-full object-cover rounded-sm"
            alt="image"
          />
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="slide-thumbnail">
          <img
            src="https://a.storyblok.com/f/160385/aabd501b3d/toro-brahman-lecherias.jpg"
            class="w-full h-full object-cover rounded-sm"
            alt="image"
          />
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="slide-thumbnail">
          <img
            src="https://images.engormix.com/forums/ph-20170506_114615-S-12006-brah.jpg"
            class="w-full h-full object-cover rounded-sm"
            alt="image"
          />
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="slide-thumbnail">
          <img
            src="https://a.storyblok.com/f/160385/0b4ecc9e51/caracteristicas_toro_brahman.jpg/m/?w=256&q=100"
            class="w-full h-full object-cover rounded-sm"
            alt="image"
          />
        </div>
      </swiper-slide>
    </swiper-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Gallery implements OnInit {
  swiperElement = signal<SwiperContainer | null>(null);

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
