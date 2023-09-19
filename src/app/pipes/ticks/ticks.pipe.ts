import { Pipe, PipeTransform, inject } from '@angular/core'
import { DecimalPipe } from '@angular/common'

@Pipe({
  name: 'ticks',
  standalone: true
})
export class TicksPipe implements PipeTransform {
  private readonly decimalPipe = inject(DecimalPipe)

  public transform(value: number, unit: 'hours' | 'minutes' | 'seconds' | 'ticks' = 'hours'): string {
    switch (unit) {
      case 'hours': return $localize`${this.decimalPipe.transform((value / 20 / 60 / 60).toFixed(0))} hours`
      case 'minutes': return $localize`${this.decimalPipe.transform((value / 20 / 60).toFixed(0))} minutes`
      case 'seconds': return $localize`${this.decimalPipe.transform((value / 20).toFixed(0))} seconds`
      default: return $localize`${this.decimalPipe.transform(value)} ticks`
    }
  }
}
