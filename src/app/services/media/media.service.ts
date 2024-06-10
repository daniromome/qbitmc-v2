import { Injectable, inject } from '@angular/core'
import { DeleteMediaRequest, GetMediaRequest, Media, MediaEntity, UploadMediaRequest } from '@models/media'
import { AppwriteService } from '@services/appwrite'
import { Observable, forkJoin, from, map } from 'rxjs'
import { environment } from 'src/environments/environment'
import { ID } from 'appwrite'

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private readonly appwrite = inject(AppwriteService)
  private readonly buckets: Record<MediaEntity, string> = {
    applications: environment.APPWRITE_BUCKET_APPLICATION,
    server: ''
  } as const

  public uploadMedia(request: UploadMediaRequest): Observable<Media[]> {
    const { entity, files } = request
    const bucket = this.buckets[entity]
    return forkJoin(
      files.map(file =>
        from(this.appwrite.storage.createFile(bucket, ID.unique(), file, [])).pipe(
          map(file => ({ ...file, url: this.appwrite.storage.getFileView(bucket, file.$id).toString() }))
        )
      )
    )
  }

  public getMedia(request: GetMediaRequest): Observable<Media[]> {
    const { entity } = request
    const bucket = this.buckets[entity]
    return from(this.appwrite.storage.listFiles(bucket)).pipe(
      map(result => {
        if (result.total === 0) return []
        return result.files.map(file => ({
          ...file,
          url: this.appwrite.storage.getFileView(bucket, file.$id).toString()
        }))
      })
    )
  }

  public deleteMediaResource(request: DeleteMediaRequest): Observable<unknown> {
    const { entity, id } = request
    const bucket = this.buckets[entity]
    return from(this.appwrite.storage.deleteFile(bucket, id))
  }
}
