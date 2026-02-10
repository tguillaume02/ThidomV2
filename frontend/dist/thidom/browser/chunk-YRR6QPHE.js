import {
  HttpClient,
  HttpParams,
  environment,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-7ID3BB7P.js";

// src/app/core/services/device.service.ts
var DeviceService = class _DeviceService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${environment.apiUrl}/devices`;
  }
  getDevices(roomId) {
    let params = new HttpParams();
    if (roomId) {
      params = params.set("room_id", roomId.toString());
    }
    return this.http.get(`${this.apiUrl}/`, { params });
  }
  getDevice(id) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  createDevice(device) {
    return this.http.post(`${this.apiUrl}/`, device);
  }
  updateDevice(id, device) {
    return this.http.put(`${this.apiUrl}/${id}`, device);
  }
  deleteDevice(id) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  updateState(id, state) {
    return this.http.put(`${this.apiUrl}/${id}/state`, { state });
  }
  executeAction(id, action, params) {
    return this.http.post(`${this.apiUrl}/${id}/action`, { action, params });
  }
  static {
    this.\u0275fac = function DeviceService_Factory(t) {
      return new (t || _DeviceService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _DeviceService, factory: _DeviceService.\u0275fac, providedIn: "root" });
  }
};

export {
  DeviceService
};
//# sourceMappingURL=chunk-YRR6QPHE.js.map
