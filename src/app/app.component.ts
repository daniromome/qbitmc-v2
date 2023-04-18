import { ChangeDetectionStrategy, Component, EnvironmentInjector, OnInit } from '@angular/core'
import { AuthService } from '@services/auth'
import { Store } from '@ngrx/store'
import { AppActions } from '@store/app'
import { firstValueFrom } from 'rxjs'
import { NavController } from '@ionic/angular'

@Component({
  selector: 'qbit-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  public constructor(
    public readonly environmentInjector: EnvironmentInjector,
    private readonly auth: AuthService,
    private readonly store: Store,
    private readonly nav: NavController
  ) {

  }

  public ngOnInit(): void {
    const redirected = localStorage.getItem('redirected')
    if (!redirected) this.store.dispatch(AppActions.autoLogin())
    else {
      const { data: { subscription } } = this.auth.changes((event, session) => {
        if (event !== 'SIGNED_IN') return
        this.store.dispatch(AppActions.loginMiddleware({ session }))
        subscription.unsubscribe()
      })
      this.nav.navigateForward(redirected)
    }
    this.store.dispatch(AppActions.getLeaderboards())
    this.store.dispatch(AppActions.getSupporters())
  }
}
