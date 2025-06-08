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
        //'https://mhospital.ro/wp-content/uploads/2022/04/pachet-M-Care-1.jpg',
        'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Bine ai venit la MedicaNova',
      description:
        'Echipa noastră de specialiști îți oferă tratamente personalizate, într-un mediu sigur și modern.',
    },
    {
      imageUrl:
        'https://images.unsplash.com/photo-1513224502586-d1e602410265?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Servicii medicale avansate',
      description:
        'Investim constant în echipamente de top și în cele mai noi metode de diagnostic și tratament.',
    },
    {
      imageUrl:
        'https://images.unsplash.com/photo-1504813184591-01572f98c85f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
    if (this.authService.isAuthenticated()) {
      this.loadPatientAppointments();
      this.loadDoctorAppointments();

      this.userService.getUserData().subscribe({
        next: (data: UserResponse) => {
          if (data.patient) {
            this.userRole = 'Patient';
          } else if (data.doctor) {
            this.userRole = 'Doctor';
          } else if (data.user.role === 'Admin') {
            this.userRole = 'Admin';
          }
        },
        error: (err) => {
          console.error('❌ Eroare la preluarea datelor utilizatorului:', err);
        },
      });
    }
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
                console.error('❌ Eroare la preluarea programărilor:', err);
              },
            });
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
  showAll() {
    this.router.navigate(['/admin']);
  }

  isPatient(): boolean {
    return this.authService.isAuthenticated() && this.userRole === 'Patient';
  }
  isDoctor(): boolean {
    return this.authService.isAuthenticated() && this.userRole === 'Doctor';
  }
  isAdmin(): boolean {
    return this.authService.isAuthenticated() && this.userRole === 'Admin';
  }
  getStatusTranslation(status: string): string {
    const translatedStatus =
      this.statusTranslationService.getStatusTranslation(status);
    return translatedStatus;
  }
}
