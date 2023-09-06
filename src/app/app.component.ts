import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppActions } from '@store/app'

@Component({
  selector: 'qbit-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  private readonly store = inject(Store)

  public ngOnInit(): void {
    this.store.dispatch(AppActions.initialize())
  }
}
