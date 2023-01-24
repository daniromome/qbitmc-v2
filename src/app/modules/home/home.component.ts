import { Component, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule, SelectCustomEvent } from '@ionic/angular'
import { LocaleService } from '@services/locale'
import { LeaderboardExtendedRecord } from '@models/leaderboards'
import { Observable } from 'rxjs'
import { Store } from '@ngrx/store'
import { selectLeaderboards } from '@selectors/app'
import { LeaderboardComponent } from '@components/leaderboard'

@Component({
  selector: 'qbit-home',
  standalone: true,
  imports: [CommonModule, IonicModule, LeaderboardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  public readonly locale: string
  public readonly leaderboards$: Observable<[string, LeaderboardExtendedRecord[]][]>

  public constructor(
    private readonly localeService: LocaleService,
    private readonly store: Store
  ) {
    this.locale = localeService.locale
    this.leaderboards$ = this.store.select(selectLeaderboards)
  }

  public changeLocale(ev: Event): void {
    const event = ev as SelectCustomEvent
    this.localeService.navigateToLocale(event.detail.value)
  }
}
