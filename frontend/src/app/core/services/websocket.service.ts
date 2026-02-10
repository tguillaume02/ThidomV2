import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { environment } from '@environments/environment';

export interface WsMessage {
  type: string;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private ws: WebSocket | null = null;
  private messagesSubject = new Subject<WsMessage>();
  private connectionStatus = new BehaviorSubject<boolean>(false);
  private reconnectInterval = 5000;

  messages$ = this.messagesSubject.asObservable();
  connected$ = this.connectionStatus.asObservable();

  connect(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return;

    try {
      this.ws = new WebSocket(environment.wsUrl);

      this.ws.onopen = () => {
        this.connectionStatus.next(true);
        // Start heartbeat
        this.startHeartbeat();
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          this.messagesSubject.next(msg);
        } catch (e) {
          console.error('WebSocket parse error:', e);
        }
      };

      this.ws.onclose = () => {
        this.connectionStatus.next(false);
        setTimeout(() => this.connect(), this.reconnectInterval);
      };

      this.ws.onerror = () => {
        this.ws?.close();
      };
    } catch (e) {
      console.error('WebSocket connection error:', e);
      setTimeout(() => this.connect(), this.reconnectInterval);
    }
  }

  send(message: WsMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  subscribeToDevice(deviceId: number): void {
    this.send({ type: 'subscribe', device_id: deviceId });
  }

  disconnect(): void {
    this.ws?.close();
    this.ws = null;
  }

  private heartbeatTimer: any;

  private startHeartbeat(): void {
    clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = setInterval(() => {
      this.send({ type: 'ping' });
    }, 30000);
  }
}
