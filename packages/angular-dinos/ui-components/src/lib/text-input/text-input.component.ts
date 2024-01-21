import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopValueAccessorDirective } from '../directives/noop-value-accessor.directive';
import { injectNgControl } from '../utilities/inject-ng-control';

const AllowedHtmlTypes = ['text', 'number', 'email'] as const;
type AllowedHtmlTypes = (typeof AllowedHtmlTypes)[number];

@Component({
  selector: 'ui-text-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    @if (labelText()) {
      <label [for]="id()">{{ labelText() }}</label>
    }
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
    @if (errorText()) {
      <span class="error">
        {{ errorText() }}
      </span>
    }
  `,
  styleUrls: ['./text-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'form-control',
  },
  hostDirectives: [NoopValueAccessorDirective],
})
export class TextInputComponent {
  protected readonly ngControl = injectNgControl();

  id = input.required<string>();
  name = input.required<string>();
  type = input<AllowedHtmlTypes>('text');
  labelText = input<string>();
  errorText = input<string>();
  placeholder = input('', {
    transform: (value: unknown) => (typeof value === 'string' ? value : ''),
  });
}
