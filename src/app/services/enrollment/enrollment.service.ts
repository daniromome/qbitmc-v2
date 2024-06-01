import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { EnrollmentApplication } from '@models/application'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private readonly http = inject(HttpClient)
  private readonly url = `${environment.API_URL}/enrollment`

  public submit(application: EnrollmentApplication): Observable<Required<EnrollmentApplication>> {
    return this.http.post<Required<EnrollmentApplication>>(this.url, application)
  }
}
