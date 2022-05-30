import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { GeocodingService } from '../../services/geocoding/geocoding.service';
import { GeolocationInfo } from '../../services/geocoding/types';
import { UserSettingService } from '../../services/user-setting/user-setting.service';

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.page.html',
  styleUrls: ['./geolocation.page.scss'],
})
export class GeolocationPage implements OnInit {
  suggestionLocations$: Observable<GeolocationInfo[]>;
  searchValue: string;

  constructor(
    public modalController: ModalController,
    private geocoding: GeocodingService,
    private auth: AuthService,
    private userSetting: UserSettingService,
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

  async onClick(lat: string, lon: string, name: string): Promise<void> {
    // this.localStorageService.save(LocalStorageKey.location, { lat, lon, name });
    console.log({ name, lat, lon });
    await this.userSetting.updateUserSettings({
      location: {
        name,
        lat,
        lon,
      },
    });
    this.dismissModal();
  }
}
