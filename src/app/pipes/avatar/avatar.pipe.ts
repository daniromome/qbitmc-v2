import { Pipe, PipeTransform } from '@angular/core'

type AvatarType = 'avatar' | 'render-head' | 'render-body'

@Pipe({
  name: 'avatar',
  standalone: true
})
export class AvatarPipe implements PipeTransform {
  public transform(value: string, type: AvatarType = 'avatar'): string {
    const url = new URL(`https://crafatar.com/${this.getURI(type)}/${value}`)
    url.searchParams.append('overlay', 'true')
    return value ? url.toString() : ''
  }

  private getURI(type: AvatarType): string {
    switch (type) {
      case 'render-head': return 'renders/head'
      case 'render-body': return 'renders/body'
      default: return 'avatars'
    }
  }
}
