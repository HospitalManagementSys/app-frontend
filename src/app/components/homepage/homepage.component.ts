import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectorRef,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../models/user.model';
import { AppointmentsService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment.model';
import { AuthService } from '../../services/auth.service';
import { StatusTranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-homepage',
  imports: [RouterModule, CommonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent implements OnInit {
  appointments: Appointment[] = [];
  userRole: string | null = null;

  slides = [
    {
      imageUrl:
        'https://mhospital.ro/wp-content/uploads/2022/04/pachet-M-Care-1.jpg',
      title: 'Bine ai venit la MedicaNova',
      description:
        'Echipa noastră de specialiști îți oferă tratamente personalizate, într-un mediu sigur și modern.',
    },
    {
      imageUrl: 'https://mhospital.ro/wp-content/uploads/2022/04/gineco21.jpg',
      title: 'Servicii medicale avansate',
      description:
        'Investim constant în echipamente de top și în cele mai noi metode de diagnostic și tratament.',
    },
    {
      imageUrl:
        'https://mhospital.ro/wp-content/uploads/2021/10/m-hospital-m-laborator-diagnostic-800x455-1.jpg',
      title: 'Profesioniști dedicați sănătății tale',
      description:
        'Fiecare pacient este unic. Suntem aici să îți oferim cele mai bune soluții pentru sănătatea ta.',
    },
  ];

  currentSlide = 0;
  slideInterval: any;

  ngOnInit() {
    this.startAutoSlide();
    document.addEventListener('slider', this.showSlider.bind(this));
    this.loadPatientAppointments();
    this.loadDoctorAppointments();
    this.userService.getUserData().subscribe({
      next: (data: UserResponse) => {
        if (data.patient) {
          this.userRole = 'Patient';
        } else if (data.doctor) {
          this.userRole = 'Doctor';
        }
      },
      error: (err) => {
        console.error('❌ Eroare la preluarea datelor utilizatorului:', err);
      },
    });
  }

  startAutoSlide() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }
  constructor(
    private cdRef: ChangeDetectorRef,
    private userService: UserService,
    private appointmentService: AppointmentsService,
    private router: Router,
    private authService: AuthService,
    private statusTranslationService: StatusTranslationService
  ) {}

  @Input() activeSection: string = 'slider';
  @Output() sectionChange = new EventEmitter<string>();

  showContent(sectionId: string): void {
    this.activeSection = sectionId;
    this.cdRef.detectChanges();
    this.sectionChange.emit(sectionId);
  }

  ngOnDestroy() {
    document.removeEventListener('slider', this.showSlider.bind(this));
  }

  showSlider() {
    this.activeSection = 'slider';
  }

  loadPatientAppointments(): void {
    this.userService.getUserData().subscribe({
      next: (data: UserResponse) => {
        if (data.patient) {
          const patientId = data.patient.patientId;

          this.appointmentService
            .getAppointmentsForPatient(patientId)
            .subscribe({
              next: (appointments: Appointment[]) => {
                this.appointments = appointments;
              },
              error: (err) => {
                // console.error('❌ Eroare la preluarea programărilor:', err);
              },
            });
        } else {
          // console.error('❌ Utilizatorul nu este doctor!');
        }
      },
      error: (err) => {
        console.error('❌ Eroare la preluarea datelor utilizatorului:', err);
      },
    });
  }
  loadDoctorAppointments(): void {
    this.userService.getUserData().subscribe({
      next: (data: UserResponse) => {
        if (data.doctor) {
          const doctorId = data.doctor.doctorId;

          this.appointmentService.getAppointmentsForDoctor(doctorId).subscribe({
            next: (appointments: Appointment[]) => {
              this.appointments = appointments;
            },
            error: (err) => {
              console.error('❌ Eroare la preluarea programărilor:', err);
            },
          });
        } else {
        }
      },
      error: (err) => {},
    });
  }

  showDepartments() {
    this.router.navigate(['/patient/requests']);
  }
  showAppointments() {
    this.router.navigate(['/doctor/appointments']);
  }

  isPatient(): boolean {
    return this.authService.isAuthenticated() && this.userRole === 'Patient';
  }
  isDoctor(): boolean {
    return this.authService.isAuthenticated() && this.userRole === 'Doctor';
  }
  getStatusTranslation(status: string): string {
    const translatedStatus =
      this.statusTranslationService.getStatusTranslation(status);
    return translatedStatus;
  }
}
