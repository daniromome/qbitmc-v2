import { TranslationDocument } from '@qbitmc/common'
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
      translationActions.updateTranslationSuccess,
      (state, { translation }): TranslationState => adapter.upsertOne(translation, state)
    )
  ),
  extraSelectors: ({ selectTranslationState, selectLoading }) => {
    const entitySelectors = adapter.getSelectors(selectTranslationState)
    return {
      ...entitySelectors,
      selectLoadingTranslations: createSelector(selectLoading, loading => loading.translations),
      selectTranslationKeys: createSelector(entitySelectors.selectAll, translations =>
        Array.from(new Set(translations.map(t => t.key)))
      )
    }
  }
})
