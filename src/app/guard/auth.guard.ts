import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    public router: Router
  ) {}

  public async canActivate() {
    if (!localStorage.getItem('_auth_token')) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
