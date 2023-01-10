import { Product } from '@models/product'
import { createAction, props } from '@ngrx/store'

export const getProducts = createAction(
  '[Shop] Get Products'
)

export const checkout = createAction(
  '[Shop] Checkout',
  props<{ price: string }>()
)
export const checkoutSuccess = createAction(
  '[Shop] Checkout Success',
  props<{ url: string }>()
)
export const checkoutFailure = createAction(
  '[Shop] Checkout Failure'
)

export const portal = createAction(
  '[Shop] Portal'
)
export const portalSuccess = createAction(
  '[Shop] Portal Success',
  props<{ url: string }>()
)
export const portalFailure = createAction(
  '[Shop] Portal Failure'
)

export const getProductsSuccess = createAction(
  '[Shop] Get Products Success',
  props<{ products: Product[] }>()
)

export const getProductsFailure = createAction(
  '[Shop] Get Products Failure',
  props<{ error: Error }>()
)
