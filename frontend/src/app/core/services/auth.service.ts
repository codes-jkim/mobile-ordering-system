import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environment';
import { Admin } from '../../shared/models/admin.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/admin';
  private http = inject(HttpClient);
  private router = inject(Router);

  isAuthenticated = signal<boolean>(false);
  loginError = signal<string | null>(null);

  verifyPassword(password: string): Observable<{ data: Admin }> {
    return this.http
      .post<{ data: Admin }>(`${this.apiUrl}`, { password }, { withCredentials: true })
      .pipe(
        tap((response) => {
          if (response.data._id) {
            this.isAuthenticated.set(true);
            this.loginError.set(null);
          }
        }),
        catchError((error) => {
          this.loginError.set(error.error?.message || 'Authentication failed');
          return throwError(() => error);
        }),
      );
  }

  logout(): void {
    this.http.get(`${this.apiUrl}/logout`).subscribe(() => {
      this.isAuthenticated.set(false);
      this.router.navigate(['/']);
    });
  }

  public checkAuth(): Observable<Admin | null> {
    return this.http.get<Admin>(`${this.apiUrl}/info`).pipe(
      tap((admin) => {
        if (admin.username) {
          this.isAuthenticated.set(true);
        }
      }),
      catchError(() => {
        this.isAuthenticated.set(false);
        return of(null);
      }),
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/change-password`, {
      currentPassword,
      newPassword,
    });
  }
}
