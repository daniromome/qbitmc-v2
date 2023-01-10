import { createSelector, createFeatureSelector } from '@ngrx/store'
import { shopFeatureKey, ShopState } from './shop.reducer'

export const selectShopState = createFeatureSelector<ShopState>(shopFeatureKey)

export const selectProducts = createSelector(
  selectShopState,
  (state) => state.products
)

export const selectLoading = createSelector(
  selectShopState,
  (state) => state.loading
)
