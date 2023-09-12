import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'fullstack-dinos-add-button',
  standalone: true,
  imports: [CommonModule],
  template: ` <button
    type="button"
    class="btn btn-success btn-outline btn-sm"
    (click)="click.emit()"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <span class="ml-2">Add Dino</span>
  </button>`,
  styleUrls: ['./add-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class AddButtonComponent {
  click = new EventEmitter<void>();
}
