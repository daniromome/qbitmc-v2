import { Translation, TranslationDocument } from '@qbitmc/common'
import { createActionGroup, props } from '@ngrx/store'

export const translationActions = createActionGroup({
  source: 'Translation',
  events: {
    'Get Translations': props<{ locale: boolean; namespace?: string }>(),
    'Get Translations Success': props<{ translations: TranslationDocument[] }>(),
    'Get Translations Failure': props<{ error: Error }>(),
    'Upsert Translations': props<{ translations: Translation[] }>(),
    'Upsert Translations Success': props<{ translations: TranslationDocument[] }>(),
    'Upsert Translations Failure': props<{ error: Error }>()
  }
})
