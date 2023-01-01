import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router'
import { Store } from '@ngrx/store'
import { selectIsSignedIn } from '@store/app/app.selectors'
import { map, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard implements CanActivate {
  public constructor(
    private readonly store: Store,
    private readonly router: Router
  ) {}

  public canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const route = state.url.split('/')
    route.shift()
    route.pop()
    return this.store.select(selectIsSignedIn).pipe(
      map(isSignedIn => !isSignedIn || this.router.createUrlTree(route))
    )
  }
}
