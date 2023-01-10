import { Pipe, PipeTransform } from '@angular/core'
import { Role } from '@models/role'

@Pipe({
  name: 'roleColor',
  standalone: true
})
export class RoleColorPipe implements PipeTransform {
  public transform(role: Role): unknown {
    switch (role) {
      case 'admin':
        return 'danger'
      case 'mod':
        return 'success'
      case 'qbitor':
        return 'primary'
      case 'supporter':
        return 'warning'
      default:
        return 'medium'
    }
  }
}
