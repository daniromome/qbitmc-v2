import { inject } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { concatLatestFrom } from '@ngrx/operators'
import { Store } from '@ngrx/store'
import { LocaleService } from '@services/locale'
import { translationActions, translationFeature } from '@store/translation'
import { switchMap, map, catchError, of, repeat, forkJoin } from 'rxjs'

export const getTranslations$ = createEffect(
  (actions$ = inject(Actions), localeService = inject(LocaleService)) =>
    actions$.pipe(
      ofType(translationActions.getTranslations),
      switchMap(({ locale, namespace }) => localeService.get({ locale, namespace })),
      map(translations => translationActions.getTranslationsSuccess({ translations })),
      catchError(error => {
        return of(translationActions.getTranslationsFailure({ error }))
      }),
      repeat()
    ),
  { functional: true }
)

export const updateTranslations$ = createEffect(
  (actions$ = inject(Actions), locale = inject(LocaleService), store = inject(Store)) =>
    actions$.pipe(
      ofType(translationActions.upsertTranslations),
      concatLatestFrom(() => store.select(translationFeature.selectAll)),
      switchMap(([{ translations }, existingTranslations]) =>
        forkJoin(
          translations.map(translation => {
            const index = existingTranslations.findIndex(t => t.key === translation.key && t.locale === translation.locale)
            if (index === -1) return locale.create(translation)
            return locale.update(existingTranslations[index].$id, translation)
          })
        )
      ),
      map(translations => translationActions.upsertTranslationsSuccess({ translations })),
      catchError(error => of(translationActions.upsertTranslationsFailure({ error }))),
      repeat()
    ),
  { functional: true }
)
