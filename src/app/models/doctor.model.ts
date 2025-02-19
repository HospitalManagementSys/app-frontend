export class Doctor {
  doctorId: number;
  userId: number;
  departmentId: number;

  constructor(doctorId: number, userId: number, departmentId: number) {
    this.doctorId = doctorId;
    this.userId = userId;
    this.departmentId = departmentId;
  }
}
