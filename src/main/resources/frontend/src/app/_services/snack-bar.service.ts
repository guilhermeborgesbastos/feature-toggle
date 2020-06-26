import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  public show(isSuccess: boolean, message: string, action?: string, duration?: number) {
    this.snackBar.open(message, action, {
      duration: duration ? duration : 5000,
      panelClass: isSuccess ? 'success-dialog' : 'error-dialog',
    });
  }
}
