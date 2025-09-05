import { Injectable } from "@angular/core";
import { ConfigService } from "./config.service";

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private socket: WebSocket | null = null;

  constructor(private configService: ConfigService) { }

  async connect() {
    // Wait for config to be loaded
    await this.configService.getConfigLoadedPromise();
    const wsPort = this.configService.get('wsPort');
    // Or wsUrl if you stored the full URL
    // const wsUrl = this.configService.get('wsUrl');
    this.socket = new WebSocket(`ws://${window.location.hostname}:${wsPort}/`);
    // OR: this.socket = new WebSocket(wsUrl);
  }

  getSocket(): WebSocket | null {
    return this.socket;
  }
}
