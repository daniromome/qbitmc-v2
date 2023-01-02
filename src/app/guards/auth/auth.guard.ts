import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router'
import { Store } from '@ngrx/store'
import { Observable, map } from 'rxjs'
import { selectIsSignedIn } from '@selectors/app'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  public constructor(
    private readonly store: Store,
    private readonly router: Router
  ) {}

  public canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const route = state.url.split('/')
    route.shift()
    route.splice(2, route.length - 2)
    route.push('auth')
    return this.store.select(selectIsSignedIn).pipe(
      map(isSignedIn => isSignedIn || this.router.createUrlTree(route))
    )
  }
}