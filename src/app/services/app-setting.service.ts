import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSetting } from '../models/app-setting.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppSettingService {
  private apiUrl = `${environment.apiUrl}/app-settings`;

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', token);
    }

    return headers;
  }

  constructor(private http: HttpClient) {}

  getSettings(): Observable<AppSetting[]> {
    const url = `${this.apiUrl}`;
    return this.http.get<AppSetting[]>(url, { headers: this.getAuthHeaders() });
  }

  // Update an appsetting by name
  updateAppSetting(
    name: string,
    appSetting: AppSetting
  ): Observable<AppSetting> {
    const url = `${this.apiUrl}/${name}`;
    return this.http.put<AppSetting>(url, appSetting, {
      headers: this.getAuthHeaders(),
    });
  }
}
