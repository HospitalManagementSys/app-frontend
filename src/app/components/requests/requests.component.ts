import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }
  loadDepartments(): void {
    this.departmentService.getPertinentDepartments().subscribe({
      next: (data: Department[]) => {
        this.departments = data;
        // this.applyFilters();
      },
      error: (err) => {
        console.log('Eroare la preluarea departamentelor!', 'error');
        // this.snackBarService.show('Eroare la preluarea examenelor!', 'error');
      },
    });
  }

  redirectToDepartment(departmentId: number): void {
    this.router.navigate([`patient/requests/${departmentId}`]);
  }
}
