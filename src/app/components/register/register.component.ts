import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-register',
  imports: [
    RouterModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        lastName: ['', Validators.required],
        firstName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      if (this.registerForm.get('password')?.errors?.['minlength']) {
        this.snackBarService.show(
          'Parola trebuie să aibă minim 6 caractere!',
          'error'
        );
        return;
      }

      if (this.passwordMismatch()) {
        this.snackBarService.show('Parolele introduse nu coincid!', 'error');
        return;
      }

      this.snackBarService.show('Toate câmpurile sunt obligatorii!', 'error');
      return;
    }

    const { confirmPassword, ...userData } = this.registerForm.value;

    this.authService.registerPatient(userData).subscribe({
      next: (response) => {
        this.snackBarService.show(
          'Înregistrare realizată cu succes! Vă rugăm să vă autentificați.',
          'success'
        );
        this.router.navigate(['/login']);
      },
      error: (error) => {
        if (error.status === 400) {
          this.snackBarService.show(
            'Acest email este deja înregistrat. Vă rugăm să utilizați alt email.',
            'error'
          );
        } else {
          this.snackBarService.show(
            'Eroare la înregistrare. Verificați datele și încercați din nou.',
            'error'
          );
        }
      },
    });
  }

  passwordMismatch(): boolean {
    return this.registerForm.hasError('passwordMismatch');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get email() {
    return this.registerForm.get('email');
  }
}
