import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../services/department.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Department } from '../../models/department.model';
import { CommonModule } from '@angular/common';
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

@Component({
  selector: 'app-appointment',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css',
})
export class AppointmentComponent implements OnInit {
  id: number | null = null;
  patientId: number | null = null;
  departmentId: number | null = null;
  doctorId: number | null = null;
  departments: Department[] = [];
  offices: Office[] = [];
  selectedOfficeId: number | null = null;
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

  formDisabled = false;

  constructor(
    private requestService: DepartmentService,
    private route: ActivatedRoute,
    private router: Router,
    private officeService: OfficeService,
    private appointmentService: AppointmentsService,
    private statusTranslationService: StatusTranslationService,
    private authService: AuthService,
    private userService: UserService
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
          console.log('✅ ID pacient obținut:', this.patientId);
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
        // this.snackBarService.show('Eroare la preluarea examenelor!', 'error');
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
        //this.snackBarService.show('Eroare la preluarea salilor!', 'error');
      },
    });
  }
  loadMyAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (data: Appointment[]) => {
        this.myAppointments = data; // 🔥 Nu mai trebuie să extragi datele manual
        this.total = [...data];

        this.myAppointments = data.map((appointment) => ({
          ...appointment,
          date: appointment.date, // 🔥 Asigură-te că folosește direct date
          startTime: appointment.startTime, // 🔥 Folosește direct startTime
          endTime: appointment.endTime, // 🔥 Folosește direct endTime
        }));
        this.total = data.map((appointment) => ({
          ...appointment,
          date: appointment.date, // 🔥 Asigură-te că folosește direct date
          startTime: appointment.startTime, // 🔥 Folosește direct startTime
          endTime: appointment.endTime, // 🔥 Folosește direct endTime
        }));
        console.log('Appointments Loaded:', this.myAppointments);

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
      this.setFormDisabledState(true); // 🔥 Dezactivează formularul dacă există o programare activă

      this.selectedDate = activeAppointment.date;
      this.selectedTimeStart = activeAppointment.startTime;
      this.selectedTimeEnd = activeAppointment.endTime;
      this.officeId = activeAppointment.officeId;
    }
  }

  goBack() {
    this.router.navigate(['patient/requests']);
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
      !this.selectedTimeEnd //||
      //  !this.appointments
    ) {
      return null;
    }

    const selectedStart = new Date(this.selectedDate);
    const [startHour, startMinute] = this.selectedTimeStart
      .split(':')
      .map(Number);
    selectedStart.setHours(startHour, startMinute, 0, 0);

    const selectedEnd = new Date(this.selectedDate);
    const [endHour, endMinute] = this.selectedTimeEnd.split(':').map(Number);
    selectedEnd.setHours(endHour, endMinute, 0, 0);

    return null;
  }

  submit() {
    console.log('Programare creata cu succes');
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

  getAppointmentMatches(appointmentId: number): string[] {
    if (!this.appointmentsMatches) {
      return [];
    }

    const matches = this.appointmentsMatches.find(
      (match) => match.id === appointmentId
    );
    if (!matches) {
      return [];
    }

    const results: string[] = [];

    if (matches.matches.includes('Doctor')) {
      results.push('Doctorul are deja o programare în acest interval');
    }

    if (matches.matches.includes('Office')) {
      results.push('Biroul este deja ocupat');
    }

    if (matches.matches.includes('Patient')) {
      results.push('Pacientul are deja o programare în acest interval');
    }

    return results;
  }

  getAppointments(): Appointment[] {
    if (!this.selectedDate || !this.selectedTimeStart) {
      return [];
    }

    const selectedDateTimeString = `${this.selectedDate}T${this.selectedTimeStart}`;
    const selectedDateTime = new Date(selectedDateTimeString);

    if (isNaN(selectedDateTime.getTime())) {
      console.error('❌ Invalid Selected Date & Time:', selectedDateTimeString);
      return [];
    }

    return this.myAppointments.filter((appointment) => {
      if (!appointment.date || !appointment.startTime || !appointment.endTime) {
        console.warn('⚠️ Skipping invalid appointment:', appointment);
        return false;
      }

      const appointmentStartString = `${appointment.date}T${appointment.startTime}`;
      const appointmentEndString = `${appointment.date}T${appointment.endTime}`;

      const appointmentStart = new Date(appointmentStartString);
      const appointmentEnd = new Date(appointmentEndString);

      if (
        isNaN(appointmentStart.getTime()) ||
        isNaN(appointmentEnd.getTime())
      ) {
        console.error('❌ Invalid appointment times:', {
          appointmentStartString,
          appointmentEndString,
        });
        return false;
      }

      return (
        appointmentStart <= selectedDateTime &&
        selectedDateTime < appointmentEnd
      );
    });
  }

  getStatusTranslation(status: string): string {
    return this.statusTranslationService.getStatusTranslation(status);
  }
  getAppointmentsForPatient(): Appointment[] {
    console.log(this.patientId);
    return this.total.filter(
      (app) =>
        Number(app.patientId) === Number(this.patientId) &&
        Number(app.doctorId) === Number(this.doctorId)
    );
  }
}
