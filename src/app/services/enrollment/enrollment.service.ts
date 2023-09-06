import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { EnrollmentApplication } from '@models/application'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private readonly url: string

  public constructor(
    private readonly http: HttpClient
  ) {
    this.url = `${environment.API_URL}/enrollment`
  }

  public submit(application: EnrollmentApplication): Observable<Required<EnrollmentApplication>> {
    return this.http.post<Required<EnrollmentApplication>>(this.url, application)
  }

  public uploadMedia(files: File[]): Observable<string[]> {
    const url = `${this.url}/media`
    const form = new FormData()
    files.forEach(f => {
      form.append('media', f, f.name)
    })
    return this.http.post<string[]>(url, form)
  }

  public getMedia(): Observable<{ keys: string[], size: bigint }> {
    const url = `${this.url}/media`
    return this.http.get<{ keys: string[], size: bigint }>(url)
  }

  public getMediaResource(key: string): Observable<Blob> {
    const url = `${environment.MINIO_URL}/${key}`
    return this.http.get(url, { responseType: 'blob' })
  }

  public deleteMediaResource(key: string): Observable<unknown> {
    const url = `${this.url}/media/${key}`
    return this.http.delete<unknown>(url)
  }
}
