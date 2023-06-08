import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'stat',
  standalone: true
})
export class StatPipe implements PipeTransform {
  public transform(value: string): string {
    switch (value) {
      case 'minecraft:custom minecraft:play_time': return $localize`Time played`
      case 'minecraft:custom minecraft:deaths': return $localize`Deaths`
      case 'minecraft:crafted minecraft:netherite_scrap': return $localize`Crafted netherite scraps`
      case 'minecraft:custom minecraft:traded_with_villager': return $localize`Traded with villager`
      default: return value
    }
  }
}
