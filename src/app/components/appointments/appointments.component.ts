import { Component, OnInit } from '@angular/core';
import { AppointmentsService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserResponse } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { SnackBarService } from '../../services/snack-bar.service';
import { ActivatedRoute } from '@angular/router';
import { StatusTranslationService } from '../../services/translation.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointments',
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css',
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  doctorId!: number;
  id: number | null = null;
  patientId: number | null = null;
  statusFilter: string = '';
  dateFilter: string | null = null;

  constructor(
    private appointmentService: AppointmentsService,
    private authService: AuthService,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBarService: SnackBarService,
    private route: ActivatedRoute,
    private statusTranslationService: StatusTranslationService
  ) {}

  ngOnInit(): void {
    this.loadMyAppointments();
  }

  openDialog(appointment: Appointment): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: { appointment },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateStatus(appointment, result.status);
      }
    });
  }

  loadMyAppointments(): void {
    this.userService.getUserData().subscribe({
      next: (data: UserResponse) => {
        if (data.doctor) {
          const doctorId = data.doctor.doctorId;

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

  updateStatus(appointment: Appointment, status: string) {
    appointment.status = status;

    this.appointmentService
      .updateAppointment(appointment.appointmentId, appointment)
      .subscribe(
        () => {
          this.snackBarService.show('Am modificat cererea!', 'success');
        },
        () => {
          this.snackBarService.show('Nu am modificat cererea!', 'error');
        }
      );
  }

  getStatusTranslation(status: string): string {
    const translatedStatus =
      this.statusTranslationService.getStatusTranslation(status);
    return translatedStatus;
  }

  applyFilters(): void {
    this.filteredAppointments = this.appointments.filter((appointment) => {
      console.log(this.getStatusTranslation(this.statusFilter).toLowerCase());
      const matchesStatus =
        this.statusFilter === '' ||
        appointment.status.toLowerCase() ===
          this.getStatusTranslation(this.statusFilter).toLowerCase();

      const matchesDate = this.dateFilter
        ? new Date(appointment.date).toISOString().split('T')[0] ===
          this.dateFilter
        : true;

      return matchesStatus && matchesDate;
    });
  }

  onStatusFilterChange(event: Event): void {
    this.statusFilter = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  onDateFilterChange(event: string | null): void {
    this.dateFilter = event;
    this.applyFilters();
  }
}
