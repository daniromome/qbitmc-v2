import { appFeature } from '@store/app'
import { CommonModule } from '@angular/common'
import { IonicModule } from '@ionic/angular'
import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { Product } from '@models/product'
import { Store } from '@ngrx/store'
import { ShopActions, shopFeature } from '@store/shop'
import { ROLE } from '@models/role'

@Component({
  selector: 'qbit-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  imports: [CommonModule, IonicModule],
  standalone: true
})
export class ShopComponent implements OnInit {
  public products$?: Observable<Product[]>
  public readonly isSupporter$: Observable<boolean>

  public constructor(
    private readonly store: Store
  ) {
    this.isSupporter$ = this.store.select(appFeature.selectIsRole(ROLE.SUPPORTER))
  }

  public ngOnInit(): void {
    this.store.dispatch(ShopActions.getProducts())
    this.products$ = this.store.select(shopFeature.selectProducts)
  }

  public subscription(price: string): void {
    this.store.dispatch(ShopActions.subscribe({ price }))
  }
}
