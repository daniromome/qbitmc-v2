import { Injectable } from '@angular/core'
import { Router, UrlTree } from '@angular/router'
import { Observable, map, take } from 'rxjs'
import { Store } from '@ngrx/store'
import { selectIsSignedIn } from '@store/app/app.selectors'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
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
