import { Pipe, PipeTransform } from '@angular/core'
import { ROLE, Role } from '@models/role'

@Pipe({
  name: 'roleColor',
  standalone: true
})
export class RoleColorPipe implements PipeTransform {
  public transform(role: Role): unknown {
    switch (role) {
      case ROLE.ADMIN:
        return 'danger'
      case ROLE.MOD:
        return 'success'
      case ROLE.QBITOR:
        return 'primary'
      case ROLE.SUPPORTER:
        return 'warning'
      default:
        return 'medium'
    }
  }
}
