import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Renderer2, ViewEncapsulation, computed, effect, inject, input, signal, viewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Platform } from '@ionic/angular'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { map } from 'rxjs'

@Component({
  selector: 'qbit-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderComponent implements AfterViewInit {
  private readonly platform = inject(Platform)
  private readonly renderer = inject(Renderer2)
  private readonly slider = viewChild.required<ElementRef<HTMLDivElement>>('slider')
  private readonly track = viewChild.required<ElementRef<HTMLDivElement>>('sliderTrack')
  private readonly sliderWidth = signal(0)

  public readonly elementsInView = input.required<number>()
  public readonly elementsCount = computed(() => {
    const children = this.track().nativeElement.children.length
    const elementsInTrack = this.elementsInView() * 2
    let total = children > elementsInTrack ? elementsInTrack : children
    while (total < elementsInTrack) total += children
    return total
  })

  public readonly speed = input(4.5)
  public readonly slideWidth = computed(() => `${this.sliderWidth() / this.elementsInView()}px`)

  public readonly slideAnimationSpeed = computed(() => (this.elementsCount() * this.speed()) + 's')

  public constructor() {
    this.platform.resize.asObservable().pipe(
      map(() => this.slider().nativeElement.clientWidth),
      takeUntilDestroyed()
    ).subscribe((width) => this.sliderWidth.set(width))
    effect(() => {
      const track = this.track()
      const elementsInTrack = this.elementsInView() * 2
      if (track.nativeElement.children.length < elementsInTrack) {
        const newChildren = []
        while (newChildren.length < elementsInTrack - track.nativeElement.children.length) {
          for (let i = 0; i < track.nativeElement.children.length; i++) {
            const element = track.nativeElement.children.item(i)
            const clonedElement = element?.cloneNode(true)
            newChildren.push(clonedElement)
          }
        }
        for (const child of newChildren) {
          this.renderer.appendChild(track.nativeElement, child)
        }
      }
      if (track.nativeElement.children.length > elementsInTrack) {
        for (let i = elementsInTrack; i < track.nativeElement.children.length; i++) {
          const element = track.nativeElement.children.item(i)
          this.renderer.removeChild(track.nativeElement, element)
        }
      }
    })
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.sliderWidth.set(this.slider().nativeElement.clientWidth)
    }, 50)
  }
}
