import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Schedule } from '@core/models/models';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  private readonly apiUrl = `${environment.apiUrl}/schedules`;

  constructor(private http: HttpClient) {}

  getSchedules(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.apiUrl}/`);
  }

  getSchedule(id: number): Observable<Schedule> {
    return this.http.get<Schedule>(`${this.apiUrl}/${id}`);
  }

  createSchedule(schedule: Partial<Schedule>): Observable<Schedule> {
    return this.http.post<Schedule>(`${this.apiUrl}/`, schedule);
  }

  updateSchedule(id: number, schedule: Partial<Schedule>): Observable<Schedule> {
    return this.http.put<Schedule>(`${this.apiUrl}/${id}`, schedule);
  }

  deleteSchedule(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
