import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [MatButtonModule, RouterModule],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound {
  authService = inject(AuthService);

  get homeLink(): string {
    if (this.authService.isAuthenticated()) {
      return '/admin';
    } else {
      return '/';
    }
  }
}
