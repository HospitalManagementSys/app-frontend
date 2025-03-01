import { User } from './user.model';

export class Patient {
  patientId: number;
  userId: number;
  user?: User;

  constructor(patientId: number, userId: number, user?: User) {
    this.patientId = patientId;
    this.userId = userId;
    this.user = user;
  }
}
