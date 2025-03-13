import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../models/user.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private token: string | null = null;
  private role: string | null = null;
  private userId: string | null = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, password });
  }
  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
    this.setAuthState(token);
  }

  setAuthState(token: string): void {
    this.token = token;
    const decodedToken = this.decodeToken(token);
    this.role = decodedToken.role;
    this.userId = decodedToken.id;
  }

  loadAuthState(): Promise<void> {
    return new Promise((resolve) => {
      if (isPlatformBrowser(this.platformId)) {
        const token = localStorage.getItem('auth_token');
        if (token) {
          this.setAuthState(token);
        }
      }
      resolve();
    });
  }

  decodeToken(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  getToken(): string | null {
    const token = localStorage.getItem('auth_token');
    return token;
  }

  getRole(): string | null {
    return this.role;
  }

  getUserId(): string | null {
    return this.userId;
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.token = null;
  }
  private isTokenExpired(token: string): boolean {
    const decodedToken = this.decodeToken(token);
    if (!decodedToken.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
  }

  isAuthenticated(): boolean {
    if (!this.token) {
      return false;
    }
    return !this.isTokenExpired(this.token);
  }

  // registerPatient(userData: {
  //   email: string;
  //   password: string;
  //   firstName: string;
  //   lastName: string;
  // }): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/register`, userData);
  // }
  registerPatient(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((response) =>
        console.log('✅ Răspuns primit de la backend:', response)
      ),
      catchError((error) => {
        console.error('❌ Eroare la înregistrare:', error);
        return throwError(() => error);
      })
    );
  }
}
