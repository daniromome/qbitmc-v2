import { Injectable } from '@angular/core'
import { CanActivate, UrlTree, Router } from '@angular/router'
import { Observable, map } from 'rxjs'
import { Store } from '@ngrx/store'
import { selectProfile } from '@selectors/app'

@Injectable({
  providedIn: 'root'
})
export class AppliedGuard implements CanActivate {
  public constructor(
    private readonly store: Store,
    private readonly router: Router
  ) {}

  public canActivate(): Observable<boolean | UrlTree> {
    return this.store.select(selectProfile).pipe(
      map(profile => profile?.uuid || undefined),
      map(uuid => !!uuid || this.router.createUrlTree(['tabs', 'join']))
    )
  }
}
