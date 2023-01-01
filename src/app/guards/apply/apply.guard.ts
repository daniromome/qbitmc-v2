import { Injectable } from '@angular/core'
import { CanActivate, Router, UrlTree } from '@angular/router'
import { Store } from '@ngrx/store'
import { selectProfile } from '@store/app/app.selectors'
import { map, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ApplyGuard implements CanActivate {
  public constructor(
    private readonly store: Store,
    private readonly router: Router
  ) {}

  public canActivate(): Observable<boolean | UrlTree> {
    return this.store.select(selectProfile).pipe(
      map(profile => profile?.uuid),
      map(uuid => !uuid || this.router.createUrlTree(['tabs', 'join', 'status']))
    )
  }
}
