import { Injectable, inject } from '@angular/core'
import { Platform } from '@ionic/angular'
import { Observable, map, startWith } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ViewPortService {
  private readonly platform = inject(Platform)
  public readonly isDesktop$: Observable<boolean>
  public readonly isTablet$: Observable<boolean>
  public readonly width$: Observable<number>

  public constructor() {
    this.width$ = this.platform.resize.pipe(
      startWith(() => this.platform.width()),
      map(() => this.platform.width())
    )
    this.isDesktop$ = this.width$.pipe(
      map(width => width > 1200)
    )
    this.isTablet$ = this.width$.pipe(
      map(width => width > 992)
    )
  }
}
