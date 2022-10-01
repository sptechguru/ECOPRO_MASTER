import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageAccessorService } from './localstorage-accessor.service';

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private localStorage: StorageAccessorService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = this.localStorage.fetchToken();
    if (token) {
      if (state.url == '/auth/login') {
        this.router.navigate(['/admin/dashboard']);
        return false;
      } 
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.canActivate(route, state);
  }
}
