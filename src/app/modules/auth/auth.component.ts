import { Component, ChangeDetectionStrategy, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Store } from '@ngrx/store'
import { appActions } from '@store/app'
import { IonLabel, IonImg, IonButton, IonIcon } from '@ionic/angular/standalone'
import { addIcons } from 'ionicons'
import { logoDiscord } from 'ionicons/icons'

@Component({
  selector: 'qbit-auth',
  standalone: true,
  imports: [IonIcon, IonButton, IonImg, IonLabel, CommonModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent {
  private readonly store = inject(Store)

  public constructor() {
    addIcons({ logoDiscord })
  }

  public login(): void {
    this.store.dispatch(appActions.login())
  }
}
