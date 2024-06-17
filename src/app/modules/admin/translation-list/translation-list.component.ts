import { Component, inject } from '@angular/core'
import {
  IonCardContent,
  IonRow,
  IonSpinner,
  IonButton,
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
  IonFabList
} from '@ionic/angular/standalone'
import { Store } from '@ngrx/store'
import { translationFeature } from '@store/translation'
import { add } from 'ionicons/icons'
import { addIcons } from 'ionicons'

@Component({
  selector: 'qbit-translation-list',
  standalone: true,
  imports: [
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
    IonButton,
    IonSpinner,
    IonRow,
    IonCardContent
  ],
  templateUrl: './translation-list.component.html',
  styleUrl: './translation-list.component.scss'
})
export class TranslationListComponent {
  private readonly store = inject(Store)
  public readonly nav = inject(NavController)

  public readonly loading = this.store.selectSignal(translationFeature.selectLoadingTranslations)
  public readonly translations = this.store.selectSignal(translationFeature.selectAll)
  public readonly skeleton = Array.from(Array(8)).map((_, i) => i)

  public constructor() {
    addIcons({ add })
  }
}
