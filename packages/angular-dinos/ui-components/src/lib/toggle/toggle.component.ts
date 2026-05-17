import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormField } from '@angular/forms/signals';

@Component({
  selector: 'ui-toggle',
  imports: [FormField],
  template: `
    <legend class="fieldset-legend text-lg">{{ labelText() }}</legend>
    <label class="label cursor-pointer">
      <input
        [id]="id()"
        type="checkbox"
        [formField]="formField()"
        class="toggle toggle-accent"
      />
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'fieldset',
  },
})
export class ToggleComponent {
  id = input.required<string>();
  labelText = input.required<string>();
  formField = input.required<any>();
}
