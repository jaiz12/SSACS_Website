import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: any = {};
  configLoaded = false;
  private configLoadedPromise: Promise<void>;
  private configLoadedResolve!: () => void;

  constructor(private http: HttpClient) {
    this.configLoadedPromise = new Promise((resolve) => {
      this.configLoadedResolve = resolve;
    });
  }


  async loadConfig(): Promise<void> {
    try {
      const config = await lastValueFrom(this.http.get(`assets/config.json`, { responseType: 'json' }));

      if (config) {
        this.config = config;
        this.configLoaded = true;
        this.configLoadedResolve();
      } else {
        throw new Error('Config file is empty or malformed.', config);
      }
    } catch (error) {
      console.error('Failed to load config.json', error);
      throw new Error('Failed to load configuration: ' + (error instanceof Error ? error.message : error));
    }
  }


  get(key: string): any {
    return this.config[key];
  }

  getConfigLoadedPromise(): Promise<void> {
    return this.configLoadedPromise;
  }
}