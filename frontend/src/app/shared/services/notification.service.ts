import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  displayNotification(message: string, onDismiss?: () => void): void {
    const activeElement = document.activeElement as HTMLElement;
    const snackBarRef = this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
    snackBarRef.afterDismissed().subscribe(() => {
      if (onDismiss) {
        onDismiss();
      } else if (activeElement) {
        activeElement.focus();
      }
    });
  }
}
