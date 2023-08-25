/* eslint-disable @angular-eslint/no-host-metadata-property */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'ui-text-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <label *ngIf="labelText" [for]="inputId">{{ labelText }}</label>
    <input
      [id]="inputId"
      [name]="inputId"
      [class.error]="errorText"
      [(ngModel)]="inputValue"
      [placeholder]="placeHolderText"
      [disabled]="disabled"
    />
    <span class="error" *ngIf="errorText">
      {{ errorText }}
    </span>
  `,
  styleUrls: ['./text-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block form-control',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: TextInputComponent,
    },
  ],
})
export class TextInputComponent implements ControlValueAccessor, OnChanges {
  protected inputValue = '';
  #onChange: (value: string) => void = () => {};
  #onTouched = () => {};

  #touched = false;

  protected disabled = false;

  @Input({ required: true }) inputId!: string;
  @Input() labelText?: string;
  @Input() errorText?: string;
  @Input() placeHolderText?: string;

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes', changes);
    this.markAsTouched();
  }

  writeValue(value: string): void {
    this.inputValue = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.#onChange = fn;
  }

  registerOnTouched(onTouched: () => void) {
    this.#onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.#touched) {
      this.#onTouched();
      this.#touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }
}
