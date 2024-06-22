import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRoles = route.data['expectedRoles'] as string[];

  return authService.role$.pipe(
    map(role => {
      console.log('User Role:', role);
      console.log('Expected Roles:', expectedRoles);
      if (authService.isLoggedIn() && role && expectedRoles.includes(role.toLowerCase())) {
        console.log('Access granted for role:', role);
        return true;
      } else {
        console.log('Access denied for role:', role);
        router.navigate(['/']);
        return false;
      }
    }),
    catchError(() => {
      console.log('Error in guard');
      router.navigate(['/']);
      return of(false);
    })
  );
};
