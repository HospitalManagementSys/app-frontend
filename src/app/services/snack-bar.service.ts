import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  /**
   * Show a snack bar message.
   * @param message The message to display.
   * @param action The action button label (optional, default is 'Inchide').
   * @param duration The duration in milliseconds (optional, default is 10000ms).
   */
  show(
    message: string,
    type: 'success' | 'error' = 'success',
    duration: number = 3000,
    action: string = 'Inchide'
  ): void {
    const panelClass =
      type === 'success' ? 'snack-bar-success' : 'snack-bar-error';

    this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [panelClass],
    });
  }
}
