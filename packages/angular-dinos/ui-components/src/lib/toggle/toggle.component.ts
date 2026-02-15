/* eslint-disable @angular-eslint/no-host-metadata-property */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopValueAccessorDirective } from '../directives/noop-value-accessor.directive';
import { injectNgControl } from '../utilities/inject-ng-control';

@Component({
  selector: 'ui-toggle',
  imports: [ReactiveFormsModule],
  template: `
    <legend class="fieldset-legend text-lg">{{ labelText() }}</legend>
    <label class="label cursor-pointer">
      <input
        [id]="id()"
        [name]="name()"
        type="checkbox"
        [formControl]="ngControl.control"
        class="toggle toggle-accent"
      />
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'fieldset',
  },
  hostDirectives: [NoopValueAccessorDirective],
})
export class ToggleComponent {
  protected readonly ngControl = injectNgControl();

  id = input.required<string>();
  name = input.required<string>();
  labelText = input.required<string>();
}
