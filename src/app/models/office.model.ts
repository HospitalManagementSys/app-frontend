import { Department } from './department.model';

export class Office {
  officeId: number;
  name: string;
  departmentId: number;

  // Relație opțională cu Departamentul
  department?: Department;

  constructor(
    officeId: number,
    name: string,
    departmentId: number,
    department?: Department
  ) {
    this.officeId = officeId;
    this.name = name;
    this.departmentId = departmentId;

    if (department) this.department = department;
  }
}

export class OfficeResponse {
  office: Office;

  constructor(office: Office) {
    this.office = office;
  }
}
