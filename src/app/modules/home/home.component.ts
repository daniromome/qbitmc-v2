import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule, SelectCustomEvent, Platform } from '@ionic/angular'
import { LocaleService } from '@services/locale'
import { Observable, map, startWith } from 'rxjs'
import { Store } from '@ngrx/store'
import { selectServers, selectSupporters } from '@selectors/app'
import { LeaderboardComponent } from '@components/leaderboard'
import { MinecraftProfile } from '@models/minecraft-profile'
import { AppActions } from '@store/app'
import { AvatarPipe } from '@pipes/avatar'
import { SliderComponent } from '@components/slider'
import { Server } from '@models/server'

@Component({
  selector: 'qbit-home',
  standalone: true,
  imports: [CommonModule, IonicModule, LeaderboardComponent, AvatarPipe, SliderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  public readonly isDesktop$: Observable<boolean>
  public readonly elementsInView$: Observable<number>
  public readonly locale: string
  public readonly supporters$: Observable<MinecraftProfile[]>
  public readonly supportersCount$: Observable<number>
  public readonly servers$: Observable<Server[]>

  public constructor(
    private readonly localeService: LocaleService,
    private readonly store: Store,
    private readonly platform: Platform
  ) {
    const width$ = this.platform.resize.pipe(
      startWith(() => this.platform.width()),
      map(() => this.platform.width())
    )
    this.isDesktop$ = width$.pipe(
      map(width => width > 1200)
    )
    this.elementsInView$ = width$.pipe(
      map(width => {
        if (width < 576) return 1
        if (width < 768) return 2
        if (width < 992) return 3
        if (width < 1400) return 4
        return 5
      })
    )
    this.locale = localeService.locale
    this.supporters$ = this.store.select(selectSupporters)
    this.supportersCount$ = this.supporters$.pipe(map(supporters => supporters.length))
    this.servers$ = this.store.select(selectServers)
  }

  public ngOnInit(): void {
    this.store.dispatch(AppActions.getLeaderboards())
  }

  public changeLocale(ev: Event): void {
    const event = ev as SelectCustomEvent
    this.localeService.navigateToLocale(event.detail.value)
  }
}
