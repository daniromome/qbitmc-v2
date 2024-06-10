import { Injectable } from '@angular/core'
import { Account, Client, Databases, Functions, Storage } from 'appwrite'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AppwriteService {
  public readonly client = new Client().setEndpoint(environment.APPWRITE_ENDPOINT).setProject(environment.APPWRITE_PROJECT)
  public readonly account = new Account(this.client)
  public readonly functions = new Functions(this.client)
  public readonly databases = new Databases(this.client)
  public readonly storage = new Storage(this.client)
}
