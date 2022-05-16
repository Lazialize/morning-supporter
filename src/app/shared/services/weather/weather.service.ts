import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { WeatherInfo } from './types';

const baseUrl = 'https://api.openweathermap.org/data/2.5/onecall';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private subject: Subject<WeatherInfo>;
  constructor(private http: HttpClient) {
    this.subject = new Subject<WeatherInfo>();
  }

  public getWeatherInfo(): Observable<WeatherInfo> {
    return this.subject.asObservable();
  }

  public initializeWeatherInfo(): void {
    this.subject = new Subject<WeatherInfo>();
  }

  public updateWeatherInformation(lat: number, lon: number, limit: number = 1): void {
    this.http
      .get<WeatherInfo>(baseUrl, {
        params: {
          lat,
          lon,
          limit,
          units: 'metric',
          exclude: ['minutely', 'hourly', 'alerts'].join(','),
          appid: environment.openWether.apiKey,
        },
      })
      .pipe(first())
      .forEach((next) => this.subject.next(next));
  }
}
