import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environment';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const requiresCredentials = req.url.startsWith(environment.apiUrl);
  const request = requiresCredentials ? req.clone({ withCredentials: true }) : req;
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.isAuthenticated.set(false);
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
};
