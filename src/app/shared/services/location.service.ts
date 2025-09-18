import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocationService {

  constructor(private http: HttpClient) { }

  // Get user's coordinates using browser
  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation is not supported by your browser');
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    });
  }

  async getLatLon() : Promise<{ lat: number; lon: number }>  {
    try {
      const position = await this.getCurrentPosition();
      const lat = parseFloat(position.coords.latitude.toFixed(7)); // number
      const lon = parseFloat(position.coords.longitude.toFixed(6)); // number
      return { lat, lon };
    } catch (error) {
      console.error('Error getting location:', error);
      throw error;
    }
  }

  // Call OpenStreetMap Nominatim Reverse Geocoding API
  getLocationName(lat: number, lon: number) {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=f3f9071e442b4fcaa320e906bd13a0ba`;
    return this.http.get(url);
  }
}
