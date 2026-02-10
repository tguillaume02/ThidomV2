import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { HistoryData } from '@core/models/models';

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private readonly apiUrl = `${environment.apiUrl}/history`;

  constructor(private http: HttpClient) {}

  getHistory(
    deviceId: number,
    field?: string,
    start?: string,
    end?: string,
    aggregation?: string,
    interval?: string
  ): Observable<HistoryData> {
    let params = new HttpParams().set('device_id', deviceId.toString());
    if (field) params = params.set('field', field);
    if (start) params = params.set('start', start);
    if (end) params = params.set('end', end);
    if (aggregation) params = params.set('aggregation', aggregation);
    if (interval) params = params.set('interval', interval);
    return this.http.get<HistoryData>(`${this.apiUrl}/`, { params });
  }
}
