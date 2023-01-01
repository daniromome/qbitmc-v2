import { NgModule } from '@angular/core'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'
import { applicationFeatureKey, reducer } from './application.reducer'
import { ApplicationEffects } from './application.effects'

@NgModule({
  declarations: [],
  imports: [
    StoreModule.forFeature(applicationFeatureKey, reducer),
    EffectsModule.forFeature([ApplicationEffects])
  ]
})
export class ApplicationStoreModule { }
