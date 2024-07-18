import { Injectable, inject } from '@angular/core'
import { BUCKET, DeleteMediaRequest, GetMediaRequest, Media, UploadMediaRequest } from '@models/media'
import { AppwriteService } from '@services/appwrite'
import { Query } from 'appwrite'
import { Observable, forkJoin, from, map } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private readonly appwrite = inject(AppwriteService)

  public uploadMedia(request: UploadMediaRequest): Observable<Media[]> {
    const { entity, files, fileIds } = request
    const bucket = BUCKET[entity]
    return forkJoin(
      files.map((file, i) =>
        from(this.appwrite.storage.createFile(bucket, fileIds[i], file, [])).pipe(
          map(file => ({ ...file, url: this.appwrite.storage.getFileView(bucket, file.$id).toString() }))
        )
      )
    )
  }

  public getMedia(request: GetMediaRequest): Observable<Media[]> {
    const { entity, ids } = request
    const bucket = BUCKET[entity]
    return from(
      ids.length > 0
        ? this.appwrite.storage.listFiles(bucket, [Query.contains('$id', ids)])
        : this.appwrite.storage.listFiles(bucket)
    ).pipe(
      map(result => {
        if (result.total === 0) return []
        return result.files.map(file => ({
          ...file,
          url: this.appwrite.storage.getFilePreview(bucket, file.$id, request.width, request.height, undefined, 25).toString()
        }))
      })
    )
  }

  public deleteMediaResource(request: DeleteMediaRequest): Observable<unknown> {
    const { entity, id } = request
    const bucket = BUCKET[entity]
    return from(this.appwrite.storage.deleteFile(bucket, id))
  }
}
