import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);

  const storedUser = localStorage.getItem('currentUser');

  console.log("AuthGuard check value:", storedUser);

  if (storedUser && storedUser !== 'null') {
    return true;
  }

  return router.createUrlTree(['/login']);
};