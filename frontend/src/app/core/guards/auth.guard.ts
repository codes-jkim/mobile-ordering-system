import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.checkAuth().pipe(
    take(1),
    map((admin) => {
      if (admin) {
        return true;
      } else {
        return router.createUrlTree(['/login']);
      }
    }),
  );
};
