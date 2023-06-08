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
    this.baseUrl = `${environment.API_URL}/stripe`
  }

  public products(): Observable<Product[]> {
    const url = this.url('products')
    return this.http.get<Product[]>(url)
  }

  public checkout(price: string): Observable<string> {
    const url = this.url('checkout')
    return this.http.post<string>(url, price, { responseType: 'text' as 'json' })
  }

  public portal(customer?: string): Observable<string> {
    const url = this.url('portal')
    return this.http.post<string>(url, customer, { responseType: 'text' as 'json' })
  }

  private url(...segments: string[]): string {
    segments.unshift(this.baseUrl)
    return segments.join('/')
  }
}
