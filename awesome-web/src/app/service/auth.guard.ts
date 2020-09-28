import { UserAuthService } from 'src/app/service/user-auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { timestamp } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private userAuthService: UserAuthService,
    public router: Router
  ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.userAuthService.getUser();
        if (user) {
          resolve(true);
        } else {
          reject('No user logged in');
          this.router.navigateByUrl('/login');
        }
      } catch (error) {
        reject(error);
      }
    });
  }

}
