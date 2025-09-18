// src/app/url-parser.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlParserService {

  /**
   * Extracts the domain name from a full URL.
   * @param url The full URL string (e.g., 'https://www.example.com/page').
   * @returns The domain name (e.g., 'www.example.com').
   */
  public getDomainFromUrl(url: string): string | null {
    try {
      // The URL object handles parsing the protocol, hostname, etc.
      const urlObject = new URL(url);
      console.log(urlObject.host)
      // The 'hostname' property contains the domain name.
      //return urlObject.hostname;
      return urlObject.host;
    } catch (error) {
      console.error('Invalid URL:', error);
      return null;
    }
  }
}
