import { Doctor } from './doctor.model';
import { Patient } from './patient.model';
import { Office } from './office.model';

export class Appointment {
  appointmentId: number;
  patientId: number;
  doctorId: number;
  officeId: number;
  status: string;
  startTime: Date;

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
    startTime: Date,
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
