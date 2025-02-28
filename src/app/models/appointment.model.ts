// import { Doctor } from './doctor.model';
// import { Patient } from './patient.model';
// import { Office } from './office.model';

// export class Appointment {
//   appointmentId: number;
//   patientId: number;
//   doctorId: number;
//   officeId: number;
//   status: string;
//   startTime: Date;

//   // Relații cu alte modele (opționale)
//   patient?: Patient;
//   doctor?: Doctor;
//   office?: Office;

//   constructor(
//     appointmentId: number,
//     patientId: number,
//     doctorId: number,
//     officeId: number,
//     status: string,
//     startTime: Date,
//     patient?: Patient,
//     doctor?: Doctor,
//     office?: Office
//   ) {
//     this.appointmentId = appointmentId;
//     this.patientId = patientId;
//     this.doctorId = doctorId;
//     this.officeId = officeId;
//     this.status = status;
//     this.startTime = startTime;

//     if (patient) this.patient = patient;
//     if (doctor) this.doctor = doctor;
//     if (office) this.office = office;
//   }
// }

// export class AppointmentResponse {
//   appointment: Appointment;

//   constructor(appointment: Appointment) {
//     this.appointment = appointment;
//   }
// }
import { Doctor } from './doctor.model';
import { Patient } from './patient.model';
import { Office } from './office.model';

export class Appointment {
  appointmentId: number;
  patientId: number;
  doctorId: number;
  officeId: number;
  status: string;
  startTime: string; // ✅ Modificat pentru a stoca doar ora
  endTime: string; // ✅ Adăugat endTime
  date: string; // ✅ Adăugat data

  // Relații cu alte modele (opționale)
  patient?: Patient;
  doctor?: Doctor;
  office?: Office;

  constructor(
    appointmentId: number,
    patientId: number,
    doctorId: number,
    officeId: number,
    status: string,
    startTime: string, // ✅ Timpul este acum doar ora (format string)
    endTime: string, // ✅ Ora de sfârșit
    date: string, // ✅ Data programării
    patient?: Patient,
    doctor?: Doctor,
    office?: Office
  ) {
    this.appointmentId = appointmentId;
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.officeId = officeId;
    this.status = status;
    this.startTime = startTime;
    this.endTime = endTime;
    this.date = date;

    if (patient) this.patient = patient;
    if (doctor) this.doctor = doctor;
    if (office) this.office = office;
  }
}

export class AppointmentResponse {
  appointment: Appointment;

  constructor(appointment: Appointment) {
    this.appointment = appointment;
  }
}
export class Matches {
  id: number;
  matches: string[];

  constructor(id: number, matches: string[]) {
    this.id = id;
    this.matches = matches;
  }
}
export class FilteredAppointmentsResponse {
  appointments: Appointment[];
  matches: Matches[];

  constructor(appointments: Appointment[], matches: Matches[]) {
    this.appointments = appointments;
    this.matches = matches;
  }
}
