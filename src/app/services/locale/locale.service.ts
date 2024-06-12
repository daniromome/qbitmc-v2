import { environment } from 'src/environments/environment'
import { Injectable, LOCALE_ID, inject } from '@angular/core'
import { Locale } from '@qbitmc/common'

@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  private readonly _locale: string = inject(LOCALE_ID)

  public get locale(): Locale {
    const locale = this._locale.split('-').at(0)
    switch (locale) {
      case 'en':
        return 'en'
      case 'es':
        return 'es'
      default:
        return 'en'
    }
  }

  public navigateToLocale(locale: Locale): void {
    window.open(`${environment.SITE_URL}/${locale}`, '_self')
  }
}
