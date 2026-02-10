import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Plugin, PluginConnectionStatus } from '@core/models/models';

export interface SerialPortInfo {
  port: string;
  description: string;
  hwid: string;
  manufacturer: string;
}

@Injectable({ providedIn: 'root' })
export class PluginService {
  private readonly apiUrl = `${environment.apiUrl}/plugins`;

  constructor(private http: HttpClient) {}

  getPlugins(): Observable<Plugin[]> {
    return this.http.get<Plugin[]>(`${this.apiUrl}/`);
  }

  getAvailablePlugins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/available`);
  }

  getPlugin(id: number): Observable<Plugin> {
    return this.http.get<Plugin>(`${this.apiUrl}/${id}`);
  }

  createPlugin(plugin: Partial<Plugin>): Observable<Plugin> {
    return this.http.post<Plugin>(`${this.apiUrl}/`, plugin);
  }

  updatePlugin(id: number, plugin: Partial<Plugin>): Observable<Plugin> {
    return this.http.put<Plugin>(`${this.apiUrl}/${id}`, plugin);
  }

  syncPlugins(): Observable<any> {
    return this.http.post(`${this.apiUrl}/sync`, {});
  }

  // Hub setup
  getPluginHubSchema(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/hub-schema`);
  }

  savePluginHubConfig(id: number, hub_config: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/hub-config`, { hub_config });
  }

  testPluginConnection(id: number, hub_config: any): Observable<PluginConnectionStatus> {
    return this.http.post<PluginConnectionStatus>(`${this.apiUrl}/${id}/test-connection`, { hub_config });
  }

  getPluginStatus(id: number): Observable<PluginConnectionStatus> {
    return this.http.get<PluginConnectionStatus>(`${this.apiUrl}/${id}/status`);
  }

  getSerialPorts(): Observable<SerialPortInfo[]> {
    return this.http.get<SerialPortInfo[]>(`${environment.apiUrl}/system/serial-ports`);
  }
}
