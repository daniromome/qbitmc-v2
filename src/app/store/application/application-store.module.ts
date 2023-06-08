import { NgModule } from '@angular/core'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'
import { applicationFeatureKey, reducer } from './application.reducer'
import { ApplicationEffects } from './application.effects'
import { BytesPipe } from '@pipes/bytes'

@NgModule({
  declarations: [],
  imports: [
    BytesPipe,
    StoreModule.forFeature(applicationFeatureKey, reducer),
    EffectsModule.forFeature([ApplicationEffects])
  ],
  providers: [
    BytesPipe
  ]
})
export class ApplicationStoreModule { }
