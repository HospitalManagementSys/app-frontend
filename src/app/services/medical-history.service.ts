import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { MedicalHistory } from '../models/medical-history.model';

@Injectable({
  providedIn: 'root',
})
export class MedicalHistoryService {
  private apiUrl = `${environment.apiUrl}/medical-history`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  addDiagnosis(entry: MedicalHistory): Observable<MedicalHistory> {
    return this.http.post<MedicalHistory>(this.apiUrl, entry, {
      headers: this.getAuthHeaders(),
    });
  }

  getHistory(patientId: number): Observable<MedicalHistory[]> {
    const url = `${this.apiUrl}/${patientId}`;
    return this.http.get<MedicalHistory[]>(url, {
      headers: this.getAuthHeaders(),
    });
  }
}
