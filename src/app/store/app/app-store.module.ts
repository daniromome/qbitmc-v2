import { NgModule } from '@angular/core'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'
import { appFeatureKey, reducer } from './app.reducer'
import { AppEffects } from './app.effects'

@NgModule({
  declarations: [],
  imports: [
    StoreModule.forFeature(appFeatureKey, reducer),
    EffectsModule.forFeature([AppEffects])
  ]
})
export class AppStoreModule { }
