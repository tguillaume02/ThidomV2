import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { User } from '@core/models/models';

export interface UserCreateRequest {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

export interface UserUpdateRequest {
  email?: string;
  full_name?: string;
  password?: string;
  is_active?: boolean;
  is_admin?: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  create(data: UserCreateRequest): Observable<User> {
    return this.http.post<User>(this.apiUrl, data);
  }

  update(id: number, data: UserUpdateRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
