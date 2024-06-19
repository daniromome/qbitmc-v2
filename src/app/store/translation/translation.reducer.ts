import { Locale, TranslationDocument } from '@qbitmc/common'
import { createFeature, createReducer, createSelector, on } from '@ngrx/store'
import { translationActions } from './translation.actions'
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity'

export interface TranslationState extends EntityState<TranslationDocument> {
  loading: {
    translations: boolean
  }
}

export const adapter: EntityAdapter<TranslationDocument> = createEntityAdapter<TranslationDocument>({
  selectId: translation => translation.$id
})

export const initialState: TranslationState = adapter.getInitialState({
  loading: {
    translations: false
  }
})

export const translationFeature = createFeature({
  name: 'translation',
  reducer: createReducer(
    initialState,
    on(
      translationActions.getTranslations,
      (state): TranslationState => ({ ...state, loading: { ...state.loading, translations: true } })
    ),
    on(
      translationActions.getTranslationsSuccess,
      (state, { translations }): TranslationState => adapter.upsertMany(translations, state)
    ),
    on(
      translationActions.getTranslationsSuccess,
      translationActions.getTranslationsFailure,
      (state): TranslationState => ({
        ...state,
        loading: { ...state.loading, translations: false }
      })
    ),
    on(
      translationActions.upsertTranslationsSuccess,
      (state, { translations }): TranslationState => adapter.upsertMany(translations, state)
    )
  ),
  extraSelectors: ({ selectTranslationState, selectLoading }) => {
    const entitySelectors = adapter.getSelectors(selectTranslationState)
    return {
      ...entitySelectors,
      selectLoadingTranslations: createSelector(selectLoading, loading => loading.translations),
      selectTranslationEntities: createSelector(entitySelectors.selectAll, translations =>
        Array.from(
          new Set(
            translations.map(t => {
              const splitKey = t.key.split('.')
              return JSON.stringify({ entity: splitKey.at(0), $id: splitKey.at(-1) })
            })
          )
        ).map(e => JSON.parse(e) as { entity: string; $id: string })
      ),
      selectTranslationByKey: (key: string, locale: Locale) =>
        createSelector(entitySelectors.selectAll, translations => translations.find(t => t.key === key && t.locale === locale)),
      selectTranslationByEntityId: ($id: string, locale: Locale) =>
        createSelector(entitySelectors.selectAll, translations =>
          translations
            .filter(t => t.key.endsWith($id) && t.locale === locale)
            .reduce<Record<string, string>>((acc, cur) => ({ ...acc, [cur.key.split('.')[1]]: cur.message }), {})
        )
    }
  }
})
