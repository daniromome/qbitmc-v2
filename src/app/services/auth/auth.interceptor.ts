import { Injectable, inject } from '@angular/core'
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http'
import { Observable, switchMap } from 'rxjs'
import { Store } from '@ngrx/store'
import { appFeature } from '@store/app'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly store = inject(Store)

  public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const secureRoutes = ['profile', 'stripe', 'enrollment', 'logout']
    if (!secureRoutes.some(path => req.url.includes(path))) return next.handle(req)
    return this.store.select(appFeature.selectToken).pipe(
      switchMap(token => {
        if (!token) return next.handle(req)
        const request = req.clone({
          headers: req.headers.set('Authorization', `${token?.token_type} ${token?.access_token}`)
        })
        return next.handle(request)
      })
    )
  }
}
