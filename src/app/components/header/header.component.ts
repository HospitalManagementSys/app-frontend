import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserResponse } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';

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
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.isNotLogin = this.router.url !== '/login';

      if (this.router.url === '/login') {
        this.userInfo = undefined;
      }

      const token = this.authService.getToken(); // ✅ Preia token-ul înainte

      if (token && !this.gettingUserData) {
        this.loadUserData();
      } else {
        // console.warn(
        //   'Token invalid sau utilizator neautentificat, loadUserData() nu va fi apelată.'
        // );
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe(); // ✅ Oprește subscribe-ul când componenta este distrusă
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
        console.error('Eroare la preluarea datelor utilizatorului:', err);
        // this.snackBarService.show(
        //   'Eroare la preluarea datelor utilizatorului!',
        //   'error'
        // );
        this.gettingUserData = false;
      },
    });
  }

  onLogoClick() {
    this.logoClicked.emit('slider'); // Emitere eveniment către homepage
  }
  login(): void {
    this.router.navigate(['/login']);
  }
}
