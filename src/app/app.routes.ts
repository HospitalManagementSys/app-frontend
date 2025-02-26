import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './components/login/login.component';
import { RequestsComponent } from './components/requests/requests.component';
import { RequestComponent } from './components/request/request.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { authGuard } from '../guards/auth.guard';
import { AppointmentComponent } from './components/appointment/appointment.component';

export const routes: Routes = [
  { path: '', redirectTo: 'homepage', pathMatch: 'full' },
  { path: 'homepage', component: HomepageComponent },
  { path: 'patient/requests', component: RequestsComponent },
  { path: 'patient/requests/:id', component: RequestComponent },
  {
    path: 'patient/requests/:departmentId/doctor/:doctorId',
    component: AppointmentComponent,
  },
  { path: 'doctor/appointments', component: AppointmentsComponent },
  { path: 'homepage', component: HomepageComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'homepage' },
];
