import { appFeature } from '@store/app'
import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
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
  public products$?: Observable<Product[]>
  public readonly isSupporter$: Observable<boolean>

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
