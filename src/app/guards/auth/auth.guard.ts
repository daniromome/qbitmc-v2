import { Injectable } from '@angular/core'
import { Router, UrlTree } from '@angular/router'
import { Observable, map, take } from 'rxjs'
import { OidcSecurityService } from 'angular-auth-oidc-client'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  public constructor(
    private readonly oidcSecurityService: OidcSecurityService,
    private readonly router: Router
  ) {}

  public canActivate(): Observable<boolean | UrlTree> {
    return this.oidcSecurityService.isAuthenticated$.pipe(
      take(1),
      map(({ isAuthenticated }) => isAuthenticated  || this.router.createUrlTree(['auth']))
    )
  }
}
