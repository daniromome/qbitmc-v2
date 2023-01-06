import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'bytes',
  standalone: true
})
export class BytesPipe implements PipeTransform {
  public transform(value: number | null, unit: 'MiB' = 'MiB'): string {
    if (value === null) return ''
    switch (unit) {
      case 'MiB':
        return `${(value / 1024 ** 2).toFixed(2)} ${unit}`
      default:
        return value.toString()
    }
  }
}
