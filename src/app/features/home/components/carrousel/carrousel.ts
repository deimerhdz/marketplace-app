import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  input,
  ViewChild,
} from '@angular/core';
import { register } from 'swiper/element/bundle';
import { SwiperOptions } from 'swiper/types';

// register Swiper custom elements
register();

@Component({
  selector: 'app-carrousel',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './carrousel.css',
  template: `
    <swiper-container #swiperRef init="false" [class]="className()">
      <ng-content />
    </swiper-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Carrousel implements AfterViewInit {
  @ViewChild('swiperRef') swiperRef!: ElementRef;

  loop = input<boolean>(true);
  autoplay = input<boolean>(true);
  delay = input<number>(3000);
  className = input<string>('');
  slides = input<number>(1);
  pagination = input<boolean>(true);
  navigation = input<boolean>(false);
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.config();
    }, 0);
  }

  config() {
    const params: SwiperOptions = {
      loop: this.loop(),
      slidesPerView: 1, // < 640px (móvil)
      breakpoints: {
        640: { slidesPerView: 2 }, // sm
        768: { slidesPerView: 3 }, // md
        1024: { slidesPerView: this.slides() }, // lg → usa el input
      },
      pagination: this.pagination(),
      navigation: this.navigation(),
      autoplay: this.autoplay() ? { delay: this.delay(), disableOnInteraction: false } : false,
      spaceBetween: 20,
    };

    Object.assign(this.swiperRef.nativeElement, params);
    this.swiperRef.nativeElement.initialize();
  }
}
