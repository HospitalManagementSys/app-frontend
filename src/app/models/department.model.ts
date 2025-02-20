import { Office } from './office.model'; // Importă modelul Office

export class Department {
  departmentId: number;
  name: string;
  officeId: number;

  // Relație opțională cu Office
  office?: Office;

  constructor(
    departmentId: number,
    name: string,
    officeId: number,
    office?: Office
  ) {
    this.departmentId = departmentId;
    this.name = name;
    this.officeId = officeId;

    if (office) this.office = office;
  }
}

export class DepartmentResponse {
  department: Department;

  constructor(department: Department) {
    this.department = department;
  }
}
