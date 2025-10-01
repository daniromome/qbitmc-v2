import { Injectable, computed, inject, signal } from '@angular/core'
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

  public readonly height = toSignal(this.platform.resize.asObservable().pipe(map(() => this.platform.height())), {
    initialValue: this.platform.height()
  })

  public readonly isXL = computed(() => this.width() >= 1200)
  public readonly isLG = computed(() => this.width() >= 992)
  public readonly isMD = computed(() => this.width() >= 768)
  public readonly isSM = computed(() => this.width() >= 576)
  public readonly isXS = computed(() => this.width() >= 0)

  private readonly _darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  public readonly darkMode = signal<boolean>(this._darkModeMediaQuery.matches)

  public constructor() {
    this._darkModeMediaQuery.addEventListener('change', e => this.darkMode.set(e.matches))
  }
}
