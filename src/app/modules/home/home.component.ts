import { Component, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule, SelectCustomEvent } from '@ionic/angular'
import { LocaleService } from '@services/locale'

@Component({
  selector: 'qbit-home',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  public readonly locale: string

  public constructor(
    private readonly localeService: LocaleService
  ) {
    this.locale = localeService.locale
  }

  public changeLocale(ev: Event): void {
    const event = ev as SelectCustomEvent
    this.localeService.navigateToLocale(event.detail.value)
  }
}
