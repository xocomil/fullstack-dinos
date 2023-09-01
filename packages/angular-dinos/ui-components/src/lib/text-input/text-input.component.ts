/* eslint-disable @angular-eslint/no-host-metadata-property */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
    <label *ngIf="labelText" [for]="id">{{ labelText }}</label>
    <input
      *ngIf="type === 'number'; else textInput"
      [id]="id"
      [name]="name"
      [class.error]="errorText"
      [formControl]="ngControl.control"
      [placeholder]="placeholder"
      type="number"
    />
    <ng-template #textInput>
      <input
        [id]="id"
        [name]="name"
        [class.error]="errorText"
        [formControl]="ngControl.control"
        [placeholder]="placeholder"
        type="text"
      />
    </ng-template>

    <span class="error" *ngIf="errorText">
      {{ errorText }}
    </span>
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

  @Input({ required: true }) id!: string;
  @Input({ required: true }) name!: string;
  @Input() type: AllowedHtmlTypes = 'text';
  @Input() labelText?: string;
  @Input() errorText?: string;
  @Input({
    transform: (value: unknown) => (typeof value === 'string' ? value : ''),
  })
  placeholder = '';
}
