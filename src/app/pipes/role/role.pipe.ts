import { Pipe, PipeTransform } from '@angular/core'
import { Role } from '@models/role'

@Pipe({
  name: 'role',
  standalone: true
})
export class RolePipe implements PipeTransform {
  public transform(role: Role): unknown {
    switch (role) {
      case 'supporter':
        return 'qbitor+'
      case 'guest':
        return $localize`:@@guest:guest`
      default:
        return role
    }
  }
}
