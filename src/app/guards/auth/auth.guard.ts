import { Injectable } from '@angular/core'
import { CanActivate, Router, UrlTree } from '@angular/router'
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

  public canActivate(): Observable<boolean | UrlTree> {
    return this.store.select(selectIsSignedIn).pipe(
      map(isSignedIn => isSignedIn || this.router.createUrlTree(['auth']))
    )
  }
}
