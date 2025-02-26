import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Department } from '../models/department.model';
import { Doctor } from '../models/doctor.model';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private apiUrl = `${environment.apiUrl}/department`;

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', token);
    }

    return headers;
  }

  constructor(private http: HttpClient) {}

  // Retrieve all departments
  getExams(): Observable<Department[]> {
    const url = `${this.apiUrl}`;
    return this.http.get<Department[]>(url, { headers: this.getAuthHeaders() });
  }

  getPertinentDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  // Retrieve a single department by ID
  getDepartmentById(id: number): Observable<Department> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Department>(url, { headers: this.getAuthHeaders() });
  }

  //   // Retrieve departments by professor ID
  //   getExamsByProfessorId(professorId: number): Observable<Exam[]> {
  //     const url = `${this.apiUrl}/professor/${professorId}`;
  //     return this.http.get<Exam[]>(url, { headers: this.getAuthHeaders() });
  //   }

  //   // Retrieve exams by degree ID
  //   getExamsByDegreeId(degreeId: number): Observable<Exam[]> {
  //     const url = `${this.apiUrl}/degree/${degreeId}`;
  //     return this.http.get<Exam[]>(url, { headers: this.getAuthHeaders() });
  //   }

  getDoctorsByDepartment(departmentId: number): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/${departmentId}/doctors`);
  }
}
