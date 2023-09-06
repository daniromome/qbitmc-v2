import { Injectable } from '@angular/core'
import { UrlTree, Router } from '@angular/router'
import { Observable, map } from 'rxjs'
import { Store } from '@ngrx/store'
import { selectIsRole } from '@selectors/app'

@Injectable({
  providedIn: 'root'
})
export class QbitorGuard {
  public constructor(
    private readonly store: Store,
    private readonly router: Router
  ) {}

  public canActivate(): Observable<boolean | UrlTree> {
    return this.store.select(selectIsRole('qbitor')).pipe(
      map(is => is || this.router.createUrlTree(['tabs', 'home']))
    )
  }
}
