import {
  HttpClient,
  environment,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-7ID3BB7P.js";

// src/app/core/services/room.service.ts
var RoomService = class _RoomService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${environment.apiUrl}/rooms`;
  }
  getRooms() {
    return this.http.get(`${this.apiUrl}/`);
  }
  getRoomsTree() {
    return this.http.get(`${this.apiUrl}/tree`);
  }
  getRoom(id) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  createRoom(room) {
    return this.http.post(`${this.apiUrl}/`, room);
  }
  updateRoom(id, room) {
    return this.http.put(`${this.apiUrl}/${id}`, room);
  }
  deleteRoom(id) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  static {
    this.\u0275fac = function RoomService_Factory(t) {
      return new (t || _RoomService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _RoomService, factory: _RoomService.\u0275fac, providedIn: "root" });
  }
};

export {
  RoomService
};
//# sourceMappingURL=chunk-LVNRJANL.js.map
