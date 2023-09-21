import { Pipe, PipeTransform } from '@angular/core'
import { ROLE, Role } from '@models/role'

@Pipe({
  name: 'role',
  standalone: true
})
export class RolePipe implements PipeTransform {
  public transform(role: Role): unknown {
    switch (role) {
      case ROLE.SUPPORTER:
        return 'qbitor+'
      case ROLE.GUEST:
        return $localize`:@@guest:guest`
      default:
        return role
    }
  }
}
