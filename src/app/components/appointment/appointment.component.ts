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

@Component({
  selector: 'app-appointment',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css',
})
export class AppointmentComponent implements OnInit {
  id: number | null = null;
  departments: Department[] = [];
  offices: Office[] = [];
  selectedOfficeId: number | null = null;

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
    private officeService: OfficeService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadDepartments();
    this.loadOffice();
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

    // for (const appointment of this.appointments) {
    //   const appointmentStart = new Date(appointment.startTime);
    //   const appointmentEnd = new Date(appointment.endTime);

    //   if (
    //     (selectedStart >= appointmentStart && selectedStart < appointmentEnd) ||
    //     (selectedEnd > appointmentStart && selectedEnd <= appointmentEnd) ||
    //     (selectedStart <= appointmentStart && selectedEnd >= appointmentEnd)
    //   ) {
    //     return { timeOverlap: true };
    //   }
    // }

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
}
