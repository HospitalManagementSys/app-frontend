import { Component, OnInit } from '@angular/core';
import { AppointmentsService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment.model';
import { StatusTranslationService } from '../../services/translation.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-admin',
  imports: [FormsModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  appointments: Appointment[] = [];
  errorMessage: string = '';
  statusFilter: string = '';
  filteredAppointments: Appointment[] = [];
  dateFilter: string | null = null;

  constructor(
    private appointmentService: AppointmentsService,
    private statusTranslationService: StatusTranslationService,
    private dialog: MatDialog,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }
  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.filteredAppointments = [...this.appointments];
      },
      error: (error) => {
        console.error('❌ Error loading appointments:', error);
        this.errorMessage = 'A apărut o eroare la încărcarea programărilor.';
      },
    });
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
  getStatusTranslation(status: string): string {
    const translatedStatus =
      this.statusTranslationService.getStatusTranslation(status);
    return translatedStatus;
  }

  openDialog(appointment: Appointment): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: { appointment },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.deleted) {
          this.appointments = this.appointments.filter(
            (a) => a.appointmentId !== appointment.appointmentId
          );
        } else {
          this.updateStatus(appointment, result.status);
        }
      }
    });
  }

  updateStatus(appointment: Appointment, status: string) {
    appointment.status = status;

    this.appointmentService
      .updateAppointment(appointment.appointmentId, appointment)
      .subscribe(() => {
        this.snackBarService.show('Programarea a fost stearsa!', 'success');
      });
  }
}
