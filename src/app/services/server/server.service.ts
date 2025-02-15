import { Injectable, inject, signal } from '@angular/core'
import { Store } from '@ngrx/store'
import { Server, ServerDocument, VISIBILITY } from '@qbitmc/common'
import { AppwriteService } from '@services/appwrite'
import { serverActions } from '@store/server'
import { Query } from 'appwrite'
import { Observable, from, map } from 'rxjs'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private readonly initialized = signal<boolean>(false)
  private readonly appwrite = inject(AppwriteService)
  private readonly store = inject(Store)

  public init(): void {
    if (this.initialized()) return
    this.initialized.set(true)
    this.store.dispatch(serverActions.getServers({ includeDrafts: false }))
  }

  public list(drafts: boolean = false): Observable<ServerDocument[]> {
    const queries = drafts
      ? [Query.equal('visibility', VISIBILITY.DRAFT)]
      : [Query.contains('visibility', [VISIBILITY.PUBLIC, VISIBILITY.PRIVATE, VISIBILITY.RESTRICTED])]
    return from(
      this.appwrite.databases.listDocuments<ServerDocument>(
        environment.APPWRITE_DATABASE,
        environment.APPWRITE_COLLECTION_SERVER,
        queries
      )
    ).pipe(map(list => list.documents))
  }

  public update(id: string, server: Partial<Server>): Observable<ServerDocument> {
    return from(
      this.appwrite.databases.updateDocument<ServerDocument>(
        environment.APPWRITE_DATABASE,
        environment.APPWRITE_COLLECTION_SERVER,
        id,
        server
      )
    )
  }

  public sync(): Observable<ServerDocument[]> {
    return from(this.appwrite.functions.createExecution(environment.APPWRITE_FUNCTION_LIST_UNREGISTERED_SERVERS)).pipe(
      map(result => {
        return JSON.parse(result.responseBody)
      })
    )
  }
}
