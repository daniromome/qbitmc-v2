import { Injectable, inject } from '@angular/core'
import { Server, ServerDocument, VISIBILITY } from '@qbitmc/common'
import { AppwriteService } from '@services/appwrite'
import { Query } from 'appwrite'
import { Observable, from, map } from 'rxjs'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private readonly appwrite = inject(AppwriteService)

  public list(drafts: boolean = false): Observable<ServerDocument[]> {
    const queries = drafts
      ? [Query.equal('visibility', VISIBILITY.DRAFT)]
      : [Query.contains('visibility', [VISIBILITY.PUBLIC, VISIBILITY.PRIVATE])]
    return from(
      this.appwrite.databases.listDocuments<ServerDocument>(
        environment.APPWRITE_DATABASE,
        environment.APPWRITE_COLLECTION_SERVER,
        queries
      )
    ).pipe(map(list => list.documents))
  }

  public upsert(server: Server): Observable<ServerDocument> {
    return from(
      this.appwrite.databases.createDocument<ServerDocument>(
        environment.APPWRITE_DATABASE,
        environment.APPWRITE_COLLECTION_SERVER,
        server.$id,
        server
      )
    )
  }

  public getNewDrafts(): Observable<ServerDocument[]> {
    return from(this.appwrite.functions.createExecution(environment.APPWRITE_FUNCTION_LIST_UNREGISTERED_SERVERS)).pipe(
      map(result => {
        return JSON.parse(result.responseBody)
      })
    )
  }
}
