import { Injectable } from '@angular/core'
import { CanActivate, UrlTree, Router } from '@angular/router'
import { Observable, map } from 'rxjs'
import { Store } from '@ngrx/store'
import { selectUser } from '@selectors/app'

@Injectable({
  providedIn: 'root'
})
export class AppliedGuard implements CanActivate {
  public constructor(
    private readonly store: Store,
    private readonly router: Router
  ) {}

  public canActivate(): Observable<boolean | UrlTree> {
    return this.store.select(selectUser).pipe(
      map(user => [user?.minecraft.uuid, user?.application.approved]),
      map(([uuid, approved]) => (!!uuid && !approved) || this.router.createUrlTree(['tabs', 'join']))
    )
  }
}
