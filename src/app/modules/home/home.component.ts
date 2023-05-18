import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule, SelectCustomEvent, Platform } from '@ionic/angular'
import { LocaleService } from '@services/locale'
import { Observable, map, startWith } from 'rxjs'
import { Store } from '@ngrx/store'
import { selectLeaderboards, selectSupporters } from '@selectors/app'
import { LeaderboardComponent } from '@components/leaderboard'
import { MinecraftProfile } from '@models/minecraft-profile'
import { PlayerStatistics } from '@models/player-statistics'
import { AppActions } from '@store/app'

@Component({
  selector: 'qbit-home',
  standalone: true,
  imports: [CommonModule, IonicModule, LeaderboardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  public readonly isDesktop$: Observable<boolean>
  public readonly locale: string
  public readonly leaderboards$: Observable<[string, PlayerStatistics[]][]>
  public readonly supporters$: Observable<MinecraftProfile[]>

  public constructor(
    private readonly localeService: LocaleService,
    private readonly store: Store,
    private readonly platform: Platform
  ) {
    this.isDesktop$ = this.platform.resize.pipe(
      startWith(() => this.platform.width() > 1200),
      map(() => this.platform.width() > 1200)
    )
    this.locale = localeService.locale
    this.leaderboards$ = this.store.select(selectLeaderboards)
    this.supporters$ = this.store.select(selectSupporters)
  }

  public ngOnInit(): void {
    this.store.dispatch(AppActions.getLeaderboards())
  }

  public changeLocale(ev: Event): void {
    const event = ev as SelectCustomEvent
    this.localeService.navigateToLocale(event.detail.value)
  }
}
