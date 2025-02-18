import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
// import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
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

  constructor(private router: Router) {}

  ngOnInit(): void {
    //this.googleService.getFirebaseUserData();
  }

  /*onLogin(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        const role = this.authService.getRole();

        if (response.isAdmin) {
          this.router.navigate(['/admin']);
        } else if (response.role === 'professor') {
          this.router.navigate(['/professor/appointments']);
        } else if (response.role === 'student') {
          this.router.navigate(['/student/exams']);
        } else {
          this.errorMessage = 'Rol necunoscut';
        }
      },
      error: (err) => {
        //   this.snackBarService.show('Eroare login!', 'error');
        this.errorMessage = 'Email sau parola invalida!';
      },
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onContinue(): void {
    const role = this.authService.getRole();

    if (role === 'professor') {
      this.router.navigate(['/professor/appointments']);
    } else if (role === 'student') {
      this.router.navigate(['/student/exams']);
    } else if (role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.errorMessage = 'Rol necunoscut';
    }
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }*/
}
