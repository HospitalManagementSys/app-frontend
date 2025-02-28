import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StatusTranslationService {
  // 🔹 Dicționar pentru traducerea statusurilor
  private statusTranslation: { [key: string]: string } = {
    scheduled: 'Programat',
    pending: 'În așteptare',
    rejected: 'Respins',
    confirmed: 'Programat',
  };

  constructor() {}

  /**
   * 🔹 Obține traducerea pentru un status
   * @param status - Statusul programării (ex: "pending")
   * @returns - Traducerea în limba română (ex: "În așteptare")
   */
  getStatusTranslation(status: string): string {
    return this.statusTranslation[status.toLowerCase()] || status;
  }
}
