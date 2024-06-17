import { Translation, TranslationDocument } from '@qbitmc/common'
import { createActionGroup, props } from '@ngrx/store'

export const translationActions = createActionGroup({
  source: 'Translation',
  events: {
    'Get Translations': props<{ namespace?: string }>(),
    'Get Translations Success': props<{ translations: TranslationDocument[] }>(),
    'Get Translations Failure': props<{ error: Error }>(),
    'Update Translation': props<{ $id: string; translation: Partial<Translation> }>(),
    'Update Translation Success': props<{ translation: TranslationDocument }>(),
    'Update Translation Failure': props<{ error: Error }>()
  }
})
