import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { StyledTextComponent } from '@components/styled-text/styled-text.component'
import { Store } from '@ngrx/store'
import { Observable, finalize, first, map } from 'rxjs'
import { StyledText, StyledTextForm, TextStyle } from '@models/styled-text'
import { animate, style, transition, trigger } from '@angular/animations'
import { appActions, appFeature } from '@store/app'
import { FormArray, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { stringifyStyledText } from '@utils'
import { REGEXP } from '@constants/regexp'
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonSegmentButton,
  IonLabel,
  IonIcon,
  IonCard,
  IonCardContent,
  IonItem,
  IonAccordionGroup,
  IonAccordion,
  IonButtons,
  IonButton,
  IonInput,
  IonFab,
  IonFabButton,
  IonText,
  IonRange,
  IonSegment,
  IonCheckbox
} from '@ionic/angular/standalone'
import { addIcons } from 'ionicons'
import { ban, sparkles, starHalf, star, add, trash, save } from 'ionicons/icons'

enum SliderLabel {
  SATURATION = 'saturation'
}

@Component({
  selector: 'qbit-nickname-editor',
  standalone: true,
  imports: [
    IonText,
    IonFabButton,
    IonFab,
    IonInput,
    IonButton,
    IonButtons,
    IonCheckbox,
    IonAccordion,
    IonAccordionGroup,
    IonItem,
    IonCardContent,
    IonCard,
    IonIcon,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    IonRange,
    CommonModule,
    StyledTextComponent,
    StyledTextComponent,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './nickname-editor.component.html',
  styleUrls: ['./nickname-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [style({ opacity: 0 }), animate('250ms ease-out', style({ opacity: 1 }))]),
      transition(':leave', [style({ opacity: 1 }), animate('250ms ease-in', style({ opacity: 0 }))])
    ])
  ]
})
export class NicknameEditorComponent implements OnInit {
  public readonly STYLE = TextStyle
  public readonly SLIDER_LABEL = SliderLabel
  public readonly form: FormArray<StyledTextForm>
  private readonly store = inject(Store)
  private readonly fb = inject(NonNullableFormBuilder)
  private readonly nickname$: Observable<StyledText[]>
  private readonly firstChange$: Observable<void>

  public constructor() {
    addIcons({ ban, sparkles, starHalf, star, add, trash, save })
    this.form = this.fb.array<StyledTextForm>([])
    this.nickname$ = this.store.select(appFeature.selectNickname).pipe(first(), takeUntilDestroyed())
    this.firstChange$ = this.form.valueChanges.pipe(
      first(),
      takeUntilDestroyed(),
      map(() => this.store.dispatch(appActions.setUnsavedChanges({ changes: true })))
    )
  }

  public ngOnInit(): void {
    this.nickname$
      .pipe(finalize(() => this.firstChange$.subscribe()))
      .subscribe(styledTextArray => styledTextArray.forEach(styledText => this.form.push(this.newStyledTextForm(styledText))))
  }

  public delete(index: number): void {
    this.form.markAsDirty()
    this.form.removeAt(index)
  }

  public save(): void {
    const nickname = this.form.controls.map((_, index) => stringifyStyledText(this.convertFormToStyledText(index))).join(' <r>')
    this.store.dispatch(appActions.updateNickname({ nickname }))
  }

  public add(index: number): void {
    this.form.markAsDirty()
    this.form.insert(index + 1, this.newStyledTextForm())
  }

  public newStyledTextForm(text?: StyledText): StyledTextForm {
    return this.fb.group({
      attributes: this.fb.group({
        content: this.fb.control<string>(text?.content ?? '', [Validators.pattern(REGEXP.VALID_NICKNAME)]),
        bold: this.fb.control<boolean>(text?.bold ?? false),
        strikethrough: this.fb.control<boolean>(text?.strikethrough ?? false),
        underline: this.fb.control<boolean>(text?.underline ?? false),
        italic: this.fb.control<boolean>(text?.italic ?? false),
        obfuscated: this.fb.control<boolean>(text?.obfuscated ?? false)
      }),
      style: this.fb.control<TextStyle | undefined>(text?.style?.style),
      color: this.fb.group({
        color: this.fb.control<string>(text?.style?.style === TextStyle.COLOR ? text.style.color : '#ffffff')
      }),
      gradient: this.fb.group({
        colors: this.fb.array(
          text?.style?.style === TextStyle.GRADIENT
            ? text.style.colors.map(color => this.fb.control(color))
            : [this.fb.control('#ffffff'), this.fb.control('#ffffff')]
        )
      }),
      rainbow: this.fb.group(
        text?.style?.style === TextStyle.RAINBOW
          ? {
              frequency: this.fb.control(text.style.frequency * 100),
              offset: this.fb.control(text.style.offset * 100),
              saturation: this.fb.control(text.style.saturation * 100)
            }
          : {
              frequency: this.fb.control(1),
              offset: this.fb.control(0),
              saturation: this.fb.control(30)
            }
      )
    })
  }

  public newGradientColor(index: number): void {
    this.form.at(index).controls.gradient.controls.colors.push(this.fb.control('#ffffff'))
  }

  public convertFormToStyledText(index: number): StyledText {
    const { attributes, style, color, gradient, rainbow } = this.form.at(index).getRawValue()
    switch (style) {
      case TextStyle.COLOR:
        return { ...attributes, style: { color: color.color, style } } as StyledText
      case TextStyle.GRADIENT:
        return { ...attributes, style: { colors: gradient.colors, style } } as StyledText
      case TextStyle.RAINBOW:
        return {
          ...attributes,
          style: {
            frequency: rainbow?.frequency / 100,
            offset: rainbow?.offset / 100,
            saturation: rainbow?.saturation / 100,
            style
          }
        } as StyledText
      default:
        return { ...attributes } as StyledText
    }
  }

  public sliderLabel(label: SliderLabel, value: number): string {
    return `${this.sliderLabelString(label)} ${value}%`
  }

  private sliderLabelString(label: SliderLabel): string {
    if (label === SliderLabel.SATURATION) return $localize`:@@text-style-gradient-saturation:Saturation`
    return label
  }
}
