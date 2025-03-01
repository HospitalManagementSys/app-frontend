import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
//import { Appointment, FilteredAppointmentsResponse } from '../models/appointment.model';
import { Appointment } from '../models/appointment.model';
@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  private apiUrl = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', 'Bearer ${token)');
    }

    return headers;
  }

  // Retrieve all appointments
  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  // Retrieve a single appointment by ID
  getAppointmentById(id: number): Observable<Appointment> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Appointment>(url, { headers: this.getAuthHeaders() });
  }

  // Create a new appointment
  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment, {
      headers: this.getAuthHeaders(),
    });
  }

  // Update an appointment by ID
  updateAppointment(
    id: number,
    appointment: Appointment
  ): Observable<Appointment> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Appointment>(url, appointment, {
      headers: this.getAuthHeaders(),
    });
  }

  // Get appointments for a doctor
  getAppointmentsForDoctor(doctorId: number): Observable<Appointment[]> {
    const token = localStorage.getItem('auth_token');
    const url = `${this.apiUrl}/doctor/${doctorId}`;
    return this.http.get<Appointment[]>(url, {
      headers: this.getAuthHeaders(),
    });
  }

  // Get appointments for a patient
  getAppointmentsForPatient(patientId: number): Observable<Appointment[]> {
    const token = localStorage.getItem('auth_token');
    const url = `${this.apiUrl}/patient/${patientId}`;
    return this.http.get<Appointment[]>(url, {
      headers: this.getAuthHeaders(),
    });
  }
}
