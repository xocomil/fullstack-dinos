/* eslint-disable @angular-eslint/no-host-metadata-property */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopValueAccessorDirective } from '../directives/noop-value-accessor.directive';
import { injectNgControl } from '../utilities/inject-ng-control';

@Component({
  selector: 'ui-toggle',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <label class="label cursor-pointer">
      <span class="font-semi-bold text-lg">{{ labelText }}</span>
      <input
        [id]="id"
        [name]="name"
        type="checkbox"
        [formControl]="ngControl.control"
        class="toggle toggle-accent"
      />
    </label>
  `,
  styleUrls: ['./toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'form-control',
  },
  hostDirectives: [NoopValueAccessorDirective],
})
export class ToggleComponent {
  protected readonly ngControl = injectNgControl();

  @Input({ required: true }) id!: string;
  @Input({ required: true }) name!: string;
  @Input({ required: true }) labelText!: string;
}
