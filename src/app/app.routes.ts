import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './components/login/login.component';
import { RequestsComponent } from './components/requests/requests.component';
import { RequestComponent } from './components/request/request.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { authGuard } from '../guards/auth.guard';
import { AppointmentComponent } from './components/appointment/appointment.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'homepage', pathMatch: 'full' },
  { path: 'homepage', component: HomepageComponent },
  {
    path: 'patient/requests',
    component: RequestsComponent,
    canActivate: [authGuard],
    data: { requiredRole: 'Patient' },
  },
  {
    path: 'patient/requests/:id',
    component: RequestComponent,
    canActivate: [authGuard],
    data: { requiredRole: 'Patient' },
  },
  {
    path: 'patient/requests/:departmentId/doctor/:doctorId',
    component: AppointmentComponent,
    canActivate: [authGuard],
    data: { requiredRole: 'Patient' },
  },
  {
    path: 'doctor/appointments',
    component: AppointmentsComponent,
    canActivate: [authGuard],
    data: { requiredRole: 'Doctor' },
  },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  { path: '**', redirectTo: 'homepage' },
];
