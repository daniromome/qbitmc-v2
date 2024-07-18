import { Component, Signal, computed, effect, inject } from '@angular/core'
import { FormArray, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
import { Store } from '@ngrx/store'
import { LOCALE, Locale, ServerDocument, Translation, TranslationDocument } from '@qbitmc/common'
import { selectRouteParam, selectUrl } from '@store/router'
import { serverActions, serverFeature } from '@store/server'
import { FormFrom } from '@utils'
import {
  IonInput,
  IonContent,
  IonList,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonListHeader,
  IonCardContent,
  IonCard,
  IonButton,
  IonChip,
  IonText
} from '@ionic/angular/standalone'
import { CommonModule } from '@angular/common'
import { translationActions, translationFeature } from '@store/translation'

type TranslationForm = FormGroup<FormFrom<Translation>>

@Component({
  selector: 'qbit-translation-form',
  standalone: true,
  imports: [
    IonText,
    IonChip,
    IonButton,
    IonCard,
    IonCardContent,
    IonListHeader,
    IonItem,
    IonList,
    IonContent,
    IonInput,
    IonSelect,
    IonSelectOption,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './translation-form.component.html',
  styleUrl: './translation-form.component.scss'
})
export class TranslationFormComponent {
  private readonly store = inject(Store)
  private readonly fb = inject(NonNullableFormBuilder)

  public readonly locales = Object.values(LOCALE)

  public readonly id = this.store.selectSignal(selectRouteParam('id'))

  private readonly url = this.store.selectSignal(selectUrl)
  public readonly entity = computed(() => {
    const url = this.url()
    return url.split('/').at(-1)
  })

  public readonly entities: Signal<ServerDocument[]> = computed(() => {
    const entity = this.entity()
    const servers = this.store.selectSignal(serverFeature.selectAll)()
    if (entity === 'server') return servers
    return []
  })

  public readonly properties: Signal<string[]> = computed(() => {
    const entity = this.entity()
    if (entity === 'server') return ['name', 'description']
    return []
  })

  public readonly idControl = this.fb.control('')

  public readonly form: FormArray<TranslationForm> = this.fb.array<TranslationForm>([])

  public constructor() {
    effect(
      () => {
        const entity = this.entity()
        if (entity === 'server') this.store.dispatch(serverActions.getServers({ includeDrafts: true }))
      },
      { allowSignalWrites: true }
    )
    effect(
      () => {
        const id = this.id()
        if (!id || id === 'new') return
        this.idControl.setValue(id)
        this.idControl.disable()
        this.selectEntity()
      },
      { allowSignalWrites: true }
    )
  }

  public selectEntity(): void {
    const id = this.idControl.getRawValue()
    const properties = this.properties()
    const entity = this.entity()
    if (!id || !entity || properties.length === 0) return
    const document = this.selectDocument(id)()
    if (!document) return
    this.form.clear()
    for (const locale of this.locales) {
      for (const property of properties) {
        const key = `${entity}.${property}.${id}`
        const message = this.selectTranslation(key, locale)?.message || this.getPropertyFromDocument(property, document, locale)
        this.form.push(this.newTranslationGroup({ key, message, locale }))
      }
    }
  }

  private newTranslationGroup(translation: Translation): TranslationForm {
    return this.fb.group({
      key: this.fb.control(translation.key),
      message: this.fb.control(translation.message),
      locale: this.fb.control(translation.locale)
    })
  }

  private selectTranslation(key: string, locale: Locale): TranslationDocument | undefined {
    return this.store.selectSignal(translationFeature.selectTranslationByKey(key, locale))()
  }

  private selectDocument(id: string): Signal<ServerDocument | undefined> {
    return computed(() => {
      const entity = this.entity()
      if (entity === 'server') return this.store.selectSignal(serverFeature.selectServer(id))()
      return undefined
    })
  }

  private getPropertyFromDocument<T extends object>(property: string, document: T, locale: Locale): string {
    if (locale !== LOCALE.EN) return ''
    return (
      Object.entries(document)
        .find(([k]) => k === property)
        ?.at(1) || ''
    )
  }

  public save(): void {
    const translations = this.form.getRawValue()
    if (translations.length === 0) return
    this.store.dispatch(translationActions.upsertTranslations({ translations }))
  }
}
