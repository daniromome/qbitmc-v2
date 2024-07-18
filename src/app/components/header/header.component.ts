import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonButton,
  IonIcon,
  IonPopover,
  IonList,
  IonItem,
  IonContent,
  IonLabel
} from '@ionic/angular/standalone'
import { Store } from '@ngrx/store'
import { Locale } from '@qbitmc/common'
import { LocaleService } from '@services/locale'
import { selectUrl } from '@store/router'

@Component({
  selector: 'qbit-header',
  standalone: true,
  imports: [
    CommonModule,
    IonLabel,
    IonContent,
    IonItem,
    IonList,
    IonPopover,
    IonIcon,
    IonButton,
    IonTitle,
    IonBackButton,
    IonButtons,
    IonToolbar,
    IonHeader
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public readonly store = inject(Store)
  public readonly localeService = inject(LocaleService)

  public readonly url = this.store.selectSignal(selectUrl)

  public changeLocale(locale: Locale): void {
    this.localeService.navigateToLocale(locale)
  }
}
