import { Injectable } from '@angular/core'
import { LoadingController } from '@ionic/angular'
import { from, Observable } from 'rxjs'
import { switchMap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  public constructor(
    private readonly loading: LoadingController
  ) { }

  public spin(message?: string): Observable<void> {
    return from(this.loading.create({
      message: message || $localize`:@@loading:Loading...`
    })).pipe(switchMap(loader => from(loader.present())))
  }

  public stop(): Observable<boolean> {
    return from(this.loading.dismiss())
  }
}
