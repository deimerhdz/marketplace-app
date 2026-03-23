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
  selector: 'app-carrousel',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './carrousel.css',
  template: `
    <swiper-container init="false">
      <swiper-slide>
        <div class="slide-custom">
          <img src="1.png" alt="toro1.png" class="w-full h-full object-contain md:object-cover" />
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="slide-custom">
          <img src="2.png" alt="toro2.png" class="w-full h-full object-contain md:object-cover" />
        </div>
      </swiper-slide>
    </swiper-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Carrousel implements OnInit {
  swiperElement = signal<SwiperContainer | null>(null);

  ngOnInit(): void {
    this.config();
  }

  config() {
    const swiperElementConstructor = document.querySelector('swiper-container');
    const swiperOptions: SwiperOptions = {
      slidesPerView: 1,
      pagination: true,
      autoplay: true,
    };
    Object.assign(swiperElementConstructor!, swiperOptions);
    this.swiperElement.set(swiperElementConstructor as SwiperContainer);
    this.swiperElement()?.initialize();
  }
}
