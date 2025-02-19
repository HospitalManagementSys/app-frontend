import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../app/services/auth.service';
@Injectable({
  providedIn: 'root',
})
export class redirectGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    const role = this.authService.getRole();

    if (isAuthenticated) {
      if (role === 'Patient') {
        this.router.navigate(['/patient/requests']);
      } else if (role === 'Doctor') {
        this.router.navigate(['/doctor/appointments']);
      }
    } else {
      this.router.navigate(['/login']);
    }

    return false;
  }
}
