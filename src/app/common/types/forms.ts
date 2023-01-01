import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms'

export type FormFrom<T extends Record<string, any>> = {
  [K in keyof T]: NonNullable<T[K]> extends AbstractControl
    ? T[K]
    : NonNullable<T[K]> extends (infer R)[]
      ? FormArray<FormControl<R>>
      : NonNullable<T[K]> extends Record<any, any>
        ? FormGroup<FormFrom<T[K]>>
        : FormControl<T[K]>
};
