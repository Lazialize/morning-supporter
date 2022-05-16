import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { GeolocationInfo } from './types';

@Injectable({
  providedIn: 'root',
})
export class GeocodingService {
  private geolocationInfos$: Subject<GeolocationInfo[]>;

  constructor(private http: HttpClient) {
    this.geolocationInfos$ = new Subject<GeolocationInfo[]>();
  }

  getGeolocationInfos(): Observable<GeolocationInfo[]> {
    return this.geolocationInfos$.asObservable();
  }

  searchCoordinatesByAddress(address: string): void {
    this.http
      .get<GeolocationInfo[]>('https://nominatim.openstreetmap.org/search', {
        params: {
          q: address,
          format: 'json',
        },
      })
      .pipe(first())
      .forEach((next) => this.geolocationInfos$.next(next));
  }
}
