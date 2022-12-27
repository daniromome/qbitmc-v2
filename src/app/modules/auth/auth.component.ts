import { Component, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule } from '@ionic/angular'
import { Store } from '@ngrx/store'
import { AppActions } from '@store/app'

@Component({
  selector: 'qbit-auth',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent {
  public constructor(
    private readonly store: Store
  ) {}

  public login(): void {
    this.store.dispatch(AppActions.login())
  }
}
