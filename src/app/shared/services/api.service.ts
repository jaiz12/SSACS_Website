import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';

declare let gtag: Function;

@Injectable({ providedIn: 'root' })
export class APIService {
  APIURL: any;
IMAGE_API_URL: any;

constructor(private http: HttpClient, private configService : ConfigService) {
  this.APIURL = this.configService.get("apiUrl");;
  this.IMAGE_API_URL = this.configService.get("imageApiUrl");;
  }

   // CREATE
   post(endpoint: string, payload: any, isFormData: boolean = false): Observable<any> {
    return this.http.post<any>(`${this.APIURL}/${endpoint}`, payload, {
      headers: this.getHeaders(isFormData),
    });
  }

  // READ (Get all)
  getAll(endpoint: string, loc_name: any, page_name: any, isFormData: boolean = false): Observable<any> {
    const params = new HttpParams()
      .set('loc_name', loc_name) // ensure matches .NET param signature!
      .set('page_name', page_name);
    return this.http.get(`${this.APIURL}/${endpoint}`, { params });
  }

  // READ (Get by ID)
  getById(endpoint: string, id: number | string, isFormData: boolean = false): Observable<any> {
    return this.http.get<any>(`${this.APIURL}/${endpoint}/${id}`, {
      headers: this.getHeaders(isFormData),
    });
  }

  // UPDATE
  update(endpoint: string, id: number | string, payload: any, isFormData: boolean = false): Observable<any> {
    return this.http.put<any>(`${this.APIURL}/${endpoint}/${id}`, payload, {
      headers: this.getHeaders(isFormData),
    });
  }

  // DELETE
  delete(endpoint: string, id: number | string, isFormData: boolean = false): Observable<any> {
    return this.http.delete<any>(`${this.APIURL}/${endpoint}/${id}`, {
      headers: this.getHeaders(isFormData),
    });
  }

  public getHeaders(isFormData: boolean = false): HttpHeaders {
    let headers = new HttpHeaders();
    isFormData
      ? headers.set('Content-Type', 'multipart/form-data')
      : headers.set('Content-Type', 'application/json');
  
    return headers;
  }
}
