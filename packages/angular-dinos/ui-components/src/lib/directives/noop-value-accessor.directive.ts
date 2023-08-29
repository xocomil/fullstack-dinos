// This code came from https://netbasal.com/forwarding-form-controls-to-custom-control-components-in-angular-701e8406cc55

import { Directive } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: NoopValueAccessorDirective,
    },
  ],
})
export class NoopValueAccessorDirective implements ControlValueAccessor {
  writeValue(_value: unknown): void {}
  registerOnChange(_value: unknown): void {}
  registerOnTouched(_value: unknown): void {}
}
