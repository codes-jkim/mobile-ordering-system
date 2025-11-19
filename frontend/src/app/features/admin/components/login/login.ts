import { CommonModule } from '@angular/common';
import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    CommonModule,
    MatCardModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key >= '0' && event.key <= '9') {
      this.appendPassword(event.key);
    }

    if (event.key === 'Enter') {
      this.submitPassword();
    }

    if (event.key === 'Backspace') {
      this.password.update((current) => current.slice(0, -1));
    }
  }
  private router = inject(Router);
  private authService = inject(AuthService);

  password = signal('');
  overMaxLength = signal(false);
  readonly MAX_PASSWORD_LENGTH = 4;

  passwordDisplayCircles = computed(() => {
    const circles = Array(this.MAX_PASSWORD_LENGTH).fill(false);
    for (let i = 0; i < this.password().length; i++) {
      circles[i] = true;
    }
    return circles;
  });

  appendPassword(digit: string): void {
    if (this.password().length >= this.MAX_PASSWORD_LENGTH) {
      this.overMaxLength.set(true);
      setTimeout(() => this.overMaxLength.set(false), 200);
      return;
    }
    this.password.update((currentPassword) => currentPassword + digit);
  }

  clearPassword(): void {
    this.password.set('');
  }

  submitPassword(): void {
    this.authService.verifyPassword(this.password()).subscribe({
      next: (result) => {
        if (result) {
          this.router.navigate(['/admin']);
        }
      },
      error: () => {
        this.clearPassword();
      },
    });
  }
}
