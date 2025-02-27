import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Office } from '../models/office.model';
@Injectable({
  providedIn: 'root',
})
export class OfficeService {
  private apiUrl = `${environment.apiUrl}/office`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', token);
    }

    return headers;
  }

  // Get all offices
  getOffices(): Observable<Office[]> {
    return this.http.get<Office[]>(this.apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  // Get a office by ID
  getOfficeById(officeId: number): Observable<Office> {
    const url = `${this.apiUrl}/${officeId}`;
    return this.http.get<Office>(url, { headers: this.getAuthHeaders() });
  }

  // Create a new office
  createOffice(classroom: Office): Observable<Office> {
    return this.http.post<Office>(this.apiUrl, classroom, {
      headers: this.getAuthHeaders(),
    });
  }

  // Update an existing office
  updateOffice(officeId: number, office: Office): Observable<Office> {
    const url = `${this.apiUrl}/${officeId}`;
    return this.http.put<Office>(url, office, {
      headers: this.getAuthHeaders(),
    });
  }

  // Delete a office
  deleteOffice(officeId: number): Observable<void> {
    const url = `${this.apiUrl}/${officeId}`;
    return this.http.delete<void>(url, { headers: this.getAuthHeaders() });
  }
}
