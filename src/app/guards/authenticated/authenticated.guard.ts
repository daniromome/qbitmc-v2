import { Injectable } from '@angular/core'
import { Router, UrlTree } from '@angular/router'
import { Store } from '@ngrx/store'
import { selectIsSignedIn } from '@store/app/app.selectors'
import { map, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard  {
  public constructor(
    private readonly store: Store,
    private readonly router: Router
  ) {}

  public canActivate(): Observable<boolean | UrlTree> {
    return this.store.select(selectIsSignedIn).pipe(
      map(isSignedIn => !isSignedIn || this.router.createUrlTree(['tabs', 'home']))
    )
  }
}
