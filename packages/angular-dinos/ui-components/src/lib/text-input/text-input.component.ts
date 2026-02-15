import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopValueAccessorDirective } from '../directives/noop-value-accessor.directive';
import { injectNgControl } from '../utilities/inject-ng-control';

const AllowedHtmlTypes = ['text', 'number', 'email'] as const;
type AllowedHtmlTypes = (typeof AllowedHtmlTypes)[number];

@Component({
  selector: 'ui-text-input',
  imports: [ReactiveFormsModule],
  template: `
    <label [for]="id()" class="floating-label">
      <span>{{ labelText() }}</span>
      @if (type() === 'number') {
        <input
          [id]="id()"
          [name]="name()"
          [class.error]="errorText()"
          [formControl]="ngControl.control"
          [placeholder]="placeholder()"
          type="number"
        />
      } @else {
        <input
          [id]="id()"
          [name]="name()"
          [class.error]="errorText()"
          [formControl]="ngControl.control"
          [placeholder]="placeholder()"
          type="text"
        />
      }
    </label>
    @if (errorText()) {
      <span class="error">
        {{ errorText() }}
      </span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'fieldset',
  },
  hostDirectives: [NoopValueAccessorDirective],
})
export class TextInputComponent {
  protected readonly ngControl = injectNgControl();
  protected readonly placeholderDisplay = computed(() => {
    return this.placeholder() || this.labelText();
  });

  id = input.required<string>();
  name = input.required<string>();
  type = input<AllowedHtmlTypes>('text');
  labelText = input.required<string>();
  errorText = input<string>();
  placeholder = input('', {
    transform: (value: unknown) => (typeof value === 'string' ? value : ''),
  });
}
