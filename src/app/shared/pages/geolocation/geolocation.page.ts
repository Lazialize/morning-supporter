import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { GeocodingService } from '../../services/geocoding/geocoding.service';
import { GeolocationInfo } from '../../services/geocoding/types';

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.page.html',
  styleUrls: ['./geolocation.page.scss'],
})
export class GeolocationPage implements OnInit {
  suggestionLocations$: Observable<GeolocationInfo[]>;
  searchValue: string;

  constructor(
    private modalController: ModalController,
    private geocoding: GeocodingService,
    private firestore: FirestoreService,
    private auth: AuthService,
  ) {}

  ngOnInit() {
    this.suggestionLocations$ = this.geocoding.getGeolocationInfos();
  }

  async valueChanged() {
    if (this.searchValue === '') {
      return;
    }
    this.geocoding.searchCoordinatesByAddress(this.searchValue);
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  onClick(lat: string, lon: string, name: string) {
    // this.localStorageService.save(LocalStorageKey.location, { lat, lon, name });
    console.log({ name, lat, lon });
    this.firestore.setUserSettings(this.auth.getUserId(), {
      location: {
        name,
        lat,
        lon,
      },
    });
    this.dismissModal();
  }
}
