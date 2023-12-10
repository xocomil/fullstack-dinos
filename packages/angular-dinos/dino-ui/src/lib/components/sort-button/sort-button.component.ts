import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'fullstack-dinos-sort-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button type="button" class="btn btn-xs" (click)="sortClicked($event)">
      @if (direction === 'desc') {
        @defer (on immediate) {
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-3 w-3"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75"
            />
          </svg>
        } @placeholder {
          &nbsp;
        }
      } @else {
        @defer (on immediate) {
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-3 w-3"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
            />
          </svg>
        } @placeholder {
          &nbsp;
        }
      }
    </button>
  `,
  styleUrls: ['./sort-button.component.scss'],
  host: {
    class: 'inline-block',
  },
})
export class SortButtonComponent {
  @Input() direction: 'asc' | 'desc' = 'asc';
  @Output() sortClick = new EventEmitter<MouseEvent>();

  protected sortClicked(event: MouseEvent) {
    this.sortClick.emit(event);
  }
}
