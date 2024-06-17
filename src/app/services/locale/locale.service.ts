import { environment } from 'src/environments/environment'
import { Injectable, LOCALE_ID, inject } from '@angular/core'
import { Locale, Translation, TranslationDocument } from '@qbitmc/common'
import { AppwriteService } from '@services/appwrite'
import { Observable, from, map } from 'rxjs'
import { Query } from 'appwrite'

@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  private readonly appwrite = inject(AppwriteService)
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

  public get(namespace?: string): Observable<TranslationDocument[]> {
    return from(
      this.appwrite.databases.listDocuments<TranslationDocument>(
        environment.APPWRITE_DATABASE,
        environment.APPWRITE_COLLECTION_TRANSLATION,
        namespace ? [Query.startsWith('key', namespace), Query.equal('locale', this.locale)] : []
      )
    ).pipe(map(list => list.documents))
  }

  public update(id: string, translation: Partial<Translation>): Observable<TranslationDocument> {
    return from(
      this.appwrite.databases.updateDocument<TranslationDocument>(
        environment.APPWRITE_DATABASE,
        environment.APPWRITE_COLLECTION_TRANSLATION,
        id,
        translation
      )
    )
  }
}
