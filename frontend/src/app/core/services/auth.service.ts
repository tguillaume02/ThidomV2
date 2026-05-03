import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '@environments/environment';
import { User, Token } from '@core/models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUser();
  }

  get token(): string | null {
    return localStorage.getItem('thidom_token');
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  login(username: string, password: string): Observable<Token> {
    return this.http.post<Token>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(token => {
        localStorage.setItem('thidom_token', token.access_token);
        this.loadUser();
      })
    );
  }

  logout(): void {
    localStorage.removeItem('thidom_token');
    this.currentUserSubject.next(null);
  }

  private loadUser(): void {
    if (this.token) {
      this.http.get<User>(`${this.apiUrl}/me`).subscribe({
        next: user => this.currentUserSubject.next(user),
        error: () => {
          this.currentUserSubject.next(null);
        }
      });
    }
  }
}
