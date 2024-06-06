import { Injectable, inject } from '@angular/core'
import { EnrollmentApplicationDocument } from '@models/application'
import { AppwriteService } from '@services/appwrite'
import { Query } from 'appwrite'
import { Observable, from, map } from 'rxjs'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private readonly appwrite = inject(AppwriteService)

  public findByProfileId(id: string): Observable<EnrollmentApplicationDocument | undefined> {
    return from(
      this.appwrite.databases.listDocuments<EnrollmentApplicationDocument>(
        environment.APPWRITE_DATABASE,
        environment.APPWRITE_COLLECTION_APPLICATION,
        [Query.equal('profile', id)]
      )
    ).pipe(
      map(list => {
        if (list.total < 1) return undefined
        return list.documents.at(0)
      })
    )
  }
}
