import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { appActions } from '@store/app'
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone'
import { Meta, Title } from '@angular/platform-browser'

@Component({
  selector: 'qbit-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IonRouterOutlet, IonApp]
})
export class AppComponent implements OnInit {
  private readonly store = inject(Store)
  private readonly title = inject(Title)
  private readonly meta = inject(Meta)

  public ngOnInit(): void {
    this.store.dispatch(appActions.initialize())
    this.title.setTitle($localize`:@@site-title:Home - QbitMC`)
    this.meta.addTag({
      name: 'description',
      content: $localize`:@@site-description:We're a private gaming community. We get together to play in SMP's with a main focus on technical minecraft.`
    })
    this.meta.addTag({
      name: 'keywords',
      content: $localize`:@@site-keywords:Minecraft, Minecraft Server, Minecraft Survival, Minecraft Community, Minecraft SMP`
    })
    this.meta.addTag({
      name: 'og:title',
      content: 'QbitMC'
    })
    this.meta.addTag({
      name: 'og:description',
      content: $localize`:@@site-description:We're a private gaming community. We get together to play in SMP's with a main focus on technical minecraft.`
    })
    this.meta.addTag({
      name: 'og:image',
      content: 'assets/logo.svg'
    })
  }
}
