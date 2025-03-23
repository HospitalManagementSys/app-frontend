import { Component, Inject, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Appointment } from '../../models/appointment.model';
import { Patient } from '../../models/patient.model';
import { AuthService } from '../../services/auth.service';
import { AppointmentsService } from '../../services/appointment.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<ModalComponent>);
  appointment = this.data.appointment;
  patientId: number | null = null;
  id: number | null = null;
  patient: User | null = null;
  role: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public datas: { appointment: Appointment },
    private userService: UserService,
    private authService: AuthService,
    private appointmentService: AppointmentsService
  ) {
    this.appointment = this.datas.appointment;
  }
  ngOnInit(): void {
    this.loadPatient();
    this.role = this.authService.getRole();
  }

  loadPatient(): void {
    if (this.appointment.patientId) {
      this.userService.getUserById(this.appointment.patientId).subscribe(
        (user: User) => {
          this.patient = user;
        },
        (error) => {
          console.error('Eroare la preluarea pacientului:', error);
        }
      );
    }
  }

  onAccept(): void {
    this.dialogRef.close({ status: 'Programat' });
  }

  onPending(): void {
    this.dialogRef.close({ status: 'In asteptare' });
  }

  onReject(): void {
    this.dialogRef.close({ status: 'Respins' });
  }

  getTime(date: Date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onDeleteAppointment(): void {
    if (confirm('Sigur vrei să ștergi această programare?')) {
      this.appointmentService
        .deleteAppointment(this.appointment.appointmentId)
        .subscribe(
          () => {
            this.dialogRef.close({ deleted: true });
          },
          (error) => {
            console.error('❌ Eroare la ștergerea programării:', error);
          }
        );
    }
  }
}
