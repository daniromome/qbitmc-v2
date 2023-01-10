/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core'
import { environment } from '../../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { Product } from '@models/product'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private readonly baseUrl: string

  public constructor(
    private http: HttpClient
  ) {
    this.baseUrl = environment.STRIPE_URL
  }

  public products(): Observable<Product[]> {
    const url = this.url('products')
    return this.http.get<Product[]>(url)
  }

  public checkout(jwt: string, price: string): Observable<string> {
    const url = this.url('checkout')
    return this.http.post<string>(url, { price }, { headers: { Authorization: jwt } })
  }

  public portal(jwt: string): Observable<string> {
    const url = this.url('portal')
    return this.http.get<string>(url, { headers: { Authorization: jwt } })
  }

  private url(...segments: string[]): string {
    segments.unshift(this.baseUrl)
    segments.push('')
    return segments.join('/')
  }
}
