import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    HttpClientModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  users: any = [];
  isServer = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    //this.googleService.getFirebaseUserData();
  }

  onLogin(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        const role = this.authService.getRole();

        if (response.role === 'Doctor') {
          this.router.navigate(['/doctor/appointments']);
        } else if (response.role === 'Patient') {
          this.router.navigate(['/patient/requests']);
        } else {
          this.errorMessage = 'Rol necunoscut';
        }
      },
      error: () => {
        this.errorMessage = 'Email sau parola invalida!';
      },
    });
  }

  onContinue(): void {
    const role = this.authService.getRole();

    if (role === 'Doctor') {
      this.router.navigate(['/doctor/appointments']);
    } else if (role === 'Patient') {
      this.router.navigate(['/patient/requests']);
    } else {
      this.errorMessage = 'Rol necunoscut';
    }
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
