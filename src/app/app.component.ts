import { ChangeDetectionStrategy, Component, EnvironmentInjector, OnInit } from '@angular/core'
import { AuthService } from '@services/auth'
import { Store } from '@ngrx/store'
import { AppActions } from '@store/app'
import { PreferencesService } from './services/preferences/preferences.service';
import { lastValueFrom } from 'rxjs';

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
    private readonly preferences: PreferencesService
  ) {

  }

  public async ngOnInit(): Promise<void> {
    await this.autoLogin()
    this.auth.changes((event, session) => {
      switch (event) {
        case 'SIGNED_IN':
          this.store.dispatch(AppActions.loginMiddleware({ session }))
          break
        case 'SIGNED_OUT':
          this.store.dispatch(AppActions.logout())
          break
        default:
          break
      }
    })
  }

  public async autoLogin(): Promise<void> {
    const redirected = await lastValueFrom(this.preferences.get('redirected')) === 'true'
    if (!redirected) this.store.dispatch(AppActions.autoLogin())
  }
}
