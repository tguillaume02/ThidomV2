import {
  HttpClient,
  environment,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-7ID3BB7P.js";

// src/app/core/services/plugin.service.ts
var PluginService = class _PluginService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${environment.apiUrl}/plugins`;
  }
  getPlugins() {
    return this.http.get(`${this.apiUrl}/`);
  }
  getAvailablePlugins() {
    return this.http.get(`${this.apiUrl}/available`);
  }
  getPlugin(id) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  createPlugin(plugin) {
    return this.http.post(`${this.apiUrl}/`, plugin);
  }
  updatePlugin(id, plugin) {
    return this.http.put(`${this.apiUrl}/${id}`, plugin);
  }
  syncPlugins() {
    return this.http.post(`${this.apiUrl}/sync`, {});
  }
  // Hub setup
  getPluginHubSchema(id) {
    return this.http.get(`${this.apiUrl}/${id}/hub-schema`);
  }
  savePluginHubConfig(id, hub_config) {
    return this.http.put(`${this.apiUrl}/${id}/hub-config`, { hub_config });
  }
  testPluginConnection(id, hub_config) {
    return this.http.post(`${this.apiUrl}/${id}/test-connection`, { hub_config });
  }
  getPluginStatus(id) {
    return this.http.get(`${this.apiUrl}/${id}/status`);
  }
  getSerialPorts() {
    return this.http.get(`${environment.apiUrl}/system/serial-ports`);
  }
  static {
    this.\u0275fac = function PluginService_Factory(t) {
      return new (t || _PluginService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PluginService, factory: _PluginService.\u0275fac, providedIn: "root" });
  }
};

export {
  PluginService
};
//# sourceMappingURL=chunk-NJMTHRNX.js.map
