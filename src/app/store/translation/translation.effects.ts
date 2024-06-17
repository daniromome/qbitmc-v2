import { inject } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { LocaleService } from '@services/locale'
import { translationActions } from '@store/translation'
import { switchMap, map, catchError, of, repeat } from 'rxjs'

export const getTranslations$ = createEffect(
  (actions$ = inject(Actions), locale = inject(LocaleService)) =>
    actions$.pipe(
      ofType(translationActions.getTranslations),
      switchMap(({ namespace }) => locale.get(namespace)),
      map(translations => translationActions.getTranslationsSuccess({ translations })),
      catchError(error => {
        return of(translationActions.getTranslationsFailure({ error }))
      }),
      repeat()
    ),
  { functional: true }
)

export const updateTranslation$ = createEffect(
  (actions$ = inject(Actions), locale = inject(LocaleService)) =>
    actions$.pipe(
      ofType(translationActions.updateTranslation),
      switchMap(({ $id: id, translation }) => locale.update(id, translation)),
      map(translation => translationActions.updateTranslationSuccess({ translation })),
      catchError(error => of(translationActions.updateTranslationFailure({ error }))),
      repeat()
    ),
  { functional: true }
)
