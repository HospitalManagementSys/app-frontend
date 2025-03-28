export interface MedicalHistory {
  id?: number;
  patientId: number;
  diagnosis: string;
  data: string | Date;
}
