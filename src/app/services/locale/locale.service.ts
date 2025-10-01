import { environment } from 'src/environments/environment'
import { Injectable, LOCALE_ID, inject } from '@angular/core'
import { Locale, Translation, TranslationDocument } from '@qbitmc/common'
import { AppwriteService } from '@services/appwrite'
import { Observable, from, map } from 'rxjs'
import { ID, Query } from 'appwrite'

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
    window.open(`${window.location.href}/${locale}`, '_self')
  }

  public get(request: { locale: boolean; namespace?: string }): Observable<TranslationDocument[]> {
    const queries: string[] = []
    if (request.locale) queries.push(Query.equal('locale', this.locale))
    if (request.namespace) queries.push(Query.startsWith('key', request.namespace))
    return from(
      this.appwrite.databases.listDocuments<TranslationDocument>(
        environment.APPWRITE_DATABASE,
        environment.APPWRITE_COLLECTION_TRANSLATION,
        queries
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

  public create(translation: Translation): Observable<TranslationDocument> {
    return from(
      this.appwrite.databases.createDocument<TranslationDocument>(
        environment.APPWRITE_DATABASE,
        environment.APPWRITE_COLLECTION_TRANSLATION,
        ID.unique(),
        translation
      )
    )
  }
}
