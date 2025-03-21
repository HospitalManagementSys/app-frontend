import { User } from './user.model';

export class Doctor {
  doctorId: number;
  userId: number;
  departmentId: number;
  user?: User;

  constructor(
    doctorId: number,
    userId: number,
    departmentId: number,
    user?: User
  ) {
    this.doctorId = doctorId;
    this.userId = userId;
    this.departmentId = departmentId;
    if (user) this.user = user;
  }
}
