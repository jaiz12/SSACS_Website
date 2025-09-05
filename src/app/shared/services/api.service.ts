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
   let options: any = {};

  if (!isFormData) {
    options.headers = this.getHeaders(false); // JSON headers
  } else {
    // Do not set Content-Type, browser will add correct multipart boundary
    options.headers = this.getHeaders(true);
  }

  return this.http.post<any>(`${this.APIURL}/${endpoint}`, payload, options);
  }

  // READ (Get all)
  getAll(endpoint: string, params?: any, isFormData: boolean = false): Observable<any> {
    return this.http.get(`${this.APIURL}/${endpoint}`, { params });
  }

  // READ (Get by ID)
  getById(endpoint: string, id: number | string, isFormData: boolean = false): Observable<any> {
    return this.http.get<any>(`${this.APIURL}/${endpoint}/${id}`, {
      headers: this.getHeaders(isFormData),
    });
  }

  // UPDATE
  update(endpoint: string, payload: any, isFormData: boolean = false): Observable<any> {
    return this.http.put<any>(`${this.APIURL}/${endpoint}`, payload, {
      headers: this.getHeaders(isFormData),
    });
  }

  updateById(endpoint: string, id: any, isFormData: boolean = false): Observable<any> {
    const params = new HttpParams()
      .set('id', id) // ensure matches .NET param signature!
      .set('updatedBy', 'Admin');
    return this.http.put<any>(`${this.APIURL}/${endpoint}`, {}, { params,
      headers: this.getHeaders(isFormData),
    });
  }

  // DELETE
  deleteById(endpoint: string, id: number | string, isFormData: boolean = false): Observable<any> {
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
