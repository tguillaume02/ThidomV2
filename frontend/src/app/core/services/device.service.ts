import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Device } from '@core/models/models';

export interface StateField {
  key: string;
  label: string;
  type: string;
}

@Injectable({ providedIn: 'root' })
export class DeviceService {
  private readonly apiUrl = `${environment.apiUrl}/devices`;

  constructor(private http: HttpClient) {}

  getDevices(roomId?: number): Observable<Device[]> {
    let params = new HttpParams();
    if (roomId) {
      params = params.set('room_id', roomId.toString());
    }
    return this.http.get<Device[]>(`${this.apiUrl}/`, { params });
  }

  getDevice(id: number): Observable<Device> {
    return this.http.get<Device>(`${this.apiUrl}/${id}`);
  }

  createDevice(device: Partial<Device>): Observable<Device> {
    return this.http.post<Device>(`${this.apiUrl}/`, device);
  }

  updateDevice(id: number, device: Partial<Device>): Observable<Device> {
    return this.http.put<Device>(`${this.apiUrl}/${id}`, device);
  }

  deleteDevice(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateState(id: number, state: any): Observable<Device> {
    return this.http.put<Device>(`${this.apiUrl}/${id}/state`, { state });
  }

  executeAction(id: number, action: string, params?: any): Observable<Device> {
    return this.http.post<Device>(`${this.apiUrl}/${id}/action`, { action, params });
  }

  getStateFields(id: number): Observable<StateField[]> {
    return this.http.get<StateField[]>(`${this.apiUrl}/${id}/state-fields`);
  }
}
