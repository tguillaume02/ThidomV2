import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Scenario } from '@core/models/models';

@Injectable({ providedIn: 'root' })
export class ScenarioService {
  private readonly apiUrl = `${environment.apiUrl}/scenarios`;

  constructor(private http: HttpClient) {}

  getScenarios(): Observable<Scenario[]> {
    return this.http.get<Scenario[]>(`${this.apiUrl}/`);
  }

  getScenario(id: number): Observable<Scenario> {
    return this.http.get<Scenario>(`${this.apiUrl}/${id}`);
  }

  createScenario(scenario: Partial<Scenario>): Observable<Scenario> {
    return this.http.post<Scenario>(`${this.apiUrl}/`, scenario);
  }

  updateScenario(id: number, scenario: Partial<Scenario>): Observable<Scenario> {
    return this.http.put<Scenario>(`${this.apiUrl}/${id}`, scenario);
  }

  deleteScenario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  testScenario(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/test`, {});
  }
}
