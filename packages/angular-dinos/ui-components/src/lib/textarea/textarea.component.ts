import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopValueAccessorDirective } from '../directives/noop-value-accessor.directive';
import { injectNgControl } from '../utilities/inject-ng-control';

@Component({
  selector: 'ui-textarea',
  imports: [ReactiveFormsModule],
  template: `
    <label class="floating-label">
      <span>{{ placeholderDisplay() }}</span>
      <textarea
        [id]="id()"
        [name]="name()"
        class="textarea-bordered h-24 min-w-full"
        [placeholder]="placeholderDisplay()"
        [formControl]="ngControl.control"
        [class.error]="errorText()"
      ></textarea>
    </label>
    @if (altLabelText()) {
      <p class="label not-prose">{{ altLabelText() }}</p>
    }
    @if (errorText()) {
      <span class="error">
        {{ errorText() }}
      </span>
    }
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'fieldset',
  },
  hostDirectives: [NoopValueAccessorDirective],
})
export class TextareaComponent {
  protected readonly ngControl = injectNgControl();
  protected readonly placeholderDisplay = computed(() => {
    return this.placeholder() || this.labelText();
  });

  id = input.required<string>();
  name = input.required<string>();
  labelText = input.required<string>();
  altLabelText = input<string>();
  errorText = input<string>();
  placeholder = input('', {
    transform: (value: unknown) => (typeof value === 'string' ? value : ''),
  });
}
