import { environment } from 'src/environments/environment'
import { Inject, Injectable, LOCALE_ID } from '@angular/core'
import { Locale } from '@models/locale'

@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  public constructor(
    @Inject(LOCALE_ID) private readonly _locale: string
  ) {}

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
    window.open(`${environment.URL}/${locale}`, '_self')
  }
}
