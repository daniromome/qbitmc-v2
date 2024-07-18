import { Injectable, computed, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { Platform } from '@ionic/angular'
import { map } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ViewPortService {
  private readonly platform = inject(Platform)

  public readonly width = toSignal(this.platform.resize.asObservable().pipe(map(() => this.platform.width())), {
    initialValue: this.platform.width()
  })

  public readonly isXL = computed(() => this.width() >= 1200)
  public readonly isLG = computed(() => this.width() >= 992)
  public readonly isMD = computed(() => this.width() >= 768)
  public readonly isSM = computed(() => this.width() >= 576)
  public readonly isXS = computed(() => this.width() >= 0)
}
