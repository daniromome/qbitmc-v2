import { NgModule } from '@angular/core'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'
import { shopFeatureKey, reducer } from './shop.reducer'
import { ShopEffects } from './shop.effects'

@NgModule({
  declarations: [],
  imports: [
    StoreModule.forFeature(shopFeatureKey, reducer),
    EffectsModule.forFeature([ShopEffects])
  ]
})
export class ShopStoreModule { }
