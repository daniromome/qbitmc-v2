import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { GetMediaRequest, GetMediaResponse, UploadMediaRequest } from '@models/media'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private readonly http = inject(HttpClient)
  private readonly url = `${environment.API_URL}/media`

  public uploadMedia(request: UploadMediaRequest): Observable<string[]> {
    const { entity, id, files } = request
    const url = `${this.url}/${entity}/${id}`
    const form = new FormData()
    files.forEach(f => {
      form.append('media', f, f.name)
    })
    return this.http.post<string[]>(url, form)
  }

  public getMedia(request: GetMediaRequest): Observable<GetMediaResponse> {
    const { entity, id } = request
    const url = `${this.url}/${entity}/${id}`
    return this.http.get<GetMediaResponse>(url)
  }

  public getMediaResource(key: string): Observable<Blob> {
    const url = `${environment.MINIO_URL}/${key}`
    return this.http.get(url, { responseType: 'blob' })
  }

  public deleteMediaResource(path: string): Observable<void> {
    const url = `${this.url}/${path}`
    return this.http.delete<void>(url)
  }
}
