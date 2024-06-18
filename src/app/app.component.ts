import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { appActions } from '@store/app'
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone'

@Component({
  selector: 'qbit-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IonRouterOutlet, IonApp]
})
export class AppComponent implements OnInit {
  private readonly store = inject(Store)

  public ngOnInit(): void {
    this.store.dispatch(appActions.initialize())
  }
}
