import { selectIsRole } from '@selectors/app'
import { ShopStoreModule } from '../../store/shop/shop.module'
import { CommonModule } from '@angular/common'
import { IonicModule } from '@ionic/angular'
import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs';
import { Product } from '@models/product'
import { Store } from '@ngrx/store'
import { selectProducts } from '@selectors/shop'
import { ShopActions } from '@store/shop'

@Component({
  selector: 'qbit-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  imports: [CommonModule, IonicModule, ShopStoreModule],
  standalone: true
})
export class ShopComponent implements OnInit {
  public products$?: Observable<Product[]>
  public readonly isSupporter$: Observable<boolean>

  public constructor(
    private readonly store: Store
  ) {
    this.isSupporter$ = this.store.select(selectIsRole('supporter'))
  }

  public ngOnInit(): void {
    this.store.dispatch(ShopActions.getProducts())
    this.products$ = this.store.select(selectProducts)
  }

  public subscription(price: string): void {
    this.store.dispatch(ShopActions.subscribe({ price }))
  }
}
