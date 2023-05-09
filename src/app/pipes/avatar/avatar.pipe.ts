import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'avatar',
  standalone: true
})
export class AvatarPipe implements PipeTransform {
  public transform(value: string): string {
    const url = new URL(`https://crafatar.com/avatars/${value}`)
    url.searchParams.append('overlay', 'true')
    return value ? url.toString() : ''
  }
}
