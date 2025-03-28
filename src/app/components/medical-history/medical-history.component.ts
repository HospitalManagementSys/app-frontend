import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MedicalHistoryService } from '../../services/medical-history.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { MedicalHistory } from '../../models/medical-history.model';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-medical-history',
  imports: [CommonModule, FormsModule],
  templateUrl: './medical-history.component.html',
  styleUrl: './medical-history.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class MedicalHistoryComponent {
  history: MedicalHistory[] = [];
  form!: FormGroup;
  patientId!: number;
  newDiagnosis: string = '';
  diagnosisDate: string = new Date().toISOString().split('T')[0]; // valoare implicită

  constructor(
    private medicalHistoryService: MedicalHistoryService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MedicalHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { patientId: number }
  ) {}

  ngOnInit(): void {
    this.patientId = this.data.patientId;
    this.initForm();
    this.loadHistory();
  }

  initForm(): void {
    this.form = this.fb.group({
      diagnosis: ['', Validators.required],
      date: [new Date().toISOString().split('T')[0], Validators.required],
    });
  }

  loadHistory(): void {
    this.medicalHistoryService.getHistory(this.patientId).subscribe({
      next: (data) => (this.history = data),
      error: (err) => console.error('Eroare la încărcarea istoricului:', err),
    });
  }

  submit(): void {
    if (!this.newDiagnosis.trim() || !this.diagnosisDate) return;

    const entry = {
      patientId: this.patientId,
      diagnosis: this.newDiagnosis.trim(),
      data: this.diagnosisDate,
    };

    this.medicalHistoryService.addDiagnosis(entry).subscribe({
      next: (newEntry) => {
        this.history.push(newEntry);
        this.newDiagnosis = '';
        this.diagnosisDate = new Date().toISOString().split('T')[0]; // resetăm la azi
      },
      error: (err) => console.error('Eroare la adăugarea diagnosticului:', err),
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
