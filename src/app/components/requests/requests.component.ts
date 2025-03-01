import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-requests',
  imports: [CommonModule],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css',
})
export class RequestsComponent implements OnInit {
  departments: Department[] = [];
  constructor(
    private departmentService: DepartmentService,
    private router: Router,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }
  loadDepartments(): void {
    this.departmentService.getPertinentDepartments().subscribe({
      next: (data: Department[]) => {
        this.departments = data;
      },
      error: (err) => {
        this.snackBarService.show(
          'Eroare la preluarea departamentelor!',
          'error'
        );
      },
    });
  }

  redirectToDepartment(departmentId: number): void {
    this.router.navigate([`patient/requests/${departmentId}`]);
  }
}
