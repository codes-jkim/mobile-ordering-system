import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core/primitives/di';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../../shared/services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const notificationService = inject(NotificationService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }

      switch (error.status) {
        case 400:
          console.error('Bad request:', error.error);
          break;
        case 404:
          console.error('Resource not found:', error.error);
          break;
        case 409:
          console.error('Conflict:', error.error);
          break;
        case 500:
          console.error('Server error:', error.error);
          break;
      }

      notificationService.displayNotification(errorMessage);
      return throwError(() => error);
    }),
  );
};
