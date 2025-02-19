import { Doctor } from './doctor.model';
import { Patient } from './patient.model';

export class User {
  userId: number;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: 'Doctor' | 'Patient';

  constructor(
    userId: number,
    email: string,
    firstName: string,
    lastName: string,
    role: 'Doctor' | 'Patient',
    password?: string
  ) {
    this.userId = userId;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
  }
}

export class UserResponse {
  user: User;
  doctor?: Doctor;
  patient?: Patient;

  constructor(user: User, doctor?: Doctor, patient?: Patient) {
    this.user = user;
    this.doctor = doctor;
    this.patient = patient;
  }
}
