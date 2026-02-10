import {
  BehaviorSubject,
  Subject,
  environment,
  ɵɵdefineInjectable
} from "./chunk-7ID3BB7P.js";

// src/app/core/services/websocket.service.ts
var WebSocketService = class _WebSocketService {
  constructor() {
    this.ws = null;
    this.messagesSubject = new Subject();
    this.connectionStatus = new BehaviorSubject(false);
    this.reconnectInterval = 5e3;
    this.messages$ = this.messagesSubject.asObservable();
    this.connected$ = this.connectionStatus.asObservable();
  }
  connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN)
      return;
    try {
      this.ws = new WebSocket(environment.wsUrl);
      this.ws.onopen = () => {
        this.connectionStatus.next(true);
        this.startHeartbeat();
      };
      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          this.messagesSubject.next(msg);
        } catch (e) {
          console.error("WebSocket parse error:", e);
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
      console.error("WebSocket connection error:", e);
      setTimeout(() => this.connect(), this.reconnectInterval);
    }
  }
  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }
  subscribeToDevice(deviceId) {
    this.send({ type: "subscribe", device_id: deviceId });
  }
  disconnect() {
    this.ws?.close();
    this.ws = null;
  }
  startHeartbeat() {
    clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = setInterval(() => {
      this.send({ type: "ping" });
    }, 3e4);
  }
  static {
    this.\u0275fac = function WebSocketService_Factory(t) {
      return new (t || _WebSocketService)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _WebSocketService, factory: _WebSocketService.\u0275fac, providedIn: "root" });
  }
};

export {
  WebSocketService
};
//# sourceMappingURL=chunk-2JRYZEP4.js.map
