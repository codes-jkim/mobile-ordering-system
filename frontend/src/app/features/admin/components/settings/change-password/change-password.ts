import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss',
})
export class ChangePassword {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);
  hideCurrentPassword = signal(true);
  hideNewPassword = signal(true);
  hideConfirmPassword = signal(true);

  passwordForm = this.fb.group(
    {
      currentPassword: ['', [Validators.required, Validators.maxLength(4)]],
      newPassword: [
        '',
        [Validators.required, Validators.maxLength(4), Validators.pattern(/^[0-9]*$/)],
      ],
      confirmPassword: ['', [Validators.required, Validators.maxLength(4)]],
    },
    {
      validators: (group) => {
        const currentPasswordControl = group.get('currentPassword');
        const newPasswordControl = group.get('newPassword');
        const confirmPasswordControl = group.get('confirmPassword');

        if (!currentPasswordControl || !newPasswordControl || !confirmPasswordControl) {
          return null;
        }

        if (
          confirmPasswordControl.value &&
          newPasswordControl.value !== confirmPasswordControl.value
        ) {
          confirmPasswordControl.setErrors({ mismatch: true });
        } else {
          if (confirmPasswordControl.hasError('mismatch')) {
            const errors = { ...confirmPasswordControl.errors };
            delete errors['mismatch'];
            confirmPasswordControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
          }
        }

        if (
          currentPasswordControl.value &&
          newPasswordControl.value &&
          currentPasswordControl.value === newPasswordControl.value
        ) {
          newPasswordControl.setErrors({
            ...newPasswordControl.errors,
            sameAsCurrent: true,
          });
        } else if (newPasswordControl.hasError('sameAsCurrent')) {
          const errors = { ...newPasswordControl.errors };
          delete errors['sameAsCurrent'];
          newPasswordControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
        }
        return null;
      },
      updateOn: 'change',
    },
  );

  changePassword(): void {
    const { currentPassword, newPassword } = this.passwordForm.value;
    if (!currentPassword || !newPassword) {
      return;
    }
    this.authService.changePassword(currentPassword, newPassword).subscribe({
      next: (response) => {
        this.snackBar.open(response.message, 'Close', { duration: 3000 });
        this.passwordForm.reset();
      },
      error: (error) => {
        this.snackBar.open(
          `Failed to change password: ${error.error?.message || error.message}`,
          'Close',
          {
            duration: 5000,
          },
        );
      },
    });
  }
}
