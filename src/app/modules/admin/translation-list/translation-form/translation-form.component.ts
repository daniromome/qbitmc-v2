import { Component, effect, inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { selectRouteParam } from '@store/router'

@Component({
  selector: 'qbit-translation-form',
  standalone: true,
  imports: [],
  templateUrl: './translation-form.component.html',
  styleUrl: './translation-form.component.scss'
})
export class TranslationFormComponent {
  private readonly store = inject(Store)

  public readonly key = this.store.selectSignal(selectRouteParam('key'))

  public constructor() {
    effect(() => console.log(this.key()))
  }
}
