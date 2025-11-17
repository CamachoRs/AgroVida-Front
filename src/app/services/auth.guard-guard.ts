import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuardGuardOut: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  if (!sessionStorage.getItem("access_token") && !sessionStorage.getItem("expires_in")) {
    router.navigate(["/"]);
    return false;
  };
  authService.autoRefresh();
  return true;
};

export const authGuardGuardIn: CanActivateFn = (route, state) => {
  const router = inject(Router);
  if (sessionStorage.getItem("access_token") && sessionStorage.getItem("expires_in")) {
    router.navigate(["/tasks"]);
    return false;
  };
  return true;
};

export const authGuardRole: CanActivateFn = (route, state) => {
  const router = inject(Router);
  if (sessionStorage.getItem("role") === "empleado") {
    if (route.url[0].path === "users" || route.url[0].path === "inventory") {
      router.navigate(["/."]);
      return false;
    };
  };
  return true;
};