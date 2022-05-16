import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { Observable, Subject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { WeatherInfo } from './types';

const baseUrl = 'https://api.openweathermap.org/data/2.5/onecall';

@Injectable({
  providedIn: 'root',
})
export class WeatherService extends Observable<WeatherInfo> {
  constructor(private http: HttpClient, private readonly geolocation$: GeolocationService) {
    super();
    const subject = new Subject<WeatherInfo>();
    this.geolocation$.subscribe(
      (position) =>
        this.fetchWetherInformation(position.coords.latitude, position.coords.longitude)
          .pipe(shareReplay({ bufferSize: 1, refCount: true }))
          .subscribe((weatherInfo) => subject.next(weatherInfo)),
      (err) => {
        // Returns the weather info of the Tokyo if an error occurred in getting the current coordinates.
        // TODO: It is a provisional implementation, so I will re-implement it to get the weather info by the set upped coordinates.
        this.fetchWetherInformation(36, 140)
          .pipe(shareReplay({ bufferSize: 1, refCount: true }))
          .subscribe((weatherInfo) => subject.next(weatherInfo));
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
