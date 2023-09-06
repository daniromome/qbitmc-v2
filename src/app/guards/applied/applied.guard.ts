import { Injectable } from '@angular/core'
import { UrlTree, Router } from '@angular/router'
import { Observable, filter, map, switchMap } from 'rxjs'
import { Store } from '@ngrx/store'
import { selectPendingApproval, selectInitialized } from '@selectors/app'

@Injectable({
  providedIn: 'root'
})
export class AppliedGuard {
  public constructor(
    private readonly store: Store,
    private readonly router: Router
  ) {}

  public canActivate(): Observable<boolean | UrlTree> {
    return this.store.select(selectInitialized).pipe(
      filter(initialized => initialized),
      switchMap(() => this.store.select(selectPendingApproval)),
      map(pending => pending || this.router.createUrlTree(['tabs', 'join']))
    )
  }
}
