import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GeocodingService } from '../../services/geocoding/geocoding.service';
import { GeolocationInfo } from '../../services/geocoding/types';

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.page.html',
  styleUrls: ['./geolocation.page.scss'],
})
export class GeolocationPage implements OnInit {
  suggestionLocations: GeolocationInfo[];
  searchValue: string;

  constructor(private modalController: ModalController, private geocoding: GeocodingService) {
    this.suggestionLocations = [];
  }

  ngOnInit() {}

  async valueChanged() {
    if (this.searchValue === '') {
      return;
    }
    this.suggestionLocations = await this.geocoding.getCoordinatesByAddress(this.searchValue);
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  onClick(lat: string, lon: string, name: string) {
    // this.localStorageService.save(LocalStorageKey.location, { lat, lon, name });
    console.log({ name, lat, lon });
    this.dismissModal();
  }
}
