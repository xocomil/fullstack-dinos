import { Directive } from '@angular/core';

@Directive({
  selector: '[uiNoopValueAccessor]',
  standalone: true,
})
export class NoopValueAccessorDirective {
  constructor() {}
}
