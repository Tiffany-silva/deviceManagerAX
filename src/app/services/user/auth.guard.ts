import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { resolve } from 'url';
import { reject } from 'q';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';

export class UserToken {}
export class Permissions {
  canActivate(user: UserToken, id: string): boolean {
    return true;
  }
}
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private permissions: Permissions, private currentUser: UserToken) { }

  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
    return this.permissions.canActivate(this.currentUser, route.params.id);
  }
}  
  

