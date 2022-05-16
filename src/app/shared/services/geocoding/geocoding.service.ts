import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GeolocationInfo } from './types';

@Injectable({
  providedIn: 'root',
})
export class GeocodingService {
  constructor(private http: HttpClient) {}

  async getCoordinatesByAddress(address: string) {
    return await this.http
      .get<GeolocationInfo[]>('https://nominatim.openstreetmap.org/search', {
        params: {
          q: address,
          format: 'json',
        },
      })
      .toPromise(Promise);
  }
}
