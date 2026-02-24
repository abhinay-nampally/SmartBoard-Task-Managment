import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);
  const user = localStorage.getItem('loggedUser');

  if (user) {
    return true;   // allow access
  }

  router.navigate(['/login']);
  return false;    // block access
};