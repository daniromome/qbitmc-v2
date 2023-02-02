import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'stat',
  standalone: true
})
export class StatPipe implements PipeTransform {
  public transform(value: string): string {
    switch (value) {
      case 'minecraft:play_time': return $localize`Time played`
      case 'minecraft:deaths': return $localize`Deaths`
      case 'minecraft:netherite_ingot': return $localize`Crafted netherite`
      case 'minecraft:traded_with_villager': return $localize`Traded with villager`
      default: return value
    }
  }
}
