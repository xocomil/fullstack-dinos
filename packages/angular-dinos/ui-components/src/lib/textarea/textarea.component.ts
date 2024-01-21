import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopValueAccessorDirective } from '../directives/noop-value-accessor.directive';
import { injectNgControl } from '../utilities/inject-ng-control';

@Component({
  selector: 'ui-textarea',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  template: `
    <label class="label">
      <span>{{ labelText() }}</span>
      @if (altLabelText()) {
        <span class="label-text-alt">{{ altLabelText() }}</span>
      }
    </label>
    <textarea
      [id]="id()"
      [name]="name()"
      class="textarea textarea-bordered h-24"
      [placeholder]="placeholder()"
      [formControl]="ngControl.control"
      [class.error]="errorText()"
    ></textarea>
    @if (errorText()) {
      <span class="error">
        {{ errorText() }}
      </span>
    }
  `,
  styleUrls: ['./textarea.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'form-control',
  },
  hostDirectives: [NoopValueAccessorDirective],
})
export class TextareaComponent {
  protected readonly ngControl = injectNgControl();

  id = input.required<string>();
  name = input.required<string>();
  labelText = input.required<string>();
  altLabelText = input<string>();
  errorText = input<string>();
  placeholder = input('', {
    transform: (value: unknown) => (typeof value === 'string' ? value : ''),
  });
}
