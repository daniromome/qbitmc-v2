import { createReducer, on } from '@ngrx/store'
import { Product } from '@models/product'
import { ShopActions } from '@store/shop'

export const shopFeatureKey = 'shop'

export interface ShopState {
  products: Product[],
  loading: boolean
}

export const initialState: ShopState = {
  products: [],
  loading: false
}

export const reducer = createReducer(
  initialState,
  on(ShopActions.getProducts, (state): ShopState => ({ ...state, loading: true })),
  on(ShopActions.getProductsFailure, (state): ShopState => ({ ...state, loading: false })),
  on(ShopActions.getProductsSuccess, (state, action): ShopState => ({ ...state, products: action.products, loading: false }))
)
