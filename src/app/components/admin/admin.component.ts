import { Component, OnInit } from '@angular/core';
import { AppointmentsService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment.model';
import { StatusTranslationService } from '../../services/translation.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { SnackBarService } from '../../services/snack-bar.service';
import { AppSettingService } from '../../services/app-setting.service';
import { AppSetting } from '../../models/app-setting.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin',
  imports: [FormsModule, CommonModule, MatButtonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  appointments: Appointment[] = [];
  errorMessage: string = '';
  statusFilter: string = '';
  filteredAppointments: Appointment[] = [];
  dateFilter: string | null = null;
  isEmailEnabled: boolean = false;

  constructor(
    private appointmentService: AppointmentsService,
    private statusTranslationService: StatusTranslationService,
    private dialog: MatDialog,
    private snackBarService: SnackBarService,
    private appSettingService: AppSettingService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
    this.loadInitialSettings();
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

  loadInitialSettings(): void {
    this.appSettingService.getSettings().subscribe({
      next: (response: AppSetting[]) => {
        const sendEmailsSetting = response.find(
          (setting) => setting.name === 'sendEmails'
        );
        if (sendEmailsSetting && sendEmailsSetting.value !== undefined) {
          this.isEmailEnabled = sendEmailsSetting.value;
        } else {
          this.snackBarService.show(
            'Setarea "sendEmails" nu a fost găsită sau este invalidă!',
            'error'
          );
        }
      },
      error: () => {
        this.snackBarService.show('Eroare la preluarea setărilor!', 'error');
      },
    });
  }

  toggleEmailSetting(): void {
    const updatedSetting = !this.isEmailEnabled;
    this.appSettingService
      .updateAppSetting('sendEmails', {
        name: 'sendEmails',
        value: updatedSetting,
      })
      .subscribe({
        next: () => {
          this.isEmailEnabled = updatedSetting;
          const message = updatedSetting
            ? 'Trimiterea de emailuri a fost activată!'
            : 'Trimiterea de emailuri a fost dezactivată!';
          this.snackBarService.show(message, 'success');
        },
        error: () => {
          this.snackBarService.show(
            'Eroare la actualizarea setărilor!',
            'error'
          );
        },
      });
  }
}
