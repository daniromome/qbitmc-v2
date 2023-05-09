import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { AuthService } from '@services/auth'
import { Store } from '@ngrx/store'
import { AppActions } from '@store/app'
import { NavController } from '@ionic/angular'
import { OidcSecurityService } from 'angular-auth-oidc-client'
import { filter, first, switchMap, tap, zip } from 'rxjs'
import { QbitmcService } from '@services/qbitmc'

@Component({
  selector: 'qbit-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  public constructor(
    private readonly auth: AuthService,
    private readonly store: Store,
    private readonly nav: NavController,
    private readonly oidcSecurityService: OidcSecurityService,
    private readonly qbitmc: QbitmcService
  ) {

  }

  public ngOnInit(): void {
    // const redirected = localStorage.getItem('redirected')
    // if (!redirected) this.store.dispatch(AppActions.autoLogin())
    // else {
    //   const { data: { subscription } } = this.auth.changes((event, session) => {
    //     if (event !== 'SIGNED_IN') return
    //     this.store.dispatch(AppActions.loginMiddleware({ session }))
    //     subscription.unsubscribe()
    //   })
    //   this.nav.navigateForward(redirected)
    // }
    // this.oidcSecurityService.checkAuthMultiple().pipe(
    //   tap(([{ isAuthenticated, userData, accessToken }]) => {
    //     console.log('Authenticated', isAuthenticated)
    //     console.log('Received Userdata', userData)
    //     console.log(`Current access token is '${accessToken}'`)
    //   }),
    //   filter(([{ accessToken }]) => !!accessToken),
    //   switchMap(([{ accessToken }]) => zip(
    //     this.auth.linkMcAccount(accessToken),
    //     this.auth.getProfile(accessToken)
    //   )),
    //   first()
    // ).subscribe()
    this.store.dispatch(AppActions.initialize())
  }
}
