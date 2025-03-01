import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserResponse } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { SnackBarService } from '../../services/snack-bar.service';

type UserRole = 'doctor' | 'patient';

@Component({
  selector: 'app-header',
  imports: [RouterModule, HttpClientModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isNotLogin: boolean = true;
  userInfo: UserResponse | undefined;
  gettingUserData: boolean = false;
  role: UserRole | undefined;
  private routerSubscription!: Subscription;

  @Output() logoClicked = new EventEmitter<string>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.isNotLogin = this.router.url !== '/login';

      if (this.router.url === '/login') {
        this.userInfo = undefined;
      }

      const token = this.authService.getToken();

      if (token && !this.gettingUserData) {
        this.loadUserData();
      } else {
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  loadUserData(): void {
    this.gettingUserData = true;
    this.userService.getUserData().subscribe({
      next: (data: UserResponse) => {
        this.userInfo = data;
        if (data.user.role === 'Doctor') {
          this.role = 'doctor';
        } else if (data.user.role === 'Patient') {
          this.role = 'patient';
        }
        this.gettingUserData = false;
      },
      error: (err) => {
        this.snackBarService.show(
          'Eroare la preluarea datelor utilizatorului!',
          'error'
        );

        this.gettingUserData = false;
      },
    });
  }

  onLogoClick() {
    this.logoClicked.emit('slider');
  }
  login(): void {
    this.router.navigate(['/login']);
  }

  toggleAuth() {
    if (this.isAuthenticated()) {
      this.onLogout();
    } else {
      this.router.navigate(['/login']);
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  isAuthenticated() {
    return this.authService.isAuthenticated();
  }
}
