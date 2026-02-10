import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { LogEntry } from '@core/models/models';

@Injectable({ providedIn: 'root' })
export class LogService {
  private readonly apiUrl = `${environment.apiUrl}/logs`;

  constructor(private http: HttpClient) {}

  getLogs(filters?: {
    level?: string;
    category?: string;
    source?: string;
    start_date?: string;
    end_date?: string;
    limit?: number;
    offset?: number;
  }): Observable<LogEntry[]> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }
    return this.http.get<LogEntry[]>(`${this.apiUrl}/`, { params });
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }

  getLevels(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/levels`);
  }
}
