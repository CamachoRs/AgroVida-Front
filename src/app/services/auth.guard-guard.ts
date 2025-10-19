import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuardGuardOut: CanActivateFn = (route, state) => {
  const router = inject(Router);
  if (sessionStorage.getItem('access_token') && sessionStorage.getItem('expires_in')) {
    return true;
  } else {
    router.navigate(["/"]);
    return false;
  };
};

export const authGuardGuardIn: CanActivateFn = (route, state) => {
  const router = inject(Router);
  if (sessionStorage.getItem('access_token') && sessionStorage.getItem('expires_in')) {
    router.navigate(["/tasks"]);
    return false;
  } else {
    return true;
  };
};
