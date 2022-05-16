import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { Observable, Subject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GeolocationPage } from '../../pages/geolocation/geolocation.page';
import { AuthService } from '../auth/auth.service';
import { FirestoreService } from '../firestore/firestore.service';
import { WeatherInfo } from './types';

const baseUrl = 'https://api.openweathermap.org/data/2.5/onecall';

@Injectable({
  providedIn: 'root',
})
export class WeatherService extends Observable<WeatherInfo> {
  constructor(
    private http: HttpClient,
    private readonly geolocation$: GeolocationService,
    private modalController: ModalController,
    private firestore: FirestoreService,
    private auth: AuthService,
  ) {
    super();
    const subject = new Subject<WeatherInfo>();
    this.geolocation$.subscribe(
      (position) =>
        this.fetchWetherInformation(position.coords.latitude, position.coords.longitude)
          .pipe(shareReplay({ bufferSize: 1, refCount: true }))
          .subscribe((weatherInfo) => subject.next(weatherInfo)),
      async () => {
        this.firestore.getUserSettingsById(this.auth.getUserId()).subscribe(async (settings) => {
          if (!settings) {
            await (await modalController.create({ component: GeolocationPage })).present();
            return;
          }

          this.fetchWetherInformation(+settings.location.lat, +settings.location.lon)
            .pipe(shareReplay({ bufferSize: 1, refCount: true }))
            .subscribe((weatherInfo) => subject.next(weatherInfo));
        });
      },
    );
    return subject.asObservable() as WeatherService;
  }

  private fetchWetherInformation(lat: number, lon: number, limit: number = 1) {
    return this.http.get<WeatherInfo>(baseUrl, {
      params: {
        lat,
        lon,
        limit,
        units: 'metric',
        exclude: ['current', 'minutely', 'hourly', 'alerts'].join(','),
        appid: environment.openWether.apiKey,
      },
    });
  }
}
