import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department.model';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Doctor } from '../../models/doctor.model';
@Component({
  selector: 'app-request',
  imports: [CommonModule],
  templateUrl: './request.component.html',
  styleUrl: './request.component.css',
})
export class RequestComponent implements OnInit {
  id: number | null = null;
  department: Department | null = null;
  departmentId!: number;
  doctors: Doctor[] = [];

  constructor(
    private route: ActivatedRoute,
    private requestService: DepartmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadDepartment();
    this.route.paramMap.subscribe((params) => {
      this.departmentId = Number(params.get('id'));
      if (this.departmentId) {
        this.loadDoctors();
      }
    });
  }

  loadDepartment(): void {
    if (!this.id) return;
    this.requestService.getDepartmentById(this.id).subscribe({
      next: (data: Department) => {
        this.department = data;
        // this.trySetDates();
      },
      error: (err) => {
        console.error('Eroare la preluarea departamentului:', err);
        // this.snackBarService.show('Eroare la preluarea examenului!', 'error');
      },
    });
  }

  loadDoctors(): void {
    this.requestService.getDoctorsByDepartment(this.departmentId).subscribe({
      next: (data) => {
        this.doctors = data;
      },

      error: (err) => {
        console.error('❌ Eroare la preluarea doctorilor:', err);
      },
    });
  }

  selectDoctor(doctorId: number): void {
    this.router.navigate([`patient/requests/:departmentId/doctor/${doctorId}`]);
  }
}
