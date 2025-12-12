import { Component, OnInit, Signal, inject, signal } from '@angular/core'
import {
  IonCardContent,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonItem,
  IonSkeletonText,
  NavController,
  IonGrid,
  IonContent,
  IonFabButton,
  IonFab,
  IonIcon,
  IonFabList,
  IonChip
} from '@ionic/angular/standalone'
import { Store } from '@ngrx/store'
import { translationActions, translationFeature } from '@store/translation'
import { add } from 'ionicons/icons'
import { addIcons } from 'ionicons'
import { CommonModule } from '@angular/common'
import { ServerDocument } from '@qbitmc/common'
import { serverFeature } from '@store/server'

@Component({
  selector: 'qbit-translation-list',
  standalone: true,
  imports: [
    IonChip,
    IonFabList,
    IonIcon,
    IonFab,
    IonFabButton,
    IonContent,
    IonGrid,
    IonSkeletonText,
    IonItem,
    IonList,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonCol,
    IonRow,
    IonCardContent,
    CommonModule
  ],
  templateUrl: './translation-list.component.html',
  styleUrl: './translation-list.component.scss'
})
export class TranslationListComponent implements OnInit {
  private readonly store = inject(Store)
  public readonly nav = inject(NavController)

  public readonly loading = this.store.selectSignal(translationFeature.selectLoadingTranslations)
  public readonly translations = this.store.selectSignal(translationFeature.selectTranslationEntities)
  public readonly skeleton = Array.from(Array(8)).map((_, i) => i)

  public constructor() {
    addIcons({ add })
  }

  public ngOnInit(): void {
    this.store.dispatch(translationActions.getTranslations({ locale: false }))
  }

  public goToTranslation(translation: { entity: string; $id: string }): void {
    this.nav.navigateForward(['tabs', 'admin', 'translation', translation.$id, translation.entity])
  }

  public getEntity(translation: { entity: string; $id: string }): Signal<ServerDocument | undefined> {
    if (translation.entity === 'server') return this.store.selectSignal(serverFeature.selectServer(translation.$id))
    return signal(undefined)
  }
}
