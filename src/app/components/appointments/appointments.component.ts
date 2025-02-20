import { Component, OnInit } from '@angular/core';
import { AppointmentsService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserResponse } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-appointments',
  imports: [CommonModule],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css',
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  doctorId!: number;

  constructor(
    private appointmentService: AppointmentsService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadMyAppointments();
  }

  loadMyAppointments(): void {
    this.userService.getUserData().subscribe({
      next: (data: UserResponse) => {
        console.log('🔹 Date utilizator:', data);

        if (data.doctor) {
          const doctorId = data.doctor.doctorId; // ✅ Folosim doctorId, nu userId
          console.log('🔹 Doctor ID extras:', doctorId);

          this.appointmentService.getAppointmentsForDoctor(doctorId).subscribe({
            next: (appointments: Appointment[]) => {
              this.appointments = appointments;
              this.filteredAppointments = [...this.appointments];
            },
            error: (err) => {
              console.error('❌ Eroare la preluarea programărilor:', err);
            },
          });
        } else {
          console.error('❌ Utilizatorul nu este doctor!');
        }
      },
      error: (err) => {
        console.error('❌ Eroare la preluarea datelor utilizatorului:', err);
      },
    });
  }
}
