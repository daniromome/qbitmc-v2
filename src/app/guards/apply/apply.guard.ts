import { Injectable } from '@angular/core'
import { Router, UrlTree } from '@angular/router'
import { Store } from '@ngrx/store'
import { selectApplied, selectInitialized } from '@selectors/app'
import { filter, map, Observable, switchMap } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ApplyGuard {
  public constructor(
    private readonly store: Store,
    private readonly router: Router
  ) {}

  public canActivate(): Observable<boolean | UrlTree> {
    return this.store.select(selectInitialized).pipe(
      filter(initialized => initialized),
      switchMap(() => this.store.select(selectApplied)),
      map(applied => !applied || this.router.createUrlTree(['tabs', 'join', 'status']))
    )
  }
}
