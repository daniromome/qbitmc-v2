import { appFeature } from '@store/app'
import { CommonModule } from '@angular/common'
import { Component, computed, inject, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { Store } from '@ngrx/store'
import { ShopActions, shopFeature } from '@store/shop'
import { USER_LABEL, Product } from '@qbitmc/common'
import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonItem,
  IonRow,
  IonText
} from '@ionic/angular/standalone'
import { ViewPortService } from '@services/view-port'

@Component({
  selector: 'qbit-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  imports: [
    CommonModule,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonAvatar,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonText
  ],
  standalone: true
})
export class ShopComponent implements OnInit {
  public readonly view = inject(ViewPortService)
  public products$?: Observable<Product[]>
  public readonly isSupporter$: Observable<boolean>
  public readonly background = computed(() => {
    const darkMode = this.view.darkMode()
    const url = darkMode
      ? 'https://appwrite.qbitmc.com/v1/storage/buckets/68dca88d0013bb1cffea/files/68dca912001f985f5c4e/preview?height=360&project=66649e96000758b8ebdb'
      : 'https://appwrite.qbitmc.com/v1/storage/buckets/68dca88d0013bb1cffea/files/68dca90e0033533c3864/preview?height=360&project=66649e96000758b8ebdb'
    return `url(${url}) no-repeat 60% center`
  })

  public constructor(private readonly store: Store) {
    this.isSupporter$ = this.store.select(appFeature.selectIsRole(USER_LABEL.SUPPORTER))
  }

  public ngOnInit(): void {
    this.store.dispatch(ShopActions.getProducts())
    this.products$ = this.store.select(shopFeature.selectProducts)
  }

  public subscription(price: string): void {
    this.store.dispatch(ShopActions.subscribe({ price }))
  }
}
