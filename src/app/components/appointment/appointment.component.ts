import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../services/department.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Department } from '../../models/department.model';
import { CommonModule, DatePipe } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Doctor } from '../../models/doctor.model';
import { OfficeService } from '../../services/office.service';
import { Office } from '../../models/office.model';
import {
  Matches,
  Appointment,
  FilteredAppointmentsResponse,
} from '../../models/appointment.model';
import { AppointmentsService } from '../../services/appointment.service';
import { StatusTranslationService } from '../../services/translation.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { MedicalHistoryComponent } from '../medical-history/medical-history.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'app-appointment',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MedicalHistoryComponent,
    MatDialogModule,
  ],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css',
  providers: [DatePipe],
})
export class AppointmentComponent implements OnInit {
  id: number | null = null;
  patientId: number | null = null;
  departmentId: number | null = null;
  doctorId: number | null = null;
  departments: Department[] = [];
  offices: Office[] = [];
  appointmentsMatches: Matches[] = [];
  myAppointments: Appointment[] = [];
  officeId: number | null = null;
  total: Appointment[] = [];

  minTime: string = '08:00';
  maxTime: string = '22:00';

  minDate: Date = new Date();
  maxDate: Date = new Date();

  selectedDate: string | null = null;
  selectedTimeStart: string | null = null;
  selectedTimeEnd: string | null = null;
  selectedOfficeId: number | null = null;

  formDisabled = false;

  constructor(
    private requestService: DepartmentService,
    private route: ActivatedRoute,
    private router: Router,
    private officeService: OfficeService,
    private appointmentService: AppointmentsService,
    private statusTranslationService: StatusTranslationService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private userService: UserService,
    private snackBarService: SnackBarService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.id = Number(this.authService.getUserId());
    this.route.params.subscribe((params) => {
      this.departmentId = Number(params['departmentId']);
      this.doctorId = Number(params['doctorId']);
      if (this.id == null) {
        return;
      }
      this.userService.getPatientByUserId(this.id).subscribe({
        next: (patient) => {
          this.patientId = Number(patient.patientId);
        },
        error: (err) => console.error('❌ Eroare la preluarea patientId:', err),
      });

      this.loadDepartments();
      this.loadOffice();
      this.loadMyAppointments();
    });
  }

  loadDepartments(): void {
    this.requestService.getPertinentDepartments().subscribe({
      next: (data: Department[]) => {
        this.departments = data;
        // this.applyFilters();
      },
      error: (err) => {
        console.log('Eroare la preluarea departamentelor!', err);
        this.snackBarService.show('Eroare la preluarea examenelor!', 'error');
      },
    });
  }

  loadOffice(): void {
    this.officeService.getOffices().subscribe({
      next: (data: Office[]) => {
        this.offices = data.sort((a, b) => a.name.localeCompare(b.name));
      },
      error: (err) => {
        console.error('Eroare la preluarea salilor:', err);
        this.snackBarService.show('Eroare la preluarea salilor!', 'error');
      },
    });
  }

  loadMyAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (data: Appointment[]) => {
        this.myAppointments = data;
        this.total = [...data];

        this.myAppointments = data.map((appointment) => ({
          ...appointment,
          date: appointment.date,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
        }));
        this.total = data.map((appointment) => ({
          ...appointment,
          date: appointment.date,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
        }));

        this.sortAppointments();
        this.checkActiveAppointment();
      },
      error: (err) => {
        console.error('Eroare la preluarea programărilor:', err);
      },
    });
  }

  sortAppointments(): void {
    if (!this.myAppointments) return;

    const statusOrder = ['scheduled', 'pending', 'rejected', 'canceled'];

    this.myAppointments.sort((a, b) => {
      const statusComparison =
        statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
      if (statusComparison !== 0) {
        return statusComparison;
      }
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });
  }

  checkActiveAppointment(): void {
    const activeAppointment = this.myAppointments.find(
      (appointment) =>
        (appointment.status === 'pending' ||
          appointment.status === 'scheduled') &&
        appointment.appointmentId === this.id
    );

    if (activeAppointment) {
      this.setFormDisabledState(true);

      this.selectedDate = activeAppointment.date;
      this.selectedTimeStart = activeAppointment.startTime;
      this.selectedTimeEnd = activeAppointment.endTime;
      this.officeId = activeAppointment.officeId;
    }
  }

  goBack() {
    this.router.navigate(['patient/requests']);
  }

  getAppointments(): Appointment[] {
    if (
      !this.selectedDate ||
      !this.selectedTimeStart ||
      !this.selectedTimeEnd ||
      !this.doctorId
    ) {
      return [];
    }

    const selectedStart = new Date(
      `${this.selectedDate}T${this.selectedTimeStart}`
    );
    const selectedEnd = new Date(
      `${this.selectedDate}T${this.selectedTimeEnd}`
    );

    if (isNaN(selectedStart.getTime()) || isNaN(selectedEnd.getTime())) {
      this.snackBarService.show(
        'Data sau intervalul orar selectat este invalid!',
        'error'
      );
      return [];
    }

    const filteredAppointments = this.myAppointments.filter((appointment) => {
      if (
        !appointment.date ||
        !appointment.startTime ||
        !appointment.endTime ||
        !appointment.status ||
        !appointment.doctorId
      ) {
        return false;
      }

      const ignoredStatuses = ['ANULAT', 'CANCELED'];
      if (ignoredStatuses.includes(appointment.status.toUpperCase())) {
        return false;
      }

      if (Number(appointment.doctorId) !== Number(this.doctorId)) {
        return false;
      }

      const appointmentStart = new Date(
        `${appointment.date}T${appointment.startTime}`
      );
      const appointmentEnd = new Date(
        `${appointment.date}T${appointment.endTime}`
      );

      if (
        isNaN(appointmentStart.getTime()) ||
        isNaN(appointmentEnd.getTime())
      ) {
        console.error('❌ Invalid appointment times:', appointment);
        return false;
      }

      return (
        (selectedStart >= appointmentStart && selectedStart < appointmentEnd) || // Start selectat este în interval
        (selectedEnd > appointmentStart && selectedEnd <= appointmentEnd) || // End selectat este în interval
        (selectedStart <= appointmentStart && selectedEnd >= appointmentEnd) // Intervalul selectat acoperă complet programarea existentă
      );
    });

    return filteredAppointments;
  }

  getStatusTranslation(status: string): string {
    const translatedStatus =
      this.statusTranslationService.getStatusTranslation(status);
    return translatedStatus;
  }

  getAppointmentsForPatient(): Appointment[] {
    return this.total.filter(
      (app) =>
        Number(app.patientId) === Number(this.patientId) &&
        Number(app.doctorId) === Number(this.doctorId)
    );
  }

  //Form controls
  dateFormControl = new FormControl('', [
    Validators.required,
    this.futureDateValidator.bind(this),
  ]);
  timeStartFormControl = new FormControl('', [
    Validators.required,
    this.timeStartValidator.bind(this),
    this.timeOverlapValidator.bind(this),
  ]);
  timeEndFormControl = new FormControl('', [
    Validators.required,
    this.timeEndValidator.bind(this),
    this.timeOverlapValidator.bind(this),
  ]);
  officeFormControl = new FormControl('', [Validators.required]);

  onDateChange(newValue: string) {
    this.selectedDate = newValue;
    this.timeStartFormControl.updateValueAndValidity();
    this.timeEndFormControl.updateValueAndValidity();
  }
  onTimeStartChange(newValue: string) {
    this.selectedTimeStart = newValue;
    this.timeEndFormControl.updateValueAndValidity();
    this.timeStartFormControl.updateValueAndValidity();
  }

  onTimeEndChange(newValue: string) {
    this.selectedTimeEnd = newValue;
    this.timeStartFormControl.updateValueAndValidity();
    this.timeEndFormControl.updateValueAndValidity();
  }
  onOfficeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedOfficeId = Number(target.value);
  }

  // Validators
  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    const inputValue = control.value;
    if (inputValue && new Date(inputValue) <= new Date()) {
      return { invalidDate: true };
    }
    return null;
  }
  timeStartValidator(control: AbstractControl): ValidationErrors | null {
    const inputValue = control.value;
    if (
      inputValue &&
      this.selectedTimeEnd &&
      inputValue >= this.selectedTimeEnd
    ) {
      return { invalidTime: true };
    }
    return null;
  }
  timeEndValidator(control: AbstractControl): ValidationErrors | null {
    const inputValue = control.value;
    if (
      inputValue &&
      this.selectedTimeStart &&
      inputValue <= this.selectedTimeStart
    ) {
      return { invalidTime: true };
    }
    return null;
  }

  timeOverlapValidator(control: AbstractControl): ValidationErrors | null {
    if (
      !this.selectedDate ||
      !this.selectedTimeStart ||
      !this.selectedTimeEnd ||
      !this.myAppointments
    ) {
      return null;
    }

    // Creăm obiecte Date pentru ora selectată de start și end
    const selectedStart = new Date(
      `${this.selectedDate}T${this.selectedTimeStart}`
    );
    const selectedEnd = new Date(
      `${this.selectedDate}T${this.selectedTimeEnd}`
    );

    for (const appointment of this.myAppointments) {
      if (!appointment.date || !appointment.startTime || !appointment.endTime) {
        continue; // Evită programările invalide
      }

      const appointmentStart = new Date(
        `${appointment.date}T${appointment.startTime}`
      );
      const appointmentEnd = new Date(
        `${appointment.date}T${appointment.endTime}`
      );

      if (
        (selectedStart >= appointmentStart && selectedStart < appointmentEnd) || // Ora de start este în interiorul unei alte programări
        (selectedEnd > appointmentStart && selectedEnd <= appointmentEnd) || // Ora de end este în interiorul unei alte programări
        (selectedStart <= appointmentStart && selectedEnd >= appointmentEnd) // Intervalul selectat acoperă complet programarea existentă
      ) {
        return { overlappingAppointment: true };
      }
    }

    return null;
  }

  setFormDisabledState(isDisabled: boolean) {
    if (isDisabled) {
      this.formDisabled = true;
      this.dateFormControl.disable();
      this.timeStartFormControl.disable();
      this.timeEndFormControl.disable();
    } else {
      this.formDisabled = false;
      this.dateFormControl.enable();
      this.timeStartFormControl.enable();
      this.timeEndFormControl.enable();
    }
  }

  submitAppointment(): void {
    const appointments = this.getAppointmentsForPatient();
    const scheduledAppointments = appointments.filter(
      (appointment) => appointment.status === 'CONFIRMED'
    );
    const pendingAppointments = appointments.filter(
      (appointment) => appointment.status === 'PENDING'
    );

    if (scheduledAppointments.length > 0) {
      this.snackBarService.show(
        'Aveti deja o programare confirmata la acest medic.'
      );
      return;
    }

    if (pendingAppointments.length > 0) {
      this.snackBarService.show(
        'Aveti deja o programare in asteptare la acest medic.'
      );
      return;
    }

    if (
      this.dateFormControl.invalid ||
      this.timeStartFormControl.invalid ||
      this.timeEndFormControl.invalid ||
      this.officeFormControl.invalid
    ) {
      this.snackBarService.show('Verificati campurile si incercati din nou.');
      return;
    }

    const formattedDate = this.datePipe.transform(
      this.selectedDate,
      'yyyy-MM-dd'
    )!;
    const startTime = `${formattedDate}T${this.selectedTimeStart}:00`;
    const endTime = `${formattedDate}T${this.selectedTimeEnd}:00`;

    const newAppointment: Appointment = {
      appointmentId: 0,
      patientId: this.patientId!,
      doctorId: this.doctorId!,
      officeId: this.selectedOfficeId ?? 0,
      status: 'PENDING',
      startTime: this.selectedTimeStart + ':00',
      endTime: this.selectedTimeEnd + ':00',
      date: formattedDate,
    };

    this.appointmentService.createAppointment(newAppointment).subscribe({
      next: (data: Appointment) => {
        this.router.navigate(['/patient/requests']);
        this.snackBarService.show('Programare creata cu succes!');
      },
      error: (err) => {
        this.snackBarService.show(err.error.message);
      },
    });
  }

  cancelAppointment(appointmentId: number): void {
    const appointmentToCancel = this.myAppointments.find(
      (appointment) => appointment.appointmentId === appointmentId
    );

    if (!appointmentToCancel) {
      this.snackBarService.show(
        'Eroare: Programarea nu a fost găsită.',
        'error'
      );
      return;
    }

    if (confirm('Sigur doriți să anulați această programare?')) {
      const updatedAppointment: Appointment = {
        appointmentId: appointmentToCancel.appointmentId,
        patientId: appointmentToCancel.patientId, // Preia pacientul existent
        doctorId: appointmentToCancel.doctorId, // Preia doctorul existent
        officeId: appointmentToCancel.officeId, // Preia biroul existent
        status: 'Anulat', // Setează noul status
        startTime: appointmentToCancel.startTime, // Păstrează orele existente
        endTime: appointmentToCancel.endTime,
        date: appointmentToCancel.date, // Păstrează data programării
      };

      this.appointmentService
        .updateAppointment(appointmentId, updatedAppointment)
        .subscribe({
          next: () => {
            this.loadMyAppointments(); // Reîncarcă lista programărilor
            this.snackBarService.show('Programarea a fost anulată.', 'success');
          },
          error: () => {
            this.snackBarService.show(
              'Eroare la anularea programării.',
              'error'
            );
          },
        });

      // Resetare stări ale formularului
      this.setFormDisabledState(false);
      this.selectedDate = null;
      this.selectedTimeStart = null;
      this.selectedTimeEnd = null;
      this.selectedOfficeId = null;
    }
  }

  openMedicalHistoryDialog(): void {
    this.dialog.open(MedicalHistoryComponent, {
      width: '600px',
      data: { patientId: this.patientId },
    });
  }
}
