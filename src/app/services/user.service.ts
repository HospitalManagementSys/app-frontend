import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { User, UserResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', 'Bearer ${token)');
    }

    return headers;
  }

  // Retrieve all users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  // Retrieve a single user by ID
  getUserById(id: number): Observable<User> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<User>(url, { headers: this.getAuthHeaders() });
  }

  // Get user data
  getUserData(): Observable<UserResponse> {
    const token = localStorage.getItem('auth_token');
    console.log('Token trimis:', token);
    const url = `${this.apiUrl}/data`;
    return this.http.get<UserResponse>(url, { headers: this.getAuthHeaders() });
  }
}
