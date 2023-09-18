import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule } from '@ionic/angular'
import { Observable, map } from 'rxjs'
import { Store } from '@ngrx/store'
import { LeaderboardComponent } from '@components/leaderboard'
import { MinecraftProfile } from '@models/minecraft-profile'
import { AppActions, appFeature } from '@store/app'
import { AvatarPipe } from '@pipes/avatar'
import { SliderComponent } from '@components/slider'
import { Server } from '@models/server'
import { ViewPortService } from '@services/view-port'

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
  public readonly supporters$: Observable<MinecraftProfile[]>
  public readonly supportersCount$: Observable<number>
  public readonly servers$: Observable<Server[]>
  private readonly store = inject(Store)
  private readonly view = inject(ViewPortService)

  public constructor(
  ) {
    this.elementsInView$ = this.view.width$.pipe(
      map(width => {
        if (width < 576) return 1
        if (width < 768) return 2
        if (width < 992) return 3
        if (width < 1400) return 4
        return 5
      })
    )
    this.isDesktop$ = this.view.isDesktop$
    this.supporters$ = this.store.select(appFeature.selectSupporters)
    this.supportersCount$ = this.supporters$.pipe(map(supporters => supporters.length))
    this.servers$ = this.store.select(appFeature.selectServers)
  }

  public ngOnInit(): void {
    this.store.dispatch(AppActions.getLeaderboards())
  }
}
