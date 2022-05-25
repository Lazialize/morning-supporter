import { Component, OnInit } from '@angular/core';
import SwiperCore, { Autoplay, Keyboard, Pagination, Scrollbar, Zoom, EffectFade, Navigation } from 'swiper';
import { IonicSlides, ModalController, NavController } from '@ionic/angular';
import { GeolocationPage } from '../shared/pages/geolocation/geolocation.page';

SwiperCore.use([Keyboard, Pagination, Navigation, IonicSlides]);

@Component({
  selector: 'app-slide',
  templateUrl: './slide.page.html',
  styleUrls: ['./slide.page.scss'],
})
export class SlidePage implements OnInit {
  constructor(private nav: NavController, private modalController: ModalController) {}

  ngOnInit() {}

  toTabs() {
    this.nav.navigateForward('/');
  }

  setLocation() {
    this.modalController
      .create({
        component: GeolocationPage,
      })
      .then((modal) => modal.present());
  }
}
