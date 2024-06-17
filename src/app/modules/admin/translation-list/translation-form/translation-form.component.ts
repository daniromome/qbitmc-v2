import { Component, effect, inject } from '@angular/core'
import { FormGroup, FormRecord, NonNullableFormBuilder } from '@angular/forms'
import { Store } from '@ngrx/store'
import { LOCALE, Locale, Translation } from '@qbitmc/common'
import { selectRouteParam } from '@store/router'
import { FormFrom } from '@utils'

type TranslationForm = FormGroup<FormFrom<Translation>>

@Component({
  selector: 'qbit-translation-form',
  standalone: true,
  imports: [],
  templateUrl: './translation-form.component.html',
  styleUrl: './translation-form.component.scss'
})
export class TranslationFormComponent {
  private readonly store = inject(Store)
  private readonly fb = inject(NonNullableFormBuilder)

  public readonly key = this.store.selectSignal(selectRouteParam('key'))

  public readonly form: FormRecord<TranslationForm> = Object.values(LOCALE).reduce((record, cur) => {
    record.addControl(cur, this.newTranslationGroup(cur))
    return record
  }, this.fb.record<TranslationForm>({}))

  public constructor() {
    effect(() => console.log(this.key()))
  }

  private newTranslationGroup(locale: Locale): TranslationForm {
    return this.fb.group({
      key: '',
      value: '',
      locale
    })
  }
}
